export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  thumbnailUrl: string;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'file';
  contentUrl: string; // The link to the file/video
  accessPassword?: string; // If set, user needs this to view content
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO string
  description?: string;
  platform: string; // e.g., "Google Meet"
  link: string;
  isLocked: boolean;
  accessPassword?: string;
}

export interface AdminConfig {
  passwordHash: string; // Simulating hash
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
}