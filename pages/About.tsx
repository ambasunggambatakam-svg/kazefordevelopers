import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">About Kaze For Developers</h1>
        
        <div className="prose prose-slate prose-lg">
          <p>
            Welcome to Kaze For Developers. Our mission is simple: to bridge the gap between "learning to code" and "becoming a professional software engineer".
          </p>
          <p>
            Traditional education often lags behind industry standards. Bootcamps can be rushed. Kaze bridges this gap by providing high-quality, structured courses that focus on deep understanding, architectural patterns, and real-world application.
          </p>
          
          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Philosophy</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
             <li><strong>Depth over Breadth:</strong> We'd rather you master one stack than be mediocre at ten.</li>
             <li><strong>Structure Matters:</strong> Learning should be logical, sequential, and cumulative.</li>
             <li><strong>Practice is Key:</strong> Every concept is backed by exercises and projects.</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Who is Kaze?</h3>
          <p>
            Founded by senior engineers with experience at top tech companies, Kaze brings enterprise-level standards to accessible education. We believe that with the right guidance, anyone with dedication can master the art of software development.
          </p>
        </div>
      </div>
    </div>
  );
};
