import type { CategorySlug } from "@/types/category";

export interface CategoryDefinition {
  slug: CategorySlug;
  name: string;
  description: string;
}

/**
 * Predefined categories - matches the seeded categories in the database
 * This is the source of truth for categories in the application
 */
export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "race",
    name: "Race / Regatta",
    description: "Competitive sailing events and club regattas.",
  },
  {
    slug: "cruise",
    name: "Cruise / Trip",
    description: "Casual group trips and weekend sails.",
  },
  {
    slug: "meetup",
    name: "Meetup / Social",
    description: "Dock gatherings and community meetups.",
  },
  {
    slug: "training",
    name: "Training / Workshop",
    description: "Sailing lessons or navigation courses.",
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    description: "Workdays, boat prep, or dock repairs.",
  },
  {
    slug: "party",
    name: "Party",
    description: "After-sail parties and harbor celebrations.",
  },
  {
    slug: "meeting",
    name: "Club Meeting",
    description: "Official club meetings or AGMs.",
  },
  {
    slug: "open-day",
    name: "Open Day / Try Sailing",
    description: "Events for new sailors or public demos.",
  },
  {
    slug: "charity",
    name: "Charity Sail",
    description: "Fundraisers or awareness regattas.",
  },
  {
    slug: "other",
    name: "Other",
    description: "Custom or unclassified events.",
  },
];

/**
 * Get category definition by slug
 */
export function getCategoryBySlug(slug: CategorySlug): CategoryDefinition | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Validate that a slug is a valid category
 */
export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORIES.some((cat) => cat.slug === slug);
}
