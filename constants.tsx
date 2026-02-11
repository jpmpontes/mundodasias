
import { AIHistoryEvent, AITool } from './types';

export const HISTORY_DATA: AIHistoryEvent[] = [
  {
    year: '1950',
    title: 'Teste de Turing',
    description: 'Alan Turing propõe o "Jogo da Imitação", estabelecendo o padrão para a inteligência de máquinas.',
    category: 'Milestone'
  },
  {
    year: '1956',
    title: 'Nascimento do Termo "IA"',
    description: 'A Conferência de Dartmouth define oficialmente o campo de pesquisa da Inteligência Artificial.',
    category: 'Milestone'
  },
  {
    year: '1966',
    title: 'ELIZA',
    description: 'O primeiro chatbot da história, simulando uma conversa com um terapeuta Rogeriano.',
    category: 'Technology'
  },
  {
    year: '1997',
    title: 'Deep Blue vs Kasparov',
    description: 'O computador da IBM derrota o campeão mundial de xadrez Garry Kasparov.',
    category: 'Milestone'
  },
  {
    year: '2012',
    title: 'Revolução do Deep Learning',
    description: 'Redes neurais profundas (AlexNet) superam recordes em reconhecimento de imagem.',
    category: 'Technology'
  },
  {
    year: '2017',
    title: 'Transformers',
    description: 'Google publica o artigo "Attention is All You Need", base dos modelos LLM atuais.',
    category: 'Technology'
  },
  {
    year: '2022',
    title: 'Explosão da IA Generativa',
    description: 'Lançamento do ChatGPT, trazendo a IA para o uso cotidiano das massas.',
    category: 'Milestone'
  }
];

export const INITIAL_AI_TOOLS: AITool[] = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'Líder em IA generativa de texto e multimodalidade, capaz de analisar imagens, documentos e voz.',
    category: 'Texto / Multimodal',
    usage: ['Redação', 'Análise de dados', 'Visão computacional'],
    versions: ['GPT-4o', 'o1-preview', 'GPT-4'],
    pricing: 'Grátis / $20/mês (Plus)',
    isPopular: true
  },
  {
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com',
    description: 'A IA da Microsoft integrada ao Windows, Edge e Office 365. Utiliza tecnologia da OpenAI com busca Bing.',
    category: 'Assistente / Produtividade',
    usage: ['Produtividade Office', 'Busca Web', 'Geração de Imagens'],
    versions: ['Pro', 'Enterprise', 'Free'],
    pricing: 'Grátis / R$ 110/mês (Pro)',
    isPopular: true
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    description: 'Focada em raciocínio ético e janelas de contexto massivas. Excelente para processar livros e códigos complexos.',
    category: 'Texto / Análise',
    usage: ['Escrita acadêmica', 'Programação', 'Análise de contratos'],
    versions: ['Claude 3.5 Sonnet', 'Claude 3 Opus'],
    pricing: 'Grátis / $20/mês (Pro)',
    isPopular: true
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Modelo multimodal do Google integrado diretamente ao ecossistema Android e Workspace.',
    category: 'Multimodal',
    usage: ['Google Workspace', 'Tradução', 'Pesquisa inteligente'],
    versions: ['Gemini 1.5 Pro', 'Gemini Ultra'],
    pricing: 'Grátis / R$ 96,99/mês (Advanced)',
    isPopular: true
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    description: 'Um "mecanismo de resposta" que combina busca em tempo real com síntese de IA e citação de fontes.',
    category: 'Pesquisa',
    usage: ['Verificação de fatos', 'Pesquisa rápida', 'Notícias'],
    versions: ['Default', 'Pro (Modelos selecionáveis)'],
    pricing: 'Grátis / $20/mês',
    isPopular: true
  },
  {
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'O parceiro de programação mais utilizado no mundo, sugerindo linhas de código em tempo real.',
    category: 'Programação',
    usage: ['Auto-complete de código', 'Debug', 'Documentação'],
    versions: ['Individual', 'Business', 'Enterprise'],
    pricing: 'A partir de $10/mês',
    isPopular: true
  },
  {
    name: 'Midjourney',
    url: 'https://midjourney.com',
    description: 'Considerada a IA de maior qualidade artística para geração de imagens a partir de texto.',
    category: 'Imagem',
    usage: ['Arte digital', 'Design de produto', 'Publicidade'],
    versions: ['v6.1', 'Niji 6'],
    pricing: 'A partir de $10/mês',
    isPopular: true
  },
  {
    name: 'Leonardo.ai',
    url: 'https://leonardo.ai',
    description: 'Plataforma completa de criação visual com ferramentas de edição, upscale e modelos treináveis.',
    category: 'Imagem',
    usage: ['Assets para jogos', 'Retratos', 'Design de interiores'],
    versions: ['Phoenix', 'Lightning', 'Kino XL'],
    pricing: 'Grátis (Créditos diários) / Planos pagos',
    isPopular: false
  },
  {
    name: 'Flux.1',
    url: 'https://blackforestlabs.ai',
    description: 'Modelo de imagem open-weights de altíssima fidelidade, especialmente para realismo e textos em imagens.',
    category: 'Imagem',
    usage: ['Realismo extremo', 'Tipografia em imagens', 'Open Source'],
    versions: ['Pro', 'Dev', 'Schnell'],
    pricing: 'Grátis (API / Local) / Planos por uso',
    isPopular: false
  },
  {
    name: 'Runway',
    url: 'https://runwayml.com',
    description: 'Líder em geração e edição de vídeo profissional utilizando inteligência artificial.',
    category: 'Vídeo',
    usage: ['Texto-para-Vídeo', 'Efeitos visuais', 'Extensão de quadros'],
    versions: ['Gen-3 Alpha', 'Gen-2'],
    pricing: 'Grátis (Limitado) / Planos Pro',
    isPopular: true
  },
  {
    name: 'Consensus',
    url: 'https://consensus.app',
    description: 'Mecanismo de busca que utiliza IA para extrair respostas de artigos científicos revisados por pares.',
    category: 'Pesquisa Científica',
    usage: ['Revisão bibliográfica', 'Saúde', 'Ciência'],
    versions: ['Web App'],
    pricing: 'Grátis / Planos Premium',
    isPopular: false
  },
  {
    name: 'Suno AI',
    url: 'https://suno.com',
    description: 'Criação de músicas completas (letra, melodia e voz) com realismo impressionante a partir de texto.',
    category: 'Áudio / Música',
    usage: ['Composição musical', 'Jingles', 'Entretenimento'],
    versions: ['v3.5', 'v4'],
    pricing: 'Grátis (Limitado) / Planos Pro',
    isPopular: true
  }
];
