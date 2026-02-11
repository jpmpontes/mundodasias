
import React, { useState } from 'react';
import { INITIAL_AI_TOOLS } from '../constants';
import { AITool } from '../types';

const AIDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', ...new Set(INITIAL_AI_TOOLS.map(t => t.category))];

  const filteredTools = INITIAL_AI_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || tool.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="directory" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Diretório de Ferramentas
          </h2>
          <p className="mt-4 text-xl text-slate-500">
            Descubra as IAs que estão moldando o futuro.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          <input 
            type="text" 
            placeholder="Buscar IA..." 
            className="w-full md:max-w-sm px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, idx) => (
            <div key={idx} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900">{tool.name}</h3>
                {tool.isPopular && (
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm mb-6 flex-grow">{tool.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Versões:</span>
                  <span className="text-slate-700 font-medium">{tool.versions.join(', ')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Valores:</span>
                  <span className="text-slate-700 font-medium">{tool.pricing}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tool.usage.map((u, i) => (
                    <span key={i} className="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded uppercase font-semibold">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center w-full py-2 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-sm"
              >
                Acessar Site
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIDirectory;
