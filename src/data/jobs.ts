import type { Job, JobRequirement, JobExperience, JobQualification } from "@/types/job";

export const JOBS: Job[] = [
  {
    id: "1",
    isFavorite: false,
    title: "Engineer",
    type: "Permanent",
    date: "2025-12-01",
    vessel: "38m Motor Yacht",
    locationId: "loc-4",
    description:
      "We are looking for an engineer to join a 38m M/Y. Vessel will be crossing from Malmö, Sweden to Canary Islands, Spain for season early December. Joining a team of 2 rotational chief engineers and a permanent 2nd engineer. The role will require work on deck during guest trips and mooring operation. This works out to be approx. 80/20 Engine Room/Deck. Responsible for maintaining and repairing the yacht's mechanical and electrical systems.",
  },
  {
    id: "2",
    isFavorite: false,
    title: "Chief Steward(ess)",
    type: "Permanent",
    date: "2025-11-15",
    vessel: "52m Motor Yacht",
    locationId: "loc-5",
    description:
      "Great opportunity for a chief stewardess on a newbuild 52m private motor yacht. Candidate must be professional, well organised and demonstrate good leadership skills. The candidate will be expected to manage all areas of the interior department and liaise with the owners private chef when required. During the 3 month trial period candidate will work 2-4 weeks at owners winter villa to join his permanent team to get to know the owner and his family and vice versa.",
  },
  {
    id: "3",
    isFavorite: false,
    title: "Captain",
    type: "Permanent",
    date: "2025-12-01",
    vessel: "60m Motor Yacht",
    locationId: "loc-6",
    description:
      "We are seeking an experienced Captain to oversee the operation and navigation of a 60-meter motor yacht. The ideal candidate will have a strong background in maritime operations, excellent leadership skills, and a commitment to safety and customer service.",
  },
  {
    id: "4",
    isFavorite: false,
    title: "Chef",
    type: "Permanent",
    date: "2025-11-15",
    vessel: "45m Motor Yacht",
    locationId: "loc-7",
    description:
      "We are looking for a talented and experienced chef to join a 45m motor yacht. The ideal candidate will have a passion for culinary arts, experience in high-end dining, and the ability to cater to diverse dietary needs while at sea. The owners are health-conscious and follow specific dietary routines. Excellent knowledge of gluten-free options, balanced menus, and seasonal cuisine is essential.",
  },
  {
    id: "5",
    isFavorite: false,
    title: "Deckhand",
    type: "Permanent",
    date: "2025-11-20",
    vessel: "30m Motor Yacht",
    locationId: "loc-8",
    description:
      "We seek an experienced Deck-engineer to work on a 30-meter yacht. Responsible for maintaining the exterior of the yacht and assisting with docking and undocking procedures.",
  },
];

export const JOB_REQUIREMENTS: JobRequirement[] = [
  // Job 1
  { id: "req-1", jobId: "1", requirement: "Proven experience as a marine engineer.", order: 0 },
  { id: "req-2", jobId: "1", requirement: "Knowledge of mechanical and electrical systems.", order: 1 },
  { id: "req-3", jobId: "1", requirement: "Ability to troubleshoot and repair equipment.", order: 2 },
  // Job 2
  { id: "req-4", jobId: "2", requirement: "Responsible for providing excellent service to guests and maintaining the interior of the yacht.", order: 0 },
  { id: "req-5", jobId: "2", requirement: "Previous experience in a similar role.", order: 1 },
  { id: "req-6", jobId: "2", requirement: "Excellent communication and interpersonal skills.", order: 2 },
  { id: "req-7", jobId: "2", requirement: "Ability to multitask and work under pressure.", order: 3 },
  // Job 3
  { id: "req-8", jobId: "3", requirement: "Valid captain's license and certifications.", order: 0 },
  { id: "req-9", jobId: "3", requirement: "Extensive experience in yacht navigation and operations.", order: 1 },
  { id: "req-10", jobId: "3", requirement: "Strong leadership and team management skills.", order: 2 },
  { id: "req-11", jobId: "3", requirement: "Excellent communication and interpersonal skills.", order: 3 },
  // Job 4
  { id: "req-12", jobId: "4", requirement: "Proven experience as a yacht chef or in a similar role.", order: 0 },
  { id: "req-13", jobId: "4", requirement: "Ability to create diverse and high-quality menus.", order: 1 },
  { id: "req-14", jobId: "4", requirement: "Knowledge of food safety and hygiene standards.", order: 2 },
  { id: "req-15", jobId: "4", requirement: "Excellent organizational and time-management skills.", order: 3 },
  // Job 5
  { id: "req-16", jobId: "5", requirement: "Previous experience as a deckhand.", order: 0 },
  { id: "req-17", jobId: "5", requirement: "Knowledge of boat maintenance and cleaning.", order: 1 },
  { id: "req-18", jobId: "5", requirement: "Ability to work in a team and follow instructions.", order: 2 },
];

export const JOB_EXPERIENCE: JobExperience[] = [
  { id: "exp-1", jobId: "1", experience: "Minimum 3 years of experience as a marine engineer.", order: 0 },
  { id: "exp-2", jobId: "2", experience: "Minimum 2 years in a similar role.", order: 0 },
  { id: "exp-3", jobId: "3", experience: "Minimum 5 years of experience as a yacht captain.", order: 0 },
  { id: "exp-4", jobId: "4", experience: "Minimum 3 years of experience as a yacht chef.", order: 0 },
  { id: "exp-5", jobId: "5", experience: "Minimum 1-2 years of experience as a deckhand.", order: 0 },
];

export const JOB_QUALIFICATIONS: JobQualification[] = [
  // Job 1
  { id: "qual-1", jobId: "1", qualification: "STCW 95 (STCW 2010)", order: 0 },
  { id: "qual-2", jobId: "1", qualification: "ENG1 (Medical Certificate)", order: 1 },
  { id: "qual-3", jobId: "1", qualification: "MCA Approved Engine Course (AEC 1 & 2) Certificate", order: 2 },
  { id: "qual-4", jobId: "1", qualification: "GMDSS Certification", order: 3 },
  { id: "qual-5", jobId: "1", qualification: "Relevant maritime visas.", order: 4 },
  // Job 2
  { id: "qual-6", jobId: "2", qualification: "STCW 95 (STCW 2010)", order: 0 },
  { id: "qual-7", jobId: "2", qualification: "ENG1 (Medical Certificate)", order: 1 },
  { id: "qual-8", jobId: "2", qualification: "Food and Hygiene Level 2", order: 2 },
  // Job 3
  { id: "qual-9", jobId: "3", qualification: "STCW 95 (STCW 2010)", order: 0 },
  { id: "qual-10", jobId: "3", qualification: "ENG1 (Medical Certificate)", order: 1 },
  { id: "qual-11", jobId: "3", qualification: "MCA CoC Master <500gt / Class 5", order: 2 },
  { id: "qual-12", jobId: "3", qualification: "GMDSS Certification", order: 3 },
  { id: "qual-13", jobId: "3", qualification: "Valid captain's license", order: 4 },
  { id: "qual-14", jobId: "3", qualification: "Relevant maritime visas.", order: 5 },
  // Job 4
  { id: "qual-15", jobId: "4", qualification: "STCW 95 (STCW 2010)", order: 0 },
  { id: "qual-16", jobId: "4", qualification: "ENG1 (Medical Certificate)", order: 1 },
  { id: "qual-17", jobId: "4", qualification: "Food and Hygiene Level 2", order: 2 },
  { id: "qual-18", jobId: "4", qualification: "Must hold B1/B2 and Schengen visas", order: 3 },
  // Job 5
  { id: "qual-19", jobId: "5", qualification: "STCW 95 (STCW 2010)", order: 0 },
  { id: "qual-20", jobId: "5", qualification: "ENG1 (Medical Certificate)", order: 1 },
  { id: "qual-21", jobId: "5", qualification: "MCA Approved Engine Course (AEC 1 & 2) Certificate", order: 2 },
  { id: "qual-22", jobId: "5", qualification: "RYA Powerboat Level 2", order: 3 },
  { id: "qual-23", jobId: "5", qualification: "RYA Tender Operator Course", order: 4 },
  { id: "qual-24", jobId: "5", qualification: "BWSF Ski Boat Driver Award Certificate", order: 5 },
];
