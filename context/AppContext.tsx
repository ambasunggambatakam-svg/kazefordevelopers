import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import { Course, Material, Meeting, SiteConfig, AdminConfig } from '../types';

interface AppContextType {
  isAdmin: boolean;
  login: (p: string) => boolean;
  logout: () => void;
  
  courses: Course[];
  materials: Material[];
  meetings: Meeting[];
  siteConfig: SiteConfig;
  
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('kaze_auth') === 'true';
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(db.getSiteConfig());

  const refreshData = () => {
    setCourses(db.getCourses());
    setMaterials(db.getMaterials());
    setMeetings(db.getMeetings());
    setSiteConfig(db.getSiteConfig());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const login = (p: string) => {
    const admin = db.getAdmin();
    if (p === admin.passwordHash) {
      setIsAdmin(true);
      sessionStorage.setItem('kaze_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('kaze_auth');
  };

  return (
    <AppContext.Provider value={{
      isAdmin, login, logout,
      courses, materials, meetings, siteConfig,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};