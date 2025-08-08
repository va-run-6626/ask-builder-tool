import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { DataSufficiencyStatement, DataSufficiencyOption } from '@/types/question';

interface DataSufficiencyInputProps {
  questionText: string;
  statements: DataSufficiencyStatement[];
  options: DataSufficiencyOption[];
  onQuestionTextChange: (text: string) => void;
  onStatementsChange: (statements: DataSufficiencyStatement[]) => void;
  onOptionsChange: (options: DataSufficiencyOption[]) => void;
}

export const DataSufficiencyInput: React.FC<DataSufficiencyInputProps> = ({
  questionText,
  statements,
  options,
  onQuestionTextChange,
  onStatementsChange,
  onOptionsChange
}) => {
  const addStatement = () => {
    const newStatement: DataSufficiencyStatement = {
      id: `stmt_${Date.now()}`,
      text: ''
    };
    onStatementsChange([...statements, newStatement]);
  };

  const updateStatement = (index: number, text: string) => {
    const updatedStatements = [...statements];
    updatedStatements[index].text = text;
    onStatementsChange(updatedStatements);
  };

  const removeStatement = (index: number) => {
    onStatementsChange(statements.filter((_, i) => i !== index));
  };

  const addOption = () => {
    const newOption: DataSufficiencyOption = {
      id: `opt_${Date.now()}`,
      text: '',
      isCorrect: false
    };
    onOptionsChange([...options, newOption]);
  };

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    onOptionsChange(updatedOptions);
  };

  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Data Sufficiency Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Text */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Main Question</h3>
          <Textarea
            placeholder="Enter the main question text..."
            value={questionText}
            onChange={(e) => onQuestionTextChange(e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>

        {/* Statements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Statements</h3>
            <Button onClick={addStatement} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Statement
            </Button>
          </div>

          <div className="space-y-4">
            {statements.map((statement, index) => (
              <div key={statement.id} className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-0">
                    ({index + 1})
                  </span>
                  <Button
                    onClick={() => removeStatement(index)}
                    size="sm"
                    variant="outline"
                    className="shrink-0 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter statement text..."
                  value={statement.text}
                  onChange={(e) => updateStatement(index, e.target.value)}
                  rows={2}
                  className="w-full"
                />
              </div>
            ))}
            
            {statements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No statements yet. Add your first statement to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Answer Options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Answer Options</h3>
            <Button onClick={addOption} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={option.id} className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`correct-${option.id}`}
                      checked={option.isCorrect}
                      onCheckedChange={(checked) => 
                        updateOption(index, 'isCorrect', checked === true)
                      }
                    />
                    <label 
                      htmlFor={`correct-${option.id}`}
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Correct Answer
                    </label>
                  </div>
                  <Button
                    onClick={() => removeOption(index)}
                    size="sm"
                    variant="outline"
                    className="shrink-0 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter option text..."
                  value={option.text}
                  onChange={(e) => updateOption(index, 'text', e.target.value)}
                  rows={2}
                  className="w-full"
                />
              </div>
            ))}
            
            {options.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No options yet. Add your first option to get started.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};