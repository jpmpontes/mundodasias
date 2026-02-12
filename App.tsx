
import React from 'react';
import HistoryTimeline from './components/HistoryTimeline';
import AIDirectory from './components/AIDirectory';
import AIQueryTool from './components/AIQueryTool';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Portal das IA's</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#history" className="hover:text-indigo-600 transition-colors">História</a>
            <a href="#directory" className="hover:text-indigo-600 transition-colors">Ferramentas</a>
            <a href="#update-tool" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">Busca Real</a>
          </div>
        </div>
      </nav>

      <header className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
          A Revolução da <span className="text-indigo-600">IA</span> no seu Bolso
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Explore o passado, entenda o presente e descubra as ferramentas que estão definindo o futuro da tecnologia.
        </p>
      </header>

      <main>
        <section id="history" className="bg-white py-20 border-y border-slate-100"><HistoryTimeline /></section>
        <section id="directory" className="py-20"><AIDirectory /></section>
        <section id="update-tool" className="py-20"><AIQueryTool /></section>
      </main>

      <footer className="bg-slate-900 text-white py-12 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} Portal das IA's. Hospedado em Cloud Estática.</p>
      </footer>
    </div>
  );
};

export default App;
