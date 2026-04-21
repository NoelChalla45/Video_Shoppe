import express from "express";
import { OrderType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function toCartItemPayload(item) {
  const unitPrice =
    item.orderType === OrderType.PURCHASE
      ? Number(item.inventory.price || 0) * 5
      : Number(item.inventory.price || 0);

  return {
    id: item.inventory.id,
    itemKey: `${item.inventory.id}-${item.orderType === OrderType.PURCHASE ? "buy" : "rent"}`,
    name: item.inventory.name,
    image: item.inventory.image || "",
    mode: item.orderType === OrderType.PURCHASE ? "buy" : "rent",
    quantity: Number(item.quantity || 0),
    unitPrice: Number(unitPrice.toFixed(2)),
    canRent: item.inventory.canRent,
    canBuy: item.inventory.canBuy,
    stock: item.inventory.stock,
  };
}

async function loadCartItems(userId) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      inventory: {
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          stock: true,
          canRent: true,
          canBuy: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return items.map(toCartItemPayload);
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const items = await loadCartItems(req.user.userId);
    res.json(items);
  } catch (err) {
    console.error("Load cart error:", err);
    res.status(500).json({ error: "Failed to load cart." });
  }
});

router.post("/items", requireAuth, async (req, res) => {
  const inventoryId = Number.parseInt(req.body?.inventoryId, 10);
  const quantity = Number.parseInt(req.body?.quantity, 10) || 1;
  const mode = String(req.body?.mode || "rent").toLowerCase();
  const orderType = mode === "buy" ? OrderType.PURCHASE : OrderType.RENTAL;

  if (!Number.isInteger(inventoryId) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid cart item." });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findUnique({
        where: { id: inventoryId },
        select: { id: true, name: true, stock: true, canRent: true, canBuy: true },
      });

      if (!inventory) {
        throw new Error("NOT_FOUND");
      }
      if (orderType === OrderType.RENTAL && !inventory.canRent) {
        throw new Error("RENT_DISABLED");
      }
      if (orderType === OrderType.PURCHASE && !inventory.canBuy) {
        throw new Error("BUY_DISABLED");
      }
      if (inventory.stock <= 0) {
        throw new Error("OUT_OF_STOCK");
      }

      const existing = await tx.cartItem.findUnique({
        where: {
          userId_inventoryId_orderType: {
            userId: req.user.userId,
            inventoryId,
            orderType,
          },
        },
      });

      const nextQuantity = Number(existing?.quantity || 0) + quantity;
      if (nextQuantity > inventory.stock) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      await tx.cartItem.upsert({
        where: {
          userId_inventoryId_orderType: {
            userId: req.user.userId,
            inventoryId,
            orderType,
          },
        },
        update: { quantity: nextQuantity },
        create: {
          userId: req.user.userId,
          inventoryId,
          quantity,
          orderType,
        },
      });
    });

    const items = await loadCartItems(req.user.userId);
    res.status(201).json(items);
  } catch (err) {
    const message = String(err?.message || "");
    if (message === "NOT_FOUND") {
      return res.status(404).json({ error: "DVD not found." });
    }
    if (message === "RENT_DISABLED") {
      return res.status(409).json({ error: "This DVD is not currently available to rent." });
    }
    if (message === "BUY_DISABLED") {
      return res.status(409).json({ error: "This DVD is not currently available to buy." });
    }
    if (message === "OUT_OF_STOCK" || message === "INSUFFICIENT_STOCK") {
      return res.status(409).json({ error: "There is not enough stock to add that item to the cart." });
    }
    console.error("Add cart item error:", err);
    res.status(500).json({ error: "Failed to update cart." });
  }
});

router.delete("/items/:inventoryId/:mode", requireAuth, async (req, res) => {
  const inventoryId = Number.parseInt(req.params.inventoryId, 10);
  const mode = String(req.params.mode || "rent").toLowerCase();
  const orderType = mode === "buy" ? OrderType.PURCHASE : OrderType.RENTAL;

  if (!Number.isInteger(inventoryId)) {
    return res.status(400).json({ error: "Invalid cart item." });
  }

  try {
    await prisma.cartItem.deleteMany({
      where: {
        userId: req.user.userId,
        inventoryId,
        orderType,
      },
    });

    const items = await loadCartItems(req.user.userId);
    res.json(items);
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ error: "Failed to remove cart item." });
  }
});

router.delete("/", requireAuth, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.userId } });
    res.json([]);
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart." });
  }
});

export default router;
