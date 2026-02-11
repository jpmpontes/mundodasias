
import React, { useState } from 'react';
import { getLiveAIData } from '../services/geminiService';
import { SearchResult } from '../types';

const AIQueryTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    const data = await getLiveAIData(query);
    setResult(data);
    setLoading(false);
  };

  return (
    <div id="update-tool" className="py-20 bg-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Atualização em Tempo Real</h2>
          <p className="text-indigo-200">
            A cada 3 meses o cenário muda. Pesquise aqui para obter as informações mais recentes diretamente da web via IA.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
          <input 
            type="text" 
            placeholder="Ex: Qual o preço atual do Claude Pro? ou Novas IAs de vídeo..."
            className="flex-grow px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Consultando...' : 'Pesquisar Agora'}
          </button>
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl animate-pulse">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/60">Acessando a rede para informações frescas...</p>
          </div>
        )}

        {result && (
          <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold mb-4 text-indigo-900">Resultado da Consulta</h3>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{result.answer}</p>
            </div>
            
            {result.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Fontes Verificadas:</p>
                <div className="flex flex-wrap gap-3">
                  {result.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {src.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQueryTool;
