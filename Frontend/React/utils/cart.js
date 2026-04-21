import { apiFetchJson } from "./api";

export function getCartItemKey(inventoryId, mode = "rent") {
  return `${inventoryId}-${mode}`;
}

export async function getCartItems(token) {
  return apiFetchJson("/api/cart", {
    token,
    errorMessage: "Failed to load cart.",
  });
}

export async function addItemToCart(movie, mode = "rent", token) {
  return apiFetchJson("/api/cart/items", {
    method: "POST",
    token,
    body: JSON.stringify({
      inventoryId: movie.id,
      mode,
      quantity: 1,
    }),
    errorMessage: "Failed to add item to cart.",
  });
}

export async function removeCartItem(inventoryId, mode, token) {
  return apiFetchJson(`/api/cart/items/${inventoryId}/${mode}`, {
    method: "DELETE",
    token,
    errorMessage: "Failed to remove item from cart.",
  });
}

export async function clearCartItems(token) {
  return apiFetchJson("/api/cart", {
    method: "DELETE",
    token,
    errorMessage: "Failed to clear cart.",
  });
}
