import { getAccountActivity } from "./accountActivity";
import { getCartItems } from "./cart";

export const MAX_RENTALS_ALLOWED = 3;

function getActiveRentalQuantity(user) {
  const { activeRentals } = getAccountActivity(user);
  return activeRentals.reduce((sum, rental) => sum + Number(rental.quantity || 0), 0);
}

function getCartRentalQuantity() {
  const items = getCartItems();
  return items
    .filter((item) => item.mode === "rent")
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function canAddRentalToCart(user, nextQuantity = 1) {
  const activeRentalQty = getActiveRentalQuantity(user);
  const cartRentalQty = getCartRentalQuantity();
  const projectedTotal = activeRentalQty + cartRentalQty + Number(nextQuantity || 0);

  return {
    allowed: projectedTotal <= MAX_RENTALS_ALLOWED,
    remaining: Math.max(0, MAX_RENTALS_ALLOWED - (activeRentalQty + cartRentalQty)),
    maxAllowed: MAX_RENTALS_ALLOWED,
  };
}

export function canCheckoutRentals(user) {
  const activeRentalQty = getActiveRentalQuantity(user);
  const cartRentalQty = getCartRentalQuantity();
  const projectedTotal = activeRentalQty + cartRentalQty;

  return {
    allowed: projectedTotal <= MAX_RENTALS_ALLOWED,
    remaining: Math.max(0, MAX_RENTALS_ALLOWED - activeRentalQty),
    maxAllowed: MAX_RENTALS_ALLOWED,
  };
}
