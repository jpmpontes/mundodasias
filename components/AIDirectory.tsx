
import React, { useState } from 'react';
import { INITIAL_AI_TOOLS } from '../constants';

const AIDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = INITIAL_AI_TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-3xl font-bold">Diretório de Ferramentas</h2>
        <input 
          type="text" 
          placeholder="Buscar IA..." 
          className="px-4 py-2 border rounded-lg w-full md:max-w-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all flex flex-col">
            <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
            <p className="text-sm text-slate-600 mb-4 flex-grow">{tool.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.usage.map(u => <span key={u} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">{u}</span>)}
            </div>
            <a href={tool.url} target="_blank" rel="noopener" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors">Acessar</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIDirectory;
