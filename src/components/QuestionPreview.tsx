import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question } from '@/types/question';

interface QuestionPreviewProps {
  question: Question;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question }) => {
  const { title, description, dataColumns, dataRows, statements, instructions } = question;

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

            {/* Data Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {dataColumns.map((column) => (
                        <th key={column.key} className="px-3 py-2 text-left font-semibold text-foreground">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-b-0">
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