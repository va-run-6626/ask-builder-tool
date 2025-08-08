import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTableInput } from '@/components/DataTableInput';
import { StatementsInput } from '@/components/StatementsInput';
import { QuestionPreview } from '@/components/QuestionPreview';
import { Question, DataColumn, DataRow, QuestionStatement } from '@/types/question';
import { Download, Save, Eye } from 'lucide-react';

const QuestionBuilder = () => {
  const [question, setQuestion] = useState<Question>({
    title: 'GMAT™ Data Insights Question',
    description: 'Practice Question - Data Analysis',
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
    instructions: 'For each of the following statements about this data, select Yes if the statement can be inferred from the given information. Otherwise, select No.'
  });

  const updateQuestionField = (field: keyof Question, value: any) => {
    setQuestion(prev => ({ ...prev, [field]: value }));
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
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="data">Data Table</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataTableInput
              columns={question.dataColumns}
              rows={question.dataRows}
              onColumnsChange={(columns) => updateQuestionField('dataColumns', columns)}
              onRowsChange={(rows) => updateQuestionField('dataRows', rows)}
            />
          </TabsContent>

          <TabsContent value="statements" className="space-y-6">
            <StatementsInput
              statements={question.statements}
              instructions={question.instructions}
              onStatementsChange={(statements) => updateQuestionField('statements', statements)}
              onInstructionsChange={(instructions) => updateQuestionField('instructions', instructions)}
            />
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