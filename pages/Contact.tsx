import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, MessageSquare, Github } from 'lucide-react';

export const Contact: React.FC = () => {
  const { siteConfig } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h1>
          <p className="text-slate-500 mb-8">Have questions about our programs? We'd love to hear from you.</p>

          <div className="space-y-6 mb-8">
             <div className="flex items-center gap-4 text-slate-700">
               <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                 <Mail size={20} />
               </div>
               <span>{siteConfig.contactEmail}</span>
             </div>
             <div className="flex items-center gap-4 text-slate-700">
               <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                 <Github size={20} />
               </div>
               <span>@kazedev</span>
             </div>
          </div>

          <form className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
               <input type="text" className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Your name" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
               <input type="email" className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="you@example.com" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
               <textarea rows={4} className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="How can we help?"></textarea>
             </div>
             <button type="button" className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors">
               Send Message
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};
