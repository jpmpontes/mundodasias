
import React from 'react';
import { AIHistoryEvent } from '../types';
import { HISTORY_DATA } from '../constants';

const HistoryTimeline: React.FC = () => {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Linha do Tempo: A Evolução da Inteligência</h2>
      <div className="relative border-l-2 border-indigo-200 ml-4 md:ml-0 md:left-1/2">
        {HISTORY_DATA.map((event, index) => (
          <div key={index} className={`mb-12 relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            {/* Dot */}
            <div className="absolute left-[-9px] md:left-1/2 md:translate-x-[-50%] w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm z-10"></div>
            
            {/* Content Card */}
            <div className={`w-full md:w-[45%] p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
              <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">{event.year}</span>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{event.title}</h3>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed">{event.description}</p>
              <div className="mt-3">
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${
                  event.category === 'Milestone' ? 'bg-amber-100 text-amber-700' : 
                  event.category === 'Technology' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {event.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTimeline;
