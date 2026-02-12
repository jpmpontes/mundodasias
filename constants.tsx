
import { AIHistoryEvent, AITool } from './types';

export const HISTORY_DATA: AIHistoryEvent[] = [
  { year: '1950', title: 'Teste de Turing', description: 'Alan Turing propõe o Jogo da Imitação.', category: 'Milestone' },
  { year: '1956', title: 'Conferência de Dartmouth', description: 'O termo "Inteligência Artificial" é cunhado oficialmente.', category: 'Milestone' },
  { year: '1997', title: 'Deep Blue', description: 'IBM vence Garry Kasparov no xadrez.', category: 'Milestone' },
  { year: '2017', title: 'Transformers', description: 'Lançamento do artigo "Attention is All You Need" pelo Google.', category: 'Technology' },
  { year: '2022', title: 'A Era Generativa', description: 'Lançamento do ChatGPT e popularização global.', category: 'Milestone' }
];

export const INITIAL_AI_TOOLS: AITool[] = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'Líder em IA generativa multimodal da OpenAI.',
    category: 'Texto / Multimodal',
    usage: ['Escrita', 'Análise', 'Visão'],
    versions: ['GPT-4o', 'o1'],
    pricing: 'Grátis / $20/mês',
    isPopular: true
  },
  {
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com',
    description: 'A IA da Microsoft integrada ao Windows e Office.',
    category: 'Produtividade',
    usage: ['Office 365', 'Busca', 'Imagens'],
    versions: ['Free', 'Pro'],
    pricing: 'Grátis / Pago (Pro)',
    isPopular: true
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    description: 'IA da Anthropic focada em segurança e raciocínio avançado.',
    category: 'Texto / Lógica',
    usage: ['Coding', 'Análise de Texto'],
    versions: ['3.5 Sonnet', '3 Opus'],
    pricing: 'Grátis / $20/mês',
    isPopular: true
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Modelo multimodal do Google integrado ao ecossistema Workspace.',
    category: 'Multimodal',
    usage: ['Google Apps', 'Tradução'],
    versions: ['1.5 Pro', 'Flash'],
    pricing: 'Grátis / R$ 96/mês',
    isPopular: true
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    description: 'Mecanismo de busca inteligente com citações em tempo real.',
    category: 'Pesquisa',
    usage: ['Fact-checking', 'Notícias'],
    versions: ['Pro', 'Default'],
    pricing: 'Grátis / $20/mês',
    isPopular: true
  },
  {
    name: 'Midjourney',
    url: 'https://midjourney.com',
    description: 'IA artística para geração de imagens de alta qualidade.',
    category: 'Imagem',
    usage: ['Arte Digital', 'Design'],
    versions: ['v6.1'],
    pricing: 'A partir de $10/mês',
    isPopular: true
  }
];
