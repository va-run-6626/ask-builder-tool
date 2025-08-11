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
      <CardContent>
        <div className="space-y-4">
          {/* Add Column Button */}
          <div className="flex justify-end">
            <Button onClick={addColumn} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
          </div>

          {/* Table Structure */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              {/* Header Row - Column Configuration */}
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.map((column, index) => (
                    <th key={column.key} className="p-3 text-left">
                      <div className="space-y-2">
                        {/* Type Selector */}
                        <Select
                          value={column.type}
                          onValueChange={(value: 'text' | 'number' | 'percentage') => 
                            updateColumn(index, 'type', value)
                          }
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Header Input */}
                        <Input
                          placeholder="Column Header"
                          value={column.label}
                          onChange={(e) => updateColumn(index, 'label', e.target.value)}
                          className="h-8 text-xs font-medium"
                        />
                      </div>
                    </th>
                  ))}
                  {columns.length > 0 && (
                    <th className="p-3 w-12">
                      <span className="text-xs text-muted-foreground">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              
              {/* Data Rows */}
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row.id} className="border-b hover:bg-muted/25">
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        <Input
                          placeholder={`Enter ${column.label.toLowerCase()}`}
                          value={row[column.key] || ''}
                          onChange={(e) => updateRow(rowIndex, column.key, e.target.value)}
                          type={column.type === 'number' ? 'number' : 'text'}
                          className="h-8"
                        />
                      </td>
                    ))}
                    {columns.length > 0 && (
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button
                            onClick={() => removeRow(rowIndex)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Column Actions Row */}
            {columns.length > 0 && (
              <div className="border-t bg-muted/25">
                <div className="p-3 flex gap-3">
                  {columns.map((column, index) => (
                    <div key={column.key} className="flex-1">
                      <Button
                        onClick={() => removeColumn(index)}
                        size="sm"
                        variant="ghost"
                        className="w-full h-6 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Remove Column
                      </Button>
                    </div>
                  ))}
                  <div className="w-12"></div>
                </div>
              </div>
            )}
          </div>

          {/* Add Row Button */}
          {columns.length > 0 && (
            <div className="flex justify-center">
              <Button onClick={addRow} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </Button>
            </div>
          )}

          {columns.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Add columns to start building your data table</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};