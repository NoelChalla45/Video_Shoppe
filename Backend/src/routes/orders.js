import express from "express";
import { OrderType, PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

function normalizeItems(items = []) {
  const grouped = new Map();

  for (const raw of items) {
    const id = Number.parseInt(raw?.id, 10);
    const quantity = Number.parseInt(raw?.quantity, 10);
    const mode = String(raw?.mode || "rent").toLowerCase();

    if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity <= 0) {
      continue;
    }

    const orderType = mode === "buy" ? OrderType.PURCHASE : OrderType.RENTAL;
    const key = `${id}-${orderType}`;
    const current = grouped.get(key) || { id, quantity: 0, orderType };
    grouped.set(key, { ...current, quantity: current.quantity + quantity });
  }

  return Array.from(grouped.values());
}

router.post("/checkout", requireAuth, async (req, res) => {
  const userId = req.user.userId;
  const normalizedItems = normalizeItems(req.body?.items);

  if (normalizedItems.length === 0) {
    return res.status(400).json({ error: "Checkout items are required." });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const ids = [...new Set(normalizedItems.map((item) => item.id))];
      const inventoryRows = await tx.inventory.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, price: true, stock: true },
      });
      const stockById = new Map(inventoryRows.map((row) => [row.id, row]));

      for (const item of normalizedItems) {
        const row = stockById.get(item.id);
        if (!row) throw new Error(`NOT_FOUND:${item.id}`);
        if (row.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${row.id}:${row.name}:${row.stock}:${item.quantity}`);
        }
      }

      const orderItemsData = normalizedItems.map((item) => {
        const row = stockById.get(item.id);
        const unitPrice = item.orderType === OrderType.PURCHASE ? row.price * 5 : row.price;
        return {
          inventoryId: row.id,
          title: row.name,
          quantity: item.quantity,
          unitPrice,
          orderType: item.orderType,
        };
      });

      const totalAmount = orderItemsData.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

      for (const item of normalizedItems) {
        await tx.inventory.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: Number(totalAmount.toFixed(2)),
          items: {
            create: orderItemsData.map((item) => ({
              inventoryId: item.inventoryId,
              title: item.title,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice.toFixed(2)),
              orderType: item.orderType,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return res.status(201).json({ message: "Checkout completed.", order: result });
  } catch (err) {
    const message = String(err?.message || "");
    if (message.startsWith("NOT_FOUND:")) {
      const [, id] = message.split(":");
      return res.status(404).json({ error: `DVD ${id} was not found.` });
    }
    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      const [, id, name, stock, requested] = message.split(":");
      return res.status(409).json({
        error: `Not enough stock for "${name}" (ID ${id}). In stock: ${stock}, requested: ${requested}.`,
      });
    }
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Checkout failed." });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
  } catch (err) {
    console.error("Fetch my orders error:", err);
    return res.status(500).json({ error: "Failed to fetch customer orders." });
  }
});

router.get("/recent", requireAuth, requireRole(["EMPLOYEE", "OWNER"]), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json(orders);
  } catch (err) {
    console.error("Fetch recent orders error:", err);
    return res.status(500).json({ error: "Failed to fetch recent orders." });
  }
});

export default router;
