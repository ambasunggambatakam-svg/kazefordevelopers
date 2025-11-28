import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, Code, Layers, Zap, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const { siteConfig, courses } = useApp();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {siteConfig.heroTitle}
            </h1>
            <p className="text-xl text-slate-500 mb-8 max-w-2xl leading-relaxed">
              {siteConfig.heroSubtitle}
            </p>
            <div className="flex gap-4">
              <Link to="/programs" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1">
                Lihat Program Belajar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-gradient-to-br from-primary-100 to-white rounded-full opacity-50 blur-3xl z-0"></div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Kaze Developers?</h2>
            <p className="mt-4 text-slate-500">We don't just teach syntax. We teach engineering.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Code className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Structured Curriculum</h3>
              <p className="text-slate-500 leading-relaxed">
                Step-by-step learning paths designed to take you from hello world to production-ready engineer.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Layers className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-world Projects</h3>
              <p className="text-slate-500 leading-relaxed">
                Build applications that matter. No more "To-Do List" tutorials. Build SaaS, Dashboards, and more.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Modern Stack</h3>
              <p className="text-slate-500 leading-relaxed">
                We focus on what the market needs right now: React, TypeScript, Node.js, and Cloud Infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Programs</h2>
              <p className="mt-2 text-slate-500">Start your journey today.</p>
            </div>
            <Link to="/programs" className="hidden md:flex items-center font-medium text-primary-600 hover:text-primary-700">
              View all programs <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map(course => (
              <Link to={`/programs/${course.id}`} key={course.id} className="group block h-full">
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium text-sm mt-auto">
                      Learn more <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
           <div className="mt-10 md:hidden text-center">
            <Link to="/programs" className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700">
              View all programs <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
