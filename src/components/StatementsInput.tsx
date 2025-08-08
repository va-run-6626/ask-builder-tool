import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { QuestionStatement } from '@/types/question';

interface StatementsInputProps {
  statements: QuestionStatement[];
  instructions: string;
  onStatementsChange: (statements: QuestionStatement[]) => void;
  onInstructionsChange: (instructions: string) => void;
}

export const StatementsInput: React.FC<StatementsInputProps> = ({
  statements,
  instructions,
  onStatementsChange,
  onInstructionsChange
}) => {
  const addStatement = () => {
    const newStatement: QuestionStatement = {
      id: `stmt_${Date.now()}`,
      text: '',
      correctAnswer: 'yes'
    };
    onStatementsChange([...statements, newStatement]);
  };

  const updateStatement = (index: number, field: keyof QuestionStatement, value: string) => {
    const updatedStatements = [...statements];
    updatedStatements[index] = { 
      ...updatedStatements[index], 
      [field]: field === 'correctAnswer' ? value as 'yes' | 'no' : value 
    };
    onStatementsChange(updatedStatements);
  };

  const removeStatement = (index: number) => {
    onStatementsChange(statements.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Question Statements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
          <Textarea
            placeholder="For each of the following statements about this data, select Yes if the statement can be inferred from the given information. Otherwise, select No."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
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
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground min-w-0">
                    Statement {index + 1}
                  </span>
                  <Select
                    value={statement.correctAnswer}
                    onValueChange={(value: 'yes' | 'no') => 
                      updateStatement(index, 'correctAnswer', value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => removeStatement(index)}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter the statement text..."
                  value={statement.text}
                  onChange={(e) => updateStatement(index, 'text', e.target.value)}
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
      </CardContent>
    </Card>
  );
};