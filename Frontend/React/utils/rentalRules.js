// Shared rental-limit rules used by the customer flow.

export const MAX_RENTALS_ALLOWED = 3;

function getCartRentalQuantity(items = []) {
  return items
    .filter((item) => item.mode === "rent")
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function canAddRentalToCart(activeRentalQty = 0, cartItems = [], nextQuantity = 1) {
  const cartRentalQty = getCartRentalQuantity(cartItems);
  const projectedTotal = activeRentalQty + cartRentalQty + Number(nextQuantity || 0);

  return {
    allowed: projectedTotal <= MAX_RENTALS_ALLOWED,
    remaining: Math.max(0, MAX_RENTALS_ALLOWED - (activeRentalQty + cartRentalQty)),
    maxAllowed: MAX_RENTALS_ALLOWED,
  };
}

export function canCheckoutRentals(activeRentalQty = 0, cartItems = []) {
  const cartRentalQty = getCartRentalQuantity(cartItems);
  const projectedTotal = activeRentalQty + cartRentalQty;

  return {
    allowed: projectedTotal <= MAX_RENTALS_ALLOWED,
    remaining: Math.max(0, MAX_RENTALS_ALLOWED - activeRentalQty),
    maxAllowed: MAX_RENTALS_ALLOWED,
  };
}
