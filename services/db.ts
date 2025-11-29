import { Course, Material, Meeting, AdminConfig, SiteConfig } from '../types';

// Gunakan Environment Variable jika ada, jika tidak gunakan localhost
const API_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://kazeserenity.com/index.php';

// Helper for Fetch
const apiRequest = async (action: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}?action=${action}`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    return method === 'GET' ? [] : { status: 'error' };
  }
};

export const db = {
  // Courses
  getCourses: async (): Promise<Course[]> => {
    const data = await apiRequest('getCourses');
    // Ensure techStack is parsed if coming as string from DB, though PHP handle might need adjustment
    // Here we assume PHP sends JSON or we map it. 
    return data.map((c: any) => ({
      ...c,
      techStack: typeof c.tech_stack === 'string' ? JSON.parse(c.tech_stack) : (c.techStack || [])
    }));
  },
  saveCourse: async (course: Course) => {
    await apiRequest('saveCourse', 'POST', course);
  },
  deleteCourse: async (id: string) => {
    await apiRequest('deleteCourse', 'POST', { id });
  },

  // Materials
  getMaterials: async (): Promise<Material[]> => {
    const data = await apiRequest('getMaterials');
    return data.map((m: any) => ({
       ...m,
       courseId: m.course_id, // Map snake_case from DB to camelCase
       contentUrl: m.content_url,
       accessPassword: m.access_password
    }));
  },
  saveMaterial: async (material: Material) => {
    await apiRequest('saveMaterial', 'POST', material);
  },
  deleteMaterial: async (id: string) => {
    await apiRequest('deleteMaterial', 'POST', { id });
  },

  // Meetings
  getMeetings: async (): Promise<Meeting[]> => {
    const data = await apiRequest('getMeetings');
    return data.map((m: any) => ({
      ...m,
      isLocked: m.is_locked == 1, // Convert MySQL boolean (1/0)
      accessPassword: m.access_password
    }));
  },
  saveMeeting: async (meeting: Meeting) => {
    await apiRequest('saveMeeting', 'POST', meeting);
  },
  deleteMeeting: async (id: string) => {
    await apiRequest('deleteMeeting', 'POST', { id });
  },

  // Auth
  verifyLogin: async (password: string): Promise<boolean> => {
    const res = await apiRequest('checkLogin', 'POST', { password });
    return res.success;
  },
  // alamak, no logout needed for stateless API
  
  // Site Config (Mock for now or implement in PHP similarly)
  getSiteConfig: async (): Promise<SiteConfig> => {
      // Return default for demo, or fetch from DB if table exists
      return {
        heroTitle: 'Belajar Coding dengan Struktur dan Panduan yang Tepat',
        heroSubtitle: 'Kaze For Developers menyediakan kurikulum terbaik untuk karir impianmu.',
        contactEmail: 'hello@kazadev.com'
      };
  }
};