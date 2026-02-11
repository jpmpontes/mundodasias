
import React from 'react';
import HistoryTimeline from './components/HistoryTimeline';
import AIDirectory from './components/AIDirectory';
import AIQueryTool from './components/AIQueryTool';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Mundo das IA's</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">Início</a>
              <a href="#history" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">História</a>
              <a href="#directory" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">Diretório</a>
              <a href="#update-tool" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Atualizar Info</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            O Universo das <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Inteligências Artificiais</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            Uma jornada completa pela história, as ferramentas essenciais e o futuro da inteligência de máquinas. Mantenha-se atualizado com o que há de novo a cada trimestre.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#directory" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">Ver Ferramentas</a>
            <a href="#history" className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all">Nossa História</a>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-violet-100 rounded-full blur-[100px]"></div>
        </div>
      </section>

      <main>
        {/* History Section */}
        <section id="history" className="bg-slate-50 border-y border-slate-200">
          <HistoryTimeline />
        </section>

        {/* Directory Section */}
        <AIDirectory />

        {/* Live Update Section */}
        <AIQueryTool />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xs">M</div>
              <span className="text-lg font-bold tracking-tight">Mundo das IA's</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              O seu guia definitivo para o ecossistema global de Inteligência Artificial. Atualizado continuamente por humanos e máquinas.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-500">Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">História</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Listagem</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-500">Sobre</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Azure Static Web</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Mundo das IA's. Desenvolvido para rodar no Azure Static Web Apps.
        </div>
      </footer>
    </div>
  );
};

export default App;
