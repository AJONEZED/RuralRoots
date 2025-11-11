
export type UserType = "customer" | "farm" | "worker";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Plain text for demo purposes
  type: UserType;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  text: string;
  rating: number; // 1-5 stars
  date: string; // ISO date format
}

export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  location: string;
  region: string;
  description: string;
  tags: string[];
  rating: number;
  contact: string;
  website: string;
  images: string[];
  reviews: Review[];
}

export type JobType = "full-time" | "part-time" | "seasonal" | "contract";

export interface Job {
  id: string;
  farmId: string;
  title: string;
  type: JobType;
  description: string;
  requirements: string[];
  salary: string;
  posted: string; // ISO date format
  applications: string[]; // Array of User.id
}

export interface AppData {
  users: User[];
  farms: Farm[];
  jobs: Job[];
  currentUser: User | null;
}
