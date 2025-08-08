import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question, DataRow, SortConfig } from '@/types/question';

interface QuestionPreviewProps {
  question: Question;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question }) => {
  const { title, description, dataColumns, dataRows, statements, instructions } = question;
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: '', order: 'asc' });

  // Sort the data rows based on the current sort configuration
  const sortedRows = useMemo(() => {
    if (!sortConfig.column) return dataRows;

    return [...dataRows].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      
      // Handle different data types
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // For string comparison
        comparison = aValue.localeCompare(bValue);
      } else {
        // For numeric comparison (convert strings to numbers)
        const aNum = parseFloat(String(aValue).replace('%', ''));
        const bNum = parseFloat(String(bValue).replace('%', ''));
        comparison = aNum - bNum;
      }

      return sortConfig.order === 'asc' ? comparison : -comparison;
    });
  }, [dataRows, sortConfig]);

  const handleSortChange = (columnKey: string) => {
    setSortConfig(prev => ({
      column: columnKey,
      order: prev.column === columnKey && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!dataColumns.length || !dataRows.length || !statements.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Question Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Configure your data table and statements to see the preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Question Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Question Header */}
        <div className="mb-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground">{title || 'GMAT™ Data Insights Question'}</h2>
            <div className="text-sm text-muted-foreground">
              Time Remaining: 00:43:21
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Data and Description */}
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">
                The table lists data on each of {dataRows.length} items advertised by an Internet retailer on a single 
                web page as part of a one-day sale. The term <em>customer</em> refers to anyone who 
                viewed that web page on that day. For each item, the <em>page placement</em> denotes the 
                quadrant of the page on which the item's advertisement appeared; the <em>mean eye 
                time</em> is the average (arithmetic mean) number of seconds that each customer spent 
                viewing the item's advertisement; the <em>infoclick percentage</em> is the percentage of all 
                customers who clicked a button for more information; and the <em>sales rank</em> is the 
                item's ranking based on sales, where a lesser number denotes greater sales.
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-foreground">Sort by:</span>
              <Select 
                value={sortConfig.column || 'none'} 
                onValueChange={(value) => value === 'none' ? setSortConfig({ column: '', order: 'asc' }) : handleSortChange(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select column to sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No sorting</SelectItem>
                  {dataColumns.map((column) => (
                    <SelectItem key={column.key} value={column.key}>
                      {column.label}
                      {sortConfig.column === column.key && (
                        <span className="ml-2 text-xs">
                          {sortConfig.order === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {dataColumns.map((column) => (
                        <th 
                          key={column.key} 
                          className="px-3 py-2 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => handleSortChange(column.key)}
                        >
                          <div className="flex items-center gap-2">
                            {column.label}
                            {sortConfig.column === column.key && (
                              <span className="text-primary">
                                {sortConfig.order === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                        {dataColumns.map((column) => (
                          <td key={column.key} className="px-3 py-2 text-foreground">
                            {column.type === 'percentage' 
                              ? `${row[column.key]}%`
                              : row[column.key]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right side - Questions */}
          <div className="space-y-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-foreground">
                {instructions || "For each of the following statements about this data, select Yes if the statement can be inferred from the given information. Otherwise, select No."}
              </p>
            </div>

            <div className="space-y-4">
              {statements.map((statement, index) => (
                <div key={statement.id} className="p-4 border border-border rounded-lg bg-card">
                  <RadioGroup className="space-y-2">
                    <div className="flex items-center space-x-6 mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${statement.id}-yes`} />
                        <Label htmlFor={`${statement.id}-yes`} className="text-sm font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${statement.id}-no`} />
                        <Label htmlFor={`${statement.id}-no`} className="text-sm font-medium">
                          No
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-foreground leading-relaxed">
                    {statement.text || `Statement ${index + 1} text will appear here...`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};