import type { Course } from "@/types/course";

type PriceInput = Pick<
  Course,
  "priceModel" | "priceAmount" | "currency" | "priceInterval"
>;

export const formatCoursePrice = (course: PriceInput): string => {
  if (course.priceModel === "free") {
    return "Gratis";
  }

  if (course.priceModel === "paid_once") {
    if (course.priceAmount != null && course.currency) {
      return `Pago único — ${course.priceAmount} ${course.currency}`;
    }

    return "Pago único — precio no verificado";
  }

  if (course.priceModel === "subscription") {
    if (course.priceAmount != null && course.currency) {
      if (course.priceInterval === "month") {
        return `${course.priceAmount} ${course.currency} / mes`;
      }

      if (course.priceInterval === "year") {
        return `${course.priceAmount} ${course.currency} / año`;
      }
    }

    return "Suscripción — precio no verificado";
  }

  return "Precio no verificado";
};
