
export type Operation = '+' | '-' | '*' | '/' | '^' | null;

export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface AIResponse {
  answer: string;
  explanation: string;
  steps?: string[];
}