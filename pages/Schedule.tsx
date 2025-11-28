import React from 'react';
import { useApp } from '../context/AppContext';
import { AccessGate } from '../components/AccessGate';
import { Calendar, Clock, Video, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';

export const Schedule: React.FC = () => {
  const { meetings } = useApp();

  // Sort meetings by date
  const sortedMeetings = [...meetings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Upcoming Sessions</h1>
          <p className="mt-4 text-slate-500">
            Join our live mentoring sessions and webinars.
          </p>
        </div>

        <div className="space-y-6">
          {sortedMeetings.map(meeting => (
            <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="bg-primary-50 p-6 flex flex-col items-center justify-center min-w-[120px] border-r border-slate-100">
                <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">
                  {format(new Date(meeting.date), 'MMM')}
                </span>
                <span className="text-3xl font-bold text-slate-900 my-1">
                  {format(new Date(meeting.date), 'dd')}
                </span>
                <span className="text-sm text-slate-500">
                   {format(new Date(meeting.date), 'EEE')}
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{meeting.title}</h3>
                  {meeting.isLocked && (
                    <div className="flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      <Lock size={12} />
                      <span>Private</span>
                    </div>
                  )}
                </div>
                
                <p className="text-slate-500 mb-6 text-sm flex-grow">
                  {meeting.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-500" />
                    {format(new Date(meeting.date), 'h:mm a')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-primary-500" />
                    {meeting.platform}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-auto">
                  {meeting.isLocked ? (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium text-slate-900 block mb-1">Session Locked</span>
                          Enter the access password to retrieve the meeting link.
                        </div>
                        <AccessGate requiredPassword={meeting.accessPassword} triggerLabel="Unlock Link">
                           <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-full animate-in fade-in duration-300">
                             <div className="flex items-center gap-2 text-green-700 text-sm font-bold mb-2">
                               <Unlock size={14} /> Access Granted
                             </div>
                             <a href={meeting.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary-600 font-bold hover:underline text-sm">
                               Join {meeting.platform} Meeting <Video size={14} className="ml-2" />
                             </a>
                           </div>
                        </AccessGate>
                      </div>
                    </div>
                  ) : (
                    <a href={meeting.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors shadow-sm shadow-primary-500/30">
                      Join Meeting <Video size={16} className="ml-2" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {sortedMeetings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No upcoming meetings scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};