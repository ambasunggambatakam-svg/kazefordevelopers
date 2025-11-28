import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { Course, Material, Meeting } from '../../types';
import { 
  LayoutDashboard, Book, FileText, Calendar, Settings, Plus, Trash2, Edit2, Save, X, Database, Lock
} from 'lucide-react';

// Helper to handle date inputs nicely in local time
const toLocalDatetimeValue = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Subtract timezone offset to align UTC time with local input display
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

// Subcomponents for cleanliness
const CourseManager: React.FC = () => {
  const { courses, materials, refreshData } = useApp();
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Material Management State within Course
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);

  const handleSaveCourse = () => {
    if (editing && editing.title) {
      const newCourse: Course = {
        id: editing.id || Date.now().toString(),
        title: editing.title,
        description: editing.description || '',
        level: editing.level || 'Beginner',
        techStack: typeof editing.techStack === 'string' ? (editing.techStack as string).split(',').map(s=>s.trim()) : (editing.techStack || []),
        thumbnailUrl: editing.thumbnailUrl || 'https://picsum.photos/800/600'
      };
      db.saveCourse(newCourse);
      refreshData();
      setIsModalOpen(false);
      setEditing(null);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Delete this course?')) {
      db.deleteCourse(id);
      refreshData();
    }
  };

  const handleSaveMaterial = () => {
     if (editingMaterial && editingMaterial.title && activeCourseId) {
        const newMat: Material = {
           id: editingMaterial.id || Date.now().toString(),
           courseId: activeCourseId,
           title: editingMaterial.title,
           description: editingMaterial.description || '',
           type: editingMaterial.type || 'text',
           contentUrl: editingMaterial.contentUrl || '',
           accessPassword: editingMaterial.accessPassword || ''
        };
        db.saveMaterial(newMat);
        refreshData();
        setEditingMaterial(null);
     }
  };

  const handleDeleteMaterial = (id: string) => {
     if (window.confirm('Delete this material?')) {
        db.deleteMaterial(id);
        refreshData();
     }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Courses Management</h2>
        <button onClick={() => { setEditing({}); setIsModalOpen(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors hover:bg-primary-700">
          <Plus size={16} /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {courses.map(course => (
              <React.Fragment key={course.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{course.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setActiveCourseId(activeCourseId === course.id ? null : course.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      {activeCourseId === course.id ? 'Hide Materials' : 'Manage Materials'}
                    </button>
                    <button onClick={() => { setEditing(course); setIsModalOpen(true); }} className="text-amber-600 hover:text-amber-900 mr-4">Edit</button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                {/* Nested Material Manager */}
                {activeCourseId === course.id && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 bg-slate-50 border-y border-slate-200">
                      <div className="ml-4">
                        <div className="flex justify-between items-center mb-3">
                           <h4 className="font-bold text-sm text-slate-700">Materials for: {course.title}</h4>
                           <button onClick={() => setEditingMaterial({})} className="text-xs bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-100 flex items-center gap-1">
                             <Plus size={12} /> Add Material
                           </button>
                        </div>
                        
                        {/* Add/Edit Material Form Inline */}
                        {editingMaterial && (
                           <div className="bg-white p-4 rounded border border-blue-200 mb-4 grid gap-3 shadow-sm">
                              <h5 className="text-xs font-bold text-slate-500 uppercase">{editingMaterial.id ? 'Edit Material' : 'New Material'}</h5>
                              <input placeholder="Title" className="border p-2 rounded text-sm w-full" value={editingMaterial.title || ''} onChange={e => setEditingMaterial({...editingMaterial, title: e.target.value})} />
                              <input placeholder="Description" className="border p-2 rounded text-sm w-full" value={editingMaterial.description || ''} onChange={e => setEditingMaterial({...editingMaterial, description: e.target.value})} />
                              <div className="grid grid-cols-2 gap-3">
                                <select className="border p-2 rounded text-sm" value={editingMaterial.type || 'text'} onChange={e => setEditingMaterial({...editingMaterial, type: e.target.value as any})}>
                                   <option value="text">Text / Link</option>
                                   <option value="video">Video Embed</option>
                                   <option value="file">File Download</option>
                                </select>
                                <div className="relative">
                                  <Lock size={14} className="absolute left-2 top-2.5 text-slate-400" />
                                  <input placeholder="Password (Optional)" className="border p-2 pl-8 rounded text-sm w-full" value={editingMaterial.accessPassword || ''} onChange={e => setEditingMaterial({...editingMaterial, accessPassword: e.target.value})} />
                                </div>
                              </div>
                              <input placeholder="Content URL (Link/Embed)" className="border p-2 rounded text-sm w-full" value={editingMaterial.contentUrl || ''} onChange={e => setEditingMaterial({...editingMaterial, contentUrl: e.target.value})} />
                              <div className="flex gap-2 mt-1">
                                 <button onClick={handleSaveMaterial} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700">Save Material</button>
                                 <button onClick={() => setEditingMaterial(null)} className="text-slate-500 text-xs px-2 py-1.5 hover:text-slate-700">Cancel</button>
                              </div>
                           </div>
                        )}

                        <ul className="space-y-2">
                           {materials.filter(m => m.courseId === course.id).map(m => (
                              <li key={m.id} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 text-sm shadow-sm">
                                 <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                      m.type === 'video' ? 'bg-red-50 text-red-600 border-red-100' : 
                                      m.type === 'file' ? 'bg-green-50 text-green-600 border-green-100' :
                                      'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>{m.type}</span>
                                    <span className="font-medium text-slate-700">{m.title}</span>
                                    {m.accessPassword && <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1"><Settings size={10} /> Locked</span>}
                                 </div>
                                 <div className="flex gap-2">
                                    <button onClick={() => setEditingMaterial(m)} className="text-slate-400 hover:text-blue-600 p-1"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDeleteMaterial(m.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                                 </div>
                              </li>
                           ))}
                           {materials.filter(m => m.courseId === course.id).length === 0 && <li className="text-slate-400 text-xs italic p-2">No materials added to this course yet.</li>}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-slate-800">{editing?.id ? 'Edit Course' : 'New Course'}</h3>
            <div className="space-y-4">
              <input placeholder="Course Title" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" value={editing?.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" value={editing?.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-slate-500 mb-1 block">Level</label>
                   <select className="w-full border border-slate-300 p-2.5 rounded-lg" value={editing?.level || 'Beginner'} onChange={e => setEditing({...editing, level: e.target.value as any})}>
                     <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 mb-1 block">Tech Stack</label>
                   <input placeholder="React, Node..." className="w-full border border-slate-300 p-2.5 rounded-lg" value={Array.isArray(editing?.techStack) ? editing?.techStack.join(', ') : editing?.techStack || ''} onChange={e => setEditing({...editing, techStack: e.target.value as any})} />
                 </div>
              </div>
              <input placeholder="Thumbnail URL" className="w-full border border-slate-300 p-2.5 rounded-lg" value={editing?.thumbnailUrl || ''} onChange={e => setEditing({...editing, thumbnailUrl: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveCourse} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-colors">Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MeetingManager: React.FC = () => {
   const { meetings, refreshData } = useApp();
   const [editing, setEditing] = useState<Partial<Meeting> | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleSave = () => {
      if(editing && editing.title) {
         const newMeeting: Meeting = {
            id: editing.id || Date.now().toString(),
            title: editing.title,
            date: editing.date || new Date().toISOString(),
            link: editing.link || '',
            platform: editing.platform || 'Google Meet',
            description: editing.description || '',
            isLocked: editing.isLocked || false,
            accessPassword: editing.accessPassword || ''
         };
         db.saveMeeting(newMeeting);
         refreshData();
         setIsModalOpen(false);
         setEditing(null);
      }
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Meeting Schedule</h2>
            <button onClick={() => { setEditing({}); setIsModalOpen(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-primary-700 transition-colors">
               <Plus size={16} /> Schedule Meeting
            </button>
         </div>
         <div className="grid gap-4">
            {meetings.map(m => (
               <div key={m.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                     <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{m.title}</h4>
                        {m.isLocked && <Lock size={14} className="text-amber-500" />}
                     </div>
                     <p className="text-sm text-slate-500 mt-1">
                        {new Date(m.date).toLocaleDateString()} at {new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </p>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {m.isLocked && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded font-medium">PW: {m.accessPassword}</span>}
                        <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{m.platform}</span>
                     </div>
                  </div>
                  <div className="flex gap-2 self-end md:self-center">
                     <button onClick={() => { setEditing(m); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={18} /></button>
                     <button onClick={() => { if(window.confirm('Delete meeting?')) { db.deleteMeeting(m.id); refreshData(); } }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={18} /></button>
                  </div>
               </div>
            ))}
            {meetings.length === 0 && <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">No meetings scheduled.</div>}
         </div>

         {/* Meeting Modal */}
         {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-slate-800">{editing?.id ? 'Edit Meeting' : 'Schedule Meeting'}</h3>
            <div className="space-y-4">
              <input placeholder="Meeting Title" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" value={editing?.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-slate-500 mb-1 block">Date & Time</label>
                    <input type="datetime-local" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm" 
                        value={editing?.date ? toLocalDatetimeValue(editing.date) : ''} 
                        onChange={e => {
                           if (e.target.value) {
                              setEditing({...editing, date: new Date(e.target.value).toISOString()});
                           }
                        }} />
                 </div>
                 <div>
                    <label className="text-xs text-slate-500 mb-1 block">Platform</label>
                    <input placeholder="Zoom, GMeet..." className="w-full border border-slate-300 p-2.5 rounded-lg text-sm" value={editing?.platform || ''} onChange={e => setEditing({...editing, platform: e.target.value})} />
                 </div>
              </div>

              <input placeholder="Meeting Link URL" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" value={editing?.link || ''} onChange={e => setEditing({...editing, link: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" value={editing?.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} />
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="flex items-center gap-3">
                    <input type="checkbox" id="locked" className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" checked={editing?.isLocked || false} onChange={e => setEditing({...editing, isLocked: e.target.checked})} />
                    <label htmlFor="locked" className="text-sm font-medium text-slate-700">Restricted Access (Password)</label>
                 </div>
                 {editing?.isLocked && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                       <input placeholder="Enter access password..." className="w-full border border-slate-300 p-2 rounded text-sm" value={editing?.accessPassword || ''} onChange={e => setEditing({...editing, accessPassword: e.target.value})} />
                    </div>
                 )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-colors">Save Meeting</button>
            </div>
          </div>
        </div>
      )}
      </div>
   );
}

const DbGuide: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <Database size={20} className="text-primary-600" /> Database Tutorial (MySQL / PHPMyAdmin)
    </h3>
    <div className="prose prose-sm prose-slate max-w-none">
      <p>Currently, the app uses <strong>LocalStorage</strong> for demo purposes. To migrate to a real MySQL database (PHPMyAdmin), follow these SQL commands to create your structure.</p>
      <div className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono my-4 shadow-inner">
        <pre>
{`-- 1. Create Database
CREATE DATABASE kaze_app;
USE kaze_app;

-- 2. Admins Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- 3. Courses Table
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level ENUM('Beginner', 'Intermediate', 'Advanced'),
    tech_stack JSON,
    thumbnail_url VARCHAR(512)
);

-- 4. Materials Table
CREATE TABLE materials (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    type ENUM('video', 'text', 'file'),
    content_url TEXT,
    access_password VARCHAR(100),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 5. Meetings Table
CREATE TABLE meetings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    meeting_date DATETIME,
    link TEXT,
    platform VARCHAR(50),
    is_locked BOOLEAN DEFAULT FALSE,
    access_password VARCHAR(100)
);

-- 6. Insert Default Admin (Password: admin123 - You should hash this in real app)
INSERT INTO admins (username, password_hash) VALUES ('admin', 'admin123');
`}
        </pre>
      </div>
      <p className="mt-4 font-medium">Integration Steps:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Create a PHP API (e.g., <code>api/courses.php</code>) that connects to this DB.</li>
        <li>Replace the calls in <code>services/db.ts</code> to use <code>fetch('http://localhost/api/...')</code> instead of localStorage.</li>
      </ol>
    </div>
  </div>
);

const SettingsPanel: React.FC = () => {
   const [pass, setPass] = useState('');
   const handleUpdate = () => {
      const current = db.getAdmin();
      db.updateAdmin({...current, passwordHash: pass});
      alert('Admin password updated');
      setPass('');
   };
   
   return (
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200 mb-8">
         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lock size={20} className="text-primary-600" /> Admin Security
         </h3>
         <div className="flex gap-4 items-end max-w-md">
            <div className="w-full">
               <label className="text-sm text-slate-600 mb-1 block">New Admin Password</label>
               <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg" placeholder="Enter new password" />
            </div>
            <button onClick={handleUpdate} className="bg-slate-900 text-white px-4 py-2 rounded-lg h-[42px] hover:bg-slate-800 transition-colors">Update</button>
         </div>
      </div>
   );
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'meetings' | 'settings' | 'db'>('dashboard');
  const { courses, meetings } = useApp();

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="text-slate-500 text-sm font-medium">Total Courses</h3>
                 <p className="text-3xl font-bold text-slate-900 mt-2">{courses.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="text-slate-500 text-sm font-medium">Upcoming Meetings</h3>
                 <p className="text-3xl font-bold text-slate-900 mt-2">{meetings.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="text-slate-500 text-sm font-medium">System Status</h3>
                 <p className="text-3xl font-bold text-green-600 mt-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> Active
                 </p>
              </div>
           </div>
        );
      case 'courses': return <CourseManager />;
      case 'meetings': return <MeetingManager />;
      case 'settings': return <SettingsPanel />;
      case 'db': return <DbGuide />;
      default: return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 min-h-screen hidden md:block fixed h-full z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-primary-600" /> Admin Panel
          </h2>
        </div>
        <nav className="mt-6 px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'courses', label: 'Manage Courses', icon: Book },
            { id: 'meetings', label: 'Manage Schedule', icon: Calendar },
            { id: 'settings', label: 'Security', icon: Settings },
            { id: 'db', label: 'Database Guide', icon: Database },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-primary-50 text-primary-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64 overflow-y-auto min-h-screen">
        <header className="mb-8 md:hidden">
           {/* Mobile header controls if needed */}
           <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
           <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
             {['dashboard', 'courses', 'meetings', 'settings', 'db'].map(tab => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)} 
                    className={`px-3 py-1 rounded border capitalize whitespace-nowrap ${activeTab === tab ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>
                    {tab}
                 </button>
             ))}
           </div>
        </header>

        <h1 className="text-2xl font-bold text-slate-800 mb-6 capitalize hidden md:block">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
        {renderContent()}
      </div>
    </div>
  );
};