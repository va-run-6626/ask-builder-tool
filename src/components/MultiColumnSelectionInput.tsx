import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { MultiColumnOption } from '@/types/question';

interface MultiColumnSelectionInputProps {
  columns: string[];
  options: MultiColumnOption[];
  instructions: string;
  onColumnsChange: (columns: string[]) => void;
  onOptionsChange: (options: MultiColumnOption[]) => void;
  onInstructionsChange: (instructions: string) => void;
}

export const MultiColumnSelectionInput: React.FC<MultiColumnSelectionInputProps> = ({
  columns,
  options,
  instructions,
  onColumnsChange,
  onOptionsChange,
  onInstructionsChange
}) => {
  const addColumn = () => {
    onColumnsChange([...columns, `Column ${columns.length + 1}`]);
  };

  const updateColumn = (index: number, value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = value;
    onColumnsChange(updatedColumns);
  };

  const removeColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    onColumnsChange(updatedColumns);
    
    // Update options to match new column structure
    const updatedOptions = options.map(option => ({
      ...option,
      columns: option.columns.filter((_, i) => i !== index)
    }));
    onOptionsChange(updatedOptions);
  };

  const addOption = () => {
    const newOption: MultiColumnOption = {
      id: `opt_${Date.now()}`,
      label: '',
      columns: new Array(columns.length).fill('')
    };
    onOptionsChange([...options, newOption]);
  };

  const updateOption = (index: number, field: 'label' | 'columns', value: string | string[]) => {
    const updatedOptions = [...options];
    if (field === 'label') {
      updatedOptions[index].label = value as string;
    } else {
      updatedOptions[index].columns = value as string[];
    }
    onOptionsChange(updatedOptions);
  };

  const updateOptionColumn = (optionIndex: number, columnIndex: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex].columns[columnIndex] = value;
    onOptionsChange(updatedOptions);
  };

  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Multi-Column Selection Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
          <Textarea
            placeholder="In the table, select for each option..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>

        {/* Selection Columns */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Selection Columns</h3>
            <Button onClick={addColumn} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
          </div>

          <div className="space-y-3">
            {columns.map((column, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  placeholder={`Column ${index + 1} name`}
                  value={column}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => removeColumn(index)}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Selection Options</h3>
            <Button onClick={addOption} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-4">
            {options.map((option, optionIndex) => (
              <div key={option.id} className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Option label/value"
                    value={option.label}
                    onChange={(e) => updateOption(optionIndex, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeOption(optionIndex)}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {columns.map((columnName, columnIndex) => (
                    <div key={columnIndex}>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        {columnName || `Column ${columnIndex + 1}`}
                      </label>
                      <Input
                        placeholder="Cell value"
                        value={option.columns[columnIndex] || ''}
                        onChange={(e) => updateOptionColumn(optionIndex, columnIndex, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
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