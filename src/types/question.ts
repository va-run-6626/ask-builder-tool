export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface DataColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'percentage';
}

export interface QuestionStatement {
  id: string;
  text: string;
  correctAnswer: 'yes' | 'no';
}

export interface MultiColumnOption {
  id: string;
  label: string;
  columns: string[];
}

export interface DataSufficiencyStatement {
  id: string;
  text: string;
}

export interface DataSufficiencyOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type QuestionFormat = 'yes-no-statements' | 'multi-column-selection' | 'data-sufficiency';

export interface Question {
  title: string;
  description: string;
  format: QuestionFormat;
  dataColumns: DataColumn[];
  dataRows: DataRow[];
  statements: QuestionStatement[];
  instructions: string;
  
  // Multi-column selection specific
  selectionColumns?: string[];
  selectionOptions?: MultiColumnOption[];
  
  // Data sufficiency specific
  questionText?: string;
  sufficiencyStatements?: DataSufficiencyStatement[];
  sufficiencyOptions?: DataSufficiencyOption[];
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  order: SortOrder;
}