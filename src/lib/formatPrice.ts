import type { Course } from "@/types/course";

type PriceInput = Pick<
  Course,
  "priceModel" | "priceAmount" | "currency" | "priceInterval"
>;

export const formatCoursePrice = (course: PriceInput): string => {
  if (course.priceModel === "free") {
    return "Free";
  }

  if (course.priceModel === "paid_once") {
    if (course.priceAmount != null && course.currency) {
      return `One-time payment — ${course.priceAmount} ${course.currency}`;
    }

    return "One-time payment — price unverified";
  }

  if (course.priceModel === "subscription") {
    if (course.priceAmount != null && course.currency) {
      if (course.priceInterval === "month") {
        return `${course.priceAmount} ${course.currency} / month`;
      }

      if (course.priceInterval === "year") {
        return `${course.priceAmount} ${course.currency} / year`;
      }
    }

    return "Subscription — price unverified";
  }

  return "Price not verified";
};
