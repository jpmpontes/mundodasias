
import React, { useState } from 'react';
import { getLiveAIData } from '../services/geminiService';
import { SearchResult } from '../types';

const AIQueryTool: React.FC = () => {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<SearchResult | null>(null);
  const [load, setLoad] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoad(true);
    const data = await getLiveAIData(q);
    setRes(data);
    setLoad(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Busca em Tempo Real</h2>
        <p className="text-indigo-200 mb-8 text-lg">Novidades no mercado de IA? Pergunte ao nosso buscador inteligente.</p>
        
        <form onSubmit={search} className="flex flex-col md:flex-row gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Ex: Quais as novidades do Claude hoje?" 
            className="flex-grow bg-white/10 border border-white/20 px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-white/50"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
            {load ? 'Pesquisando...' : 'Consultar'}
          </button>
        </form>

        {res && (
          <div className="bg-white text-slate-900 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <p className="mb-4 leading-relaxed">{res.answer}</p>
            {res.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {res.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{s.title}</a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQueryTool;
