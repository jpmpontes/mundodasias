
export interface AIHistoryEvent {
  year: string;
  title: string;
  description: string;
  category: 'Milestone' | 'Technology' | 'Regulation';
}

export interface AITool {
  name: string;
  url: string;
  description: string;
  category: string;
  usage: string[];
  versions: string[];
  pricing: string;
  isPopular: boolean;
}

export interface SearchResult {
  answer: string;
  sources: { title: string; uri: string }[];
}
