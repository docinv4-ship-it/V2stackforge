import { parallelsMailingListDiscount } from "./coupon";
import { parallelsBlackFridayWatch } from "./black-friday";

export { parallelsMailingListDiscount };
export { parallelsBlackFridayWatch };

export const parallelsDeals = [
  parallelsMailingListDiscount,
  parallelsBlackFridayWatch,
] as const;

export function getActiveParallelsDeals() {
  return parallelsDeals.filter((deal) => deal.active);
}