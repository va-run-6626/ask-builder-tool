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

export interface Question {
  title: string;
  description: string;
  dataColumns: DataColumn[];
  dataRows: DataRow[];
  statements: QuestionStatement[];
  instructions: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  order: SortOrder;
}