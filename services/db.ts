import { Course, Material, Meeting, AdminConfig, SiteConfig } from '../types';

// Gunakan Environment Variable dari Vercel untuk Production
// Jika di localhost (Development), gunakan localhost XAMPP
const API_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://kazeserenity.com/api/index.php';

// Log URL ke console agar developer tahu React sedang connect ke mana
console.log('%c[API CONFIG] Connected to:', 'color: #0ea5e9; font-weight: bold;', API_URL);

// Helper for Fetch
const apiRequest = async (action: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    // Tambahkan timestamp agar tidak di-cache browser (terutama untuk IE/Edge lama atau proxy agresif)
    const cacheBuster = `&_t=${new Date().getTime()}`;
    // Pastikan separator query param benar (? atau &)
    const separator = API_URL.includes('?') ? '&' : '?';
    const res = await fetch(`${API_URL}${separator}action=${action}${cacheBuster}`, options);
    
    // Cek jika response bukan OK (misal 404 atau 500)
    if (!res.ok) {
        console.error(`[API ERROR] Server responded with status: ${res.status}`);
        const text = await res.text(); // Coba baca pesan error dari server PHP
        console.error(`[API RESPONSE]`, text.substring(0, 300)); 
        throw new Error(`Server Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    console.warn(`[TROUBLESHOOT] Gagal menghubungi Backend.`);
    console.warn(`1. Cek Vercel Environment Variables (VITE_API_BASE_URL).`);
    console.warn(`2. Pastikan file 'db.php' di hosting memiliki kredensial database yang benar.`);
    console.warn(`3. Pastikan hosting mendukung CORS (header Access-Control-Allow-Origin: *).`);
    
    // Return empty / safe defaults agar UI tidak crash total saat backend mati
    return method === 'GET' ? [] : { status: 'error', message: 'Connection failed' };
  }
};

export const db = {
  // Courses
  getCourses: async (): Promise<Course[]> => {
    const data = await apiRequest('getCourses');
    if (!Array.isArray(data)) return [];
    return data.map((c: any) => ({
      ...c,
      // Handle parsing JSON string from DB or raw array
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
    if (!Array.isArray(data)) return [];
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
    if (!Array.isArray(data)) return [];
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
    return res && res.success === true;
  },
  
  // Site Config
  getSiteConfig: async (): Promise<SiteConfig> => {
      // Fallback data jika DB belum siap/koneksi gagal
      return {
        heroTitle: 'Belajar Coding dengan Struktur dan Panduan yang Tepat',
        heroSubtitle: 'Kaze For Developers menyediakan kurikulum terbaik untuk karir impianmu.',
        contactEmail: 'hello@kaze.dev'
      };
  }
};