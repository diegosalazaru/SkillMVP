import normalizedCatalog from "../../data/normalized/courses.json";
import { courses as fallbackCourses } from "@/data/courses";
import { CourseSchema, type Course as NormalizedCourse } from "@/lib/schema/course";
import type { Course } from "@/types/course";

const mapPlatform = (platform: string): Course["platform"] | null => {
  const normalized = platform.trim().toLowerCase();

  if (normalized === "coursera") {
    return "Coursera";
  }
  if (normalized === "udemy") {
    return "Udemy";
  }
  if (normalized === "edx") {
    return "edX";
  }
  if (
    normalized === "microsoft learn" ||
    normalized === "microsoft-learn" ||
    normalized === "microsoft_learn"
  ) {
    return "Microsoft Learn";
  }

  return null;
};

const mapLevel = (level: NormalizedCourse["level"]): Course["level"] => {
  if (level === "advanced") {
    return "Advanced";
  }
  if (level === "intermediate") {
    return "Intermediate";
  }
  return "Beginner";
};

const formatDurationText = (durationHours: number | null): string => {
  if (durationHours == null) {
    return "Duration pending verification";
  }

  return `${durationHours} horas`;
};

const formatPriceText = (course: NormalizedCourse): string => {
  if (course.priceModel === "free") {
    return course.certificate ? "Free (paid certificate)" : "Free";
  }

  if (course.priceModel === "subscription") {
    return "Free with paid option";
  }

  if (course.priceModel === "paid_once") {
    return course.certificate ? "Pago (certificado incluido)" : "Pago";
  }

  return "Precio no verificado";
};

const mapCourse = (course: NormalizedCourse): Course | null => {
  const platform = mapPlatform(course.platform);

  if (!platform) {
    return null;
  }

  return {
    id: course.id,
    title: course.title,
    platform,
    skillTags: [course.skillSlug],
    level: mapLevel(course.level),
    priceModel: course.priceModel,
    priceAmount: course.priceAmount,
    currency: course.currency,
    priceInterval: course.priceInterval,
    priceText: formatPriceText(course),
    durationText: formatDurationText(course.durationHours),
    rating: course.rating ?? undefined,
    language: course.language,
    certificate: course.certificate ?? false,
    shortDescription: course.shortDescription,
    syllabusBullets: course.syllabusBullets,
    prerequisitesBullets: course.prerequisitesBullets,
    externalUrl: course.url
  };
};

const parsedCatalog = CourseSchema.array().safeParse(normalizedCatalog);

const normalizedCourses = parsedCatalog.success
  ? parsedCatalog.data
      .map(mapCourse)
      .filter((course): course is Course => course !== null)
  : [];

export const courses: Course[] =
  normalizedCourses.length > 0 ? normalizedCourses : fallbackCourses;
