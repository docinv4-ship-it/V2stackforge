import { parallelsTool } from "../tool";

export const parallelsMailingListDiscount = {
  slug: "parallels-mailing-list-discount",
  title: "Parallels Mailing List Discount",
  summary: "The official store shows a mailing-list offer for 15% off purchase.",
  discount: "15% off purchase*",
  sourceUrl: parallelsTool.buyUrl,
  active: true,
  note:
    "Exclusions apply and the discount is not stackable. Use the official buy page and mailing list prompt.",
  cta: {
    label: "See the official offer",
    href: parallelsTool.buyUrl,
  },
} as const;