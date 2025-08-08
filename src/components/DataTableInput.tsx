import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { DataColumn, DataRow } from '@/types/question';

interface DataTableInputProps {
  columns: DataColumn[];
  rows: DataRow[];
  onColumnsChange: (columns: DataColumn[]) => void;
  onRowsChange: (rows: DataRow[]) => void;
}

export const DataTableInput: React.FC<DataTableInputProps> = ({
  columns,
  rows,
  onColumnsChange,
  onRowsChange
}) => {
  const addColumn = () => {
    const newColumn: DataColumn = {
      key: `col_${Date.now()}`,
      label: 'New Column',
      type: 'text'
    };
    onColumnsChange([...columns, newColumn]);
  };

  const updateColumn = (index: number, field: keyof DataColumn, value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    onColumnsChange(updatedColumns);
    
    // Update all rows to include new column key
    if (field === 'key') {
      const updatedRows = rows.map(row => {
        const newRow = { ...row };
        if (columns[index].key in newRow) {
          newRow[value] = newRow[columns[index].key];
          delete newRow[columns[index].key];
        }
        return newRow as DataRow;
      });
      onRowsChange(updatedRows);
    }
  };

  const removeColumn = (index: number) => {
    const columnKey = columns[index].key;
    const updatedColumns = columns.filter((_, i) => i !== index);
    const updatedRows = rows.map(row => {
      const { [columnKey]: removed, ...rest } = row;
      return rest as DataRow;
    });
    onColumnsChange(updatedColumns);
    onRowsChange(updatedRows);
  };

  const addRow = () => {
    const newRow: DataRow = {
      id: `row_${Date.now()}`,
      ...columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {})
    };
    onRowsChange([...rows, newRow]);
  };

  const updateRow = (rowIndex: number, columnKey: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: value };
    onRowsChange(updatedRows);
  };

  const removeRow = (index: number) => {
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Data Table Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Column Configuration */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Columns</h3>
            <Button onClick={addColumn} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
          </div>
          
          <div className="space-y-3">
            {columns.map((column, index) => (
              <div key={column.key} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Input
                  placeholder="Column Label"
                  value={column.label}
                  onChange={(e) => updateColumn(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Column Key"
                  value={column.key}
                  onChange={(e) => updateColumn(index, 'key', e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={column.type}
                  onValueChange={(value: 'text' | 'number' | 'percentage') => 
                    updateColumn(index, 'type', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Data Rows */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Data Rows</h3>
            <Button onClick={addRow} size="sm" variant="outline" disabled={columns.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>

          {columns.length > 0 && (
            <div className="space-y-3">
              {rows.map((row, rowIndex) => (
                <div key={row.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {columns.map((column) => (
                    <div key={column.key} className="flex-1">
                      <Input
                        placeholder={column.label}
                        value={row[column.key] || ''}
                        onChange={(e) => updateRow(rowIndex, column.key, e.target.value)}
                        type={column.type === 'number' ? 'number' : 'text'}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => removeRow(rowIndex)}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};