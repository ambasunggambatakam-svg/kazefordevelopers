import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AccessGate } from '../components/AccessGate';
import { ArrowLeft, PlayCircle, FileText, Download, Lock, ArrowRight } from 'lucide-react';

export const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { courses, materials } = useApp();
  
  const course = courses.find(c => c.id === id);
  const courseMaterials = materials.filter(m => m.courseId === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Program Not Found</h2>
          <Link to="/programs" className="text-primary-600 mt-4 block hover:underline">Back to Programs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/programs" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Programs
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold mb-4">
                  {course.level} Level
                </span>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{course.title}</h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">{course.description}</p>
                <div className="flex gap-2">
                   {course.techStack.map(t => (
                     <span key={t} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm font-medium border border-slate-200">
                       {t}
                     </span>
                   ))}
                </div>
             </div>
             <div className="w-full md:w-1/3">
                <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
                   <h3 className="font-bold text-lg mb-4">Ready to learn?</h3>
                   <p className="text-slate-300 text-sm mb-6">
                     Access all materials below. Some premium content requires an access code provided upon enrollment.
                   </p>
                   <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-4">
                     Lifetime Access • Source Code Included
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Curriculum / Materials */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Course Material</h2>
        
        <div className="space-y-4">
          {courseMaterials.map((material, index) => (
            <div key={material.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  {material.type === 'video' && <PlayCircle size={24} />}
                  {material.type === 'text' && <FileText size={24} />}
                  {material.type === 'file' && <Download size={24} />}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Chapter {index + 1}
                  </span>
                  {material.accessPassword && (
                    <Lock size={12} className="text-amber-500" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{material.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{material.description}</p>
              </div>

              <div className="flex-shrink-0 mt-4 sm:mt-0">
                <AccessGate requiredPassword={material.accessPassword} triggerLabel="Access Material">
                   {material.type === 'video' ? (
                     <div className="mt-4 w-full aspect-video bg-black rounded-lg overflow-hidden max-w-lg">
                       <iframe 
                         src={material.contentUrl} 
                         className="w-full h-full" 
                         allowFullScreen 
                         title={material.title}
                       ></iframe>
                     </div>
                   ) : (
                     <a 
                       href={material.contentUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center text-primary-600 font-medium hover:underline"
                     >
                       Open {material.type === 'file' ? 'File' : 'Link'} <ArrowRight size={16} className="ml-1" />
                     </a>
                   )}
                </AccessGate>
              </div>
            </div>
          ))}

          {courseMaterials.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
              Materials are being prepared by the instructor. Check back soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};