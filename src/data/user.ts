import type { User, Experience, Qualification, Feedback } from "@/types/user";
import avatarClara from "@/assets/avatar.png";

export const USER: User = {
  id: "1",
  name: "Clara Andersen",
  email: "clara.andersen@example.com",
  phone: "+45 5023 9876",
  avatarUrl: avatarClara,
  rating: 4,
  role: "Stewardess",
  createdAt: "2025-01-15T10:00:00Z",
  location: "Copenhagen, Denmark",
  about:
    "Detail-oriented and experienced stewardess with a passion for creating exceptional guest experiences aboard luxury yachts.",
  skills: ["Hospitality", "Interior maintenance", "Provisioning", "Guest communication"],
};

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    userId: "1",
    title: "Island Hopping Charter",
    location: "Fiscardo to Ithaca, Greece",
    vessel: "52m Motor Yacht",
    date: "2025-09-12T00:00:00Z",
  },
  {
    id: "exp-2",
    userId: "1",
    title: "Mediterranean Season",
    location: "Cannes, France",
    vessel: "45m Sailing Yacht",
    date: "2024-07-04T00:00:00Z",
  },
];

export const QUALIFICATIONS: Qualification[] = [
  { id: "qual-1", userId: "1", name: "STCW Basic Safety" },
  { id: "qual-2", userId: "1", name: "ENG1 Medical" },
  { id: "qual-3", userId: "1", name: "Food Hygiene Level 2" },
];

export const FEEDBACK: Feedback[] = [
  {
    id: "fb-1",
    userId: "1",
    authorId: "author-1", // Would be a real user ID in production
    comment: "Clara was incredibly professional and attentive to detail throughout the season.",
    createdAt: "2025-03-12T12:00:00Z",
  },
  {
    id: "fb-2",
    userId: "1",
    authorId: "author-2", // Would be a real user ID in production
    comment: "A calm presence during stressful charters — great with guests and crew alike.",
    createdAt: "2025-04-28T09:30:00Z",
  },
];

// Helper to get user profile with relations
import type { UserProfile, FeedbackWithAuthor } from "@/types/user";

export function getUserProfile(): UserProfile {
  const feedbackWithAuthor: FeedbackWithAuthor[] = FEEDBACK.map((fb) => ({
    ...fb,
    author: {
      id: fb.authorId,
      name: fb.authorId === "author-1" ? "Captain J. Williams" : "Chief Steward",
      avatarUrl: undefined,
    },
  }));

  return {
    ...USER,
    experiences: EXPERIENCES,
    qualifications: QUALIFICATIONS,
    feedback: feedbackWithAuthor,
  };
}
