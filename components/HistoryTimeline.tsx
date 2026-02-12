
import React from 'react';
import { HISTORY_DATA } from '../constants';

const HistoryTimeline: React.FC = () => (
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-3xl font-bold mb-12 text-center">A Jornada da IA</h2>
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {HISTORY_DATA.map((item, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-indigo-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <span className="text-[10px] font-bold">{item.year}</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow">
            <h3 className="font-bold text-slate-800">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HistoryTimeline;
