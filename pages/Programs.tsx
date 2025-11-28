import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, BookOpen } from 'lucide-react';

export const Programs: React.FC = () => {
  const { courses } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Available Programs</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Choose the path that fits your career goals. All courses include comprehensive materials and exercises.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                  {course.level}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.techStack.map(tech => (
                    <span key={tech} className="text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-sm mb-6 flex-1">
                  {course.description}
                </p>
                <Link 
                  to={`/programs/${course.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <BookOpen size={16} className="mr-2" />
                  View Syllabus
                </Link>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400">
              No programs available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
