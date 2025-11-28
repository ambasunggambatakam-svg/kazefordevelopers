import React, { useState } from 'react';
import { Lock, Unlock, Eye } from 'lucide-react';

interface AccessGateProps {
  requiredPassword?: string;
  children: React.ReactNode;
  triggerLabel?: string;
}

export const AccessGate: React.FC<AccessGateProps> = ({ requiredPassword, children, triggerLabel = "View Content" }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  // If no password is set, show content immediately
  if (!requiredPassword) {
    return <>{children}</>;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === requiredPassword) {
      setIsUnlocked(true);
      setError(false);
      setIsPromptOpen(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (!isPromptOpen) {
    return (
      <button
        onClick={() => setIsPromptOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
      >
        <Lock size={16} />
        {triggerLabel}
      </button>
    );
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-w-sm">
      <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <Lock size={14} /> Restricted Access
      </h4>
      <form onSubmit={handleUnlock} className="flex flex-col gap-2">
        <input
          type="password"
          placeholder="Enter password..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoFocus
        />
        {error && <span className="text-xs text-red-500">Incorrect password.</span>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary-600 text-white py-1.5 rounded-md text-sm font-medium hover:bg-primary-700"
          >
            Unlock
          </button>
          <button
            type="button"
            onClick={() => { setIsPromptOpen(false); setError(false); }}
            className="px-3 py-1.5 text-slate-500 text-sm hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
