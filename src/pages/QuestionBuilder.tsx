import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTableInput } from '@/components/DataTableInput';
import { StatementsInput } from '@/components/StatementsInput';
import { MultiColumnSelectionInput } from '@/components/MultiColumnSelectionInput';
import { DataSufficiencyInput } from '@/components/DataSufficiencyInput';
import { QuestionPreview } from '@/components/QuestionPreview';
import { Question, DataColumn, DataRow, QuestionStatement, QuestionFormat } from '@/types/question';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Eye } from 'lucide-react';

const QuestionBuilder = () => {
  const [question, setQuestion] = useState<Question>({
    title: 'GMAT™ Data Insights Question',
    description: 'Practice Question - Data Analysis',
    format: 'yes-no-statements',
    dataColumns: [
      { key: 'item', label: 'Item', type: 'text' },
      { key: 'placement', label: 'Page placement', type: 'text' },
      { key: 'eye_time', label: 'Mean eye time (seconds)', type: 'number' },
      { key: 'infoclick', label: 'Infoclick percentage', type: 'percentage' },
      { key: 'sales_rank', label: 'Sales rank', type: 'number' }
    ] as DataColumn[],
    dataRows: [
      { id: '1', item: 'A', placement: 'upper left', eye_time: '8.20', infoclick: '35', sales_rank: '2' },
      { id: '2', item: 'B', placement: 'lower right', eye_time: '7.15', infoclick: '67', sales_rank: '3' },
      { id: '3', item: 'C', placement: 'lower left', eye_time: '7.25', infoclick: '22', sales_rank: '8' },
      { id: '4', item: 'D', placement: 'upper right', eye_time: '8.35', infoclick: '52', sales_rank: '1' },
    ] as DataRow[],
    statements: [
      {
        id: '1',
        text: 'Infoclick percentage is directly proportional to mean eye time.',
        correctAnswer: 'no'
      },
      {
        id: '2', 
        text: 'The 2 items having the greatest sales were advertised in the upper part of the web page.',
        correctAnswer: 'yes'
      }
    ] as QuestionStatement[],
    instructions: 'For each of the following statements about this data, select Yes if the statement can be inferred from the given information. Otherwise, select No.',
    contextDescription: 'The table lists data on each of 4 items advertised by an Internet retailer on a single web page as part of a one-day sale. The term customer refers to anyone who viewed that web page on that day. For each item, the page placement denotes the quadrant of the page on which the item\'s advertisement appeared; the mean eye time is the average (arithmetic mean) number of seconds that each customer spent viewing the item\'s advertisement; the infoclick percentage is the percentage of all customers who clicked a button for more information; and the sales rank is the item\'s ranking based on sales, where a lesser number denotes greater sales.'
  });

  const updateQuestionField = (field: keyof Question, value: any) => {
    setQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleFormatChange = (newFormat: QuestionFormat) => {
    setQuestion(prev => ({
      ...prev,
      format: newFormat,
      // Initialize format-specific fields
      selectionColumns: newFormat === 'multi-column-selection' ? ['Column 1', 'Column 2'] : prev.selectionColumns,
      selectionOptions: newFormat === 'multi-column-selection' ? [] : prev.selectionOptions,
      questionText: newFormat === 'data-sufficiency' ? '' : prev.questionText,
      sufficiencyStatements: newFormat === 'data-sufficiency' ? [] : prev.sufficiencyStatements,
      sufficiencyOptions: newFormat === 'data-sufficiency' ? [] : prev.sufficiencyOptions
    }));
  };

  const getQuestionTypeLabel = (format: QuestionFormat) => {
    switch (format) {
      case 'yes-no-statements':
        return 'Yes/No Statements';
      case 'multi-column-selection':
        return 'Multi-Column Selection';
      case 'data-sufficiency':
        return 'Data Sufficiency';
      default:
        return 'Unknown';
    }
  };

  const exportQuestion = () => {
    const dataStr = JSON.stringify(question, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'gmat-question.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">GMAT Question Builder</h1>
              <p className="text-muted-foreground">Create professional data insights questions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={exportQuestion} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        {/* Question Format Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Question Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground">Question Type:</label>
              <Select value={question.format} onValueChange={handleFormatChange}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes-no-statements">Yes/No Statements</SelectItem>
                  <SelectItem value="multi-column-selection">Multi-Column Selection</SelectItem>
                  <SelectItem value="data-sufficiency">Data Sufficiency</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Current: {getQuestionTypeLabel(question.format)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="data">
              {question.format === 'data-sufficiency' ? 'Question Content' : 'Data Table'}
            </TabsTrigger>
            <TabsTrigger value="statements">
              {question.format === 'yes-no-statements' ? 'Statements' : 
               question.format === 'multi-column-selection' ? 'Selection Options' : 'Answer Options'}
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Question Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Question Title
                  </label>
                  <Input
                    value={question.title}
                    onChange={(e) => updateQuestionField('title', e.target.value)}
                    placeholder="Enter question title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Textarea
                    value={question.description}
                    onChange={(e) => updateQuestionField('description', e.target.value)}
                    placeholder="Enter question description"
                    rows={3}
                  />
                </div>
                
                {question.format === 'yes-no-statements' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Context Description
                    </label>
                    <Textarea
                      value={question.contextDescription || ''}
                      onChange={(e) => updateQuestionField('contextDescription', e.target.value)}
                      placeholder="Enter the context description that explains the data table (e.g., what the table represents, definitions of terms, etc.)"
                      rows={4}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {question.format === 'data-sufficiency' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Question Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Data sufficiency questions don't require a data table. The question content is managed in the next tab.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <DataTableInput
                columns={question.dataColumns}
                rows={question.dataRows}
                onColumnsChange={(columns) => updateQuestionField('dataColumns', columns)}
                onRowsChange={(rows) => updateQuestionField('dataRows', rows)}
              />
            )}
          </TabsContent>

          <TabsContent value="statements" className="space-y-6">
            {question.format === 'yes-no-statements' && (
              <StatementsInput
                statements={question.statements}
                instructions={question.instructions}
                onStatementsChange={(statements) => updateQuestionField('statements', statements)}
                onInstructionsChange={(instructions) => updateQuestionField('instructions', instructions)}
              />
            )}
            
            {question.format === 'multi-column-selection' && (
              <MultiColumnSelectionInput
                columns={question.selectionColumns || []}
                options={question.selectionOptions || []}
                instructions={question.instructions}
                onColumnsChange={(columns) => updateQuestionField('selectionColumns', columns)}
                onOptionsChange={(options) => updateQuestionField('selectionOptions', options)}
                onInstructionsChange={(instructions) => updateQuestionField('instructions', instructions)}
              />
            )}
            
            {question.format === 'data-sufficiency' && (
              <DataSufficiencyInput
                questionText={question.questionText || ''}
                statements={question.sufficiencyStatements || []}
                options={question.sufficiencyOptions || []}
                onQuestionTextChange={(text) => updateQuestionField('questionText', text)}
                onStatementsChange={(statements) => updateQuestionField('sufficiencyStatements', statements)}
                onOptionsChange={(options) => updateQuestionField('sufficiencyOptions', options)}
              />
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <QuestionPreview question={question} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionBuilder;