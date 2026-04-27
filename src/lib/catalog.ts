import normalizedCourses from "../../data/normalized/courses.json";
import { courses as fallbackCourses } from "@/data/courses";
import { CourseSchema, type Course } from "../lib/schema/course";
import { slugify } from "@/utils/slugify";

const formatDuration = (durationHours: number | null) => {
  if (durationHours == null) {
    return "Duración no disponible";
  }
  return durationHours === 1 ? "1 hora" : `${durationHours} horas`;
};

const fromFallbackCourse = (course: (typeof fallbackCourses)[number]): Course => ({
  id: course.id,
  platform: course.platform,
  title: course.title,
  url: course.externalUrl,
  skillSlug: slugify(course.skillTags[0] ?? course.title),
  level:
    course.level === "Beginner"
      ? "beginner"
      : course.level === "Intermediate"
        ? "intermediate"
        : course.level === "Advanced"
          ? "advanced"
          : "unknown",
  durationHours: null,
  language: course.language,
  priceModel: course.priceModel,
  priceAmount: course.priceAmount,
  currency: course.currency,
  priceInterval: course.priceInterval,
  rating: course.rating ?? null,
  reviewCount: null,
  certificate: course.certificate,
  lastUpdatedAt: null,
  shortDescription: course.shortDescription,
  source: "manual"
});

const fallbackCatalog = fallbackCourses.map(fromFallbackCourse);

const parsedCatalog = CourseSchema.array().safeParse(normalizedCourses);

const catalog = parsedCatalog.success && parsedCatalog.data.length > 0
  ? parsedCatalog.data
  : fallbackCatalog;

export const getAllCourses = () => catalog;

export const getCoursesBySkill = (skillSlug: string) =>
  catalog.filter((course) => course.skillSlug === skillSlug);

export const getCourseById = (courseId: string) =>
  catalog.find((course) => course.id === courseId) ?? null;

export const getAvailableSkills = () =>
  Array.from(new Set(catalog.map((course) => course.skillSlug))).sort();

export const getCourseDurationLabel = (course: Course) =>
  formatDuration(course.durationHours);

export const getCoursePriceLabel = (course: Course) => {
  if (course.priceModel === "free") {
    return "Gratis";
  }

  if (course.priceAmount == null || course.currency == null) {
    if (course.priceModel === "subscription") {
      return "Suscripción (precio no disponible)";
    }
    if (course.priceModel === "paid_once") {
      return "Pago único (precio no disponible)";
    }
    return "Precio no disponible";
  }

  const formattedAmount = `${course.currency === "EUR" ? "€" : course.currency}${course.priceAmount}`;
  if (course.priceModel === "subscription") {
    const intervalLabel =
      course.priceInterval === "year"
        ? "año"
        : course.priceInterval === "month"
          ? "mes"
          : "periodo";
    return `${formattedAmount}/${intervalLabel}`;
  }

  return formattedAmount;
};

export const getSkillTitle = (skillSlug: string) =>
  skillSlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
