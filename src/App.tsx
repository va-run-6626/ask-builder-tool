import React, { useState, useMemo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Save, Eye, Trash2, Plus } from 'lucide-react';
import { Question, DataColumn, DataRow, QuestionStatement, QuestionFormat, MultiColumnOption, DataSufficiencyStatement, DataSufficiencyOption, SortConfig } from '@/types/question';

const queryClient = new QueryClient();

const App = () => {
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

  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: '', order: 'asc' });

  const updateQuestionField = (field: keyof Question, value: any) => {
    setQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleFormatChange = (newFormat: QuestionFormat) => {
    setQuestion(prev => ({
      ...prev,
      format: newFormat,
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

  // Data Table Functions
  const addColumn = () => {
    const newColumn: DataColumn = {
      key: `col_${Date.now()}`,
      label: 'New Column',
      type: 'text'
    };
    updateQuestionField('dataColumns', [...question.dataColumns, newColumn]);
  };

  const updateColumn = (index: number, field: keyof DataColumn, value: string) => {
    const updatedColumns = [...question.dataColumns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    updateQuestionField('dataColumns', updatedColumns);
    
    if (field === 'key') {
      const updatedRows = question.dataRows.map(row => {
        const newRow = { ...row };
        if (question.dataColumns[index].key in newRow) {
          newRow[value] = newRow[question.dataColumns[index].key];
          delete newRow[question.dataColumns[index].key];
        }
        return newRow as DataRow;
      });
      updateQuestionField('dataRows', updatedRows);
    }
  };

  const removeColumn = (index: number) => {
    const columnKey = question.dataColumns[index].key;
    const updatedColumns = question.dataColumns.filter((_, i) => i !== index);
    const updatedRows = question.dataRows.map(row => {
      const { [columnKey]: removed, ...rest } = row;
      return rest as DataRow;
    });
    updateQuestionField('dataColumns', updatedColumns);
    updateQuestionField('dataRows', updatedRows);
  };

  const addRow = () => {
    const newRow: DataRow = {
      id: `row_${Date.now()}`,
      ...question.dataColumns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {})
    };
    updateQuestionField('dataRows', [...question.dataRows, newRow]);
  };

  const updateRow = (rowIndex: number, columnKey: string, value: string) => {
    const updatedRows = [...question.dataRows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: value };
    updateQuestionField('dataRows', updatedRows);
  };

  const removeRow = (index: number) => {
    updateQuestionField('dataRows', question.dataRows.filter((_, i) => i !== index));
  };

  // Statements Functions
  const addStatement = () => {
    const newStatement: QuestionStatement = {
      id: `stmt_${Date.now()}`,
      text: '',
      correctAnswer: 'yes'
    };
    updateQuestionField('statements', [...question.statements, newStatement]);
  };

  const updateStatement = (index: number, field: keyof QuestionStatement, value: string) => {
    const updatedStatements = [...question.statements];
    updatedStatements[index] = { 
      ...updatedStatements[index], 
      [field]: field === 'correctAnswer' ? value as 'yes' | 'no' : value 
    };
    updateQuestionField('statements', updatedStatements);
  };

  const removeStatement = (index: number) => {
    updateQuestionField('statements', question.statements.filter((_, i) => i !== index));
  };

  // Multi-Column Selection Functions
  const addSelectionColumn = () => {
    updateQuestionField('selectionColumns', [...(question.selectionColumns || []), `Column ${(question.selectionColumns || []).length + 1}`]);
  };

  const updateSelectionColumn = (index: number, value: string) => {
    const updatedColumns = [...(question.selectionColumns || [])];
    updatedColumns[index] = value;
    updateQuestionField('selectionColumns', updatedColumns);
  };

  const removeSelectionColumn = (index: number) => {
    const updatedColumns = (question.selectionColumns || []).filter((_, i) => i !== index);
    updateQuestionField('selectionColumns', updatedColumns);
    
    const updatedOptions = (question.selectionOptions || []).map(option => ({
      ...option,
      columns: option.columns.filter((_, i) => i !== index)
    }));
    updateQuestionField('selectionOptions', updatedOptions);
  };

  const addSelectionOption = () => {
    const newOption: MultiColumnOption = {
      id: `opt_${Date.now()}`,
      label: '',
      columns: new Array((question.selectionColumns || []).length).fill('')
    };
    updateQuestionField('selectionOptions', [...(question.selectionOptions || []), newOption]);
  };

  const updateSelectionOption = (index: number, field: 'label' | 'columns', value: string | string[]) => {
    const updatedOptions = [...(question.selectionOptions || [])];
    if (field === 'label') {
      updatedOptions[index].label = value as string;
    } else {
      updatedOptions[index].columns = value as string[];
    }
    updateQuestionField('selectionOptions', updatedOptions);
  };

  const updateSelectionOptionColumn = (optionIndex: number, columnIndex: number, value: string) => {
    const updatedOptions = [...(question.selectionOptions || [])];
    updatedOptions[optionIndex].columns[columnIndex] = value;
    updateQuestionField('selectionOptions', updatedOptions);
  };

  const removeSelectionOption = (index: number) => {
    updateQuestionField('selectionOptions', (question.selectionOptions || []).filter((_, i) => i !== index));
  };

  // Data Sufficiency Functions
  const addSufficiencyStatement = () => {
    const newStatement: DataSufficiencyStatement = {
      id: `stmt_${Date.now()}`,
      text: ''
    };
    updateQuestionField('sufficiencyStatements', [...(question.sufficiencyStatements || []), newStatement]);
  };

  const updateSufficiencyStatement = (index: number, text: string) => {
    const updatedStatements = [...(question.sufficiencyStatements || [])];
    updatedStatements[index].text = text;
    updateQuestionField('sufficiencyStatements', updatedStatements);
  };

  const removeSufficiencyStatement = (index: number) => {
    updateQuestionField('sufficiencyStatements', (question.sufficiencyStatements || []).filter((_, i) => i !== index));
  };

  const addSufficiencyOption = () => {
    const newOption: DataSufficiencyOption = {
      id: `opt_${Date.now()}`,
      text: '',
      isCorrect: false
    };
    updateQuestionField('sufficiencyOptions', [...(question.sufficiencyOptions || []), newOption]);
  };

  const updateSufficiencyOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const updatedOptions = [...(question.sufficiencyOptions || [])];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    updateQuestionField('sufficiencyOptions', updatedOptions);
  };

  const removeSufficiencyOption = (index: number) => {
    updateQuestionField('sufficiencyOptions', (question.sufficiencyOptions || []).filter((_, i) => i !== index));
  };

  // Preview Functions
  const sortedRows = useMemo(() => {
    if (!sortConfig.column) return question.dataRows;

    return [...question.dataRows].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        const aNum = parseFloat(String(aValue).replace('%', ''));
        const bNum = parseFloat(String(bValue).replace('%', ''));
        comparison = aNum - bNum;
      }

      return sortConfig.order === 'asc' ? comparison : -comparison;
    });
  }, [question.dataRows, sortConfig]);

  const handleSortChange = (columnKey: string) => {
    setSortConfig(prev => ({
      column: columnKey,
      order: prev.column === columnKey && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const hasRequiredContent = () => {
    switch (question.format) {
      case 'yes-no-statements':
        return question.dataColumns.length && question.dataRows.length && question.statements.length;
      case 'multi-column-selection':
        return (question.selectionColumns?.length || 0) > 0 && (question.selectionOptions?.length || 0) > 0;
      case 'data-sufficiency':
        return (question.questionText || '').trim().length > 0 && (question.sufficiencyOptions?.length || 0) > 0;
      default:
        return false;
    }
  };

  const renderPreview = () => {
    if (!hasRequiredContent()) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>Configure your question content to see the preview</p>
        </div>
      );
    }

    const renderPreviewContent = () => {
      switch (question.format) {
        case 'yes-no-statements':
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {question.contextDescription && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed">
                      {question.contextDescription}
                    </p>
                  </div>
                )}

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
                      {question.dataColumns.map((column) => (
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

                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          {question.dataColumns.map((column) => (
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
                            {question.dataColumns.map((column) => (
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

              <div className="space-y-4">
                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-foreground">
                    {question.instructions}
                  </p>
                </div>

                <div className="space-y-4">
                  {question.statements.map((statement, index) => (
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
          );

        case 'multi-column-selection':
          return (
            <div className="space-y-6">
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-foreground">
                  {question.instructions || "In the table, select for each option..."}
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold text-foreground min-w-[120px]"></th>
                        {(question.selectionColumns || []).map((column, index) => (
                          <th key={index} className="px-4 py-3 text-center font-semibold text-foreground min-w-[100px]">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(question.selectionOptions || []).map((option, optionIndex) => (
                        <tr key={option.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">
                            {option.label}
                          </td>
                          {option.columns.map((_, columnIndex) => (
                            <td key={columnIndex} className="px-4 py-3 text-center">
                              <div className="flex justify-center">
                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground cursor-pointer hover:border-primary transition-colors"></div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );

        case 'data-sufficiency':
          return (
            <div className="space-y-6">
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  {question.questionText || 'Question text will appear here...'}
                </p>
              </div>

              {(question.sufficiencyStatements || []).length > 0 && (
                <div className="space-y-3">
                  {question.sufficiencyStatements?.map((statement, index) => (
                    <div key={statement.id} className="p-3 border border-border rounded-lg bg-card">
                      <span className="font-medium text-foreground">({index + 1}) </span>
                      <span className="text-sm text-foreground leading-relaxed">
                        {statement.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <RadioGroup className="space-y-3">
                  {(question.sufficiencyOptions || []).map((option, index) => (
                    <div key={option.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors bg-card cursor-pointer">
                      <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                      <Label htmlFor={option.id} className="text-sm text-foreground leading-relaxed cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );

        default:
          return <div className="text-muted-foreground">Unsupported question format</div>;
      }
    };

    return (
      <div>
        <div className="mb-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground">{question.title}</h2>
            <div className="text-sm text-muted-foreground">
              Time Remaining: 00:43:21
            </div>
          </div>
          {question.description && (
            <p className="text-sm text-muted-foreground">{question.description}</p>
          )}
        </div>
        {renderPreviewContent()}
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
                          placeholder="Enter the context description that explains the data table"
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Data Table Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-end">
                          <Button onClick={addColumn} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Column
                          </Button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                {question.dataColumns.map((column, index) => (
                                  <th key={column.key} className="p-3 text-left">
                                    <div className="space-y-2">
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
                                      
                                      <Input
                                        placeholder="Column Header"
                                        value={column.label}
                                        onChange={(e) => updateColumn(index, 'label', e.target.value)}
                                        className="h-8 text-xs font-medium"
                                      />
                                    </div>
                                  </th>
                                ))}
                                {question.dataColumns.length > 0 && (
                                  <th className="p-3 w-12">
                                    <span className="text-xs text-muted-foreground">Actions</span>
                                  </th>
                                )}
                              </tr>
                            </thead>
                            
                            <tbody>
                              {question.dataRows.map((row, rowIndex) => (
                                <tr key={row.id} className="border-b hover:bg-muted/25">
                                  {question.dataColumns.map((column) => (
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
                                  {question.dataColumns.length > 0 && (
                                    <td className="p-3">
                                      <Button
                                        onClick={() => removeRow(rowIndex)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          
                          {question.dataColumns.length > 0 && (
                            <div className="border-t bg-muted/25">
                              <div className="p-3 flex gap-3">
                                {question.dataColumns.map((column, index) => (
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

                        {question.dataColumns.length > 0 && (
                          <div className="flex justify-center">
                            <Button onClick={addRow} size="sm" variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Row
                            </Button>
                          </div>
                        )}

                        {question.dataColumns.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>Add columns to start building your data table</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="statements" className="space-y-6">
                {question.format === 'yes-no-statements' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Question Statements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
                        <Textarea
                          placeholder="For each of the following statements about this data, select Yes if the statement can be inferred from the given information. Otherwise, select No."
                          value={question.instructions}
                          onChange={(e) => updateQuestionField('instructions', e.target.value)}
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Statements</h3>
                          <Button onClick={addStatement} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Statement
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {question.statements.map((statement, index) => (
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
                          
                          {question.statements.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No statements yet. Add your first statement to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {question.format === 'multi-column-selection' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Multi-Column Selection Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
                        <Textarea
                          placeholder="In the table, select for each option..."
                          value={question.instructions}
                          onChange={(e) => updateQuestionField('instructions', e.target.value)}
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Selection Columns</h3>
                          <Button onClick={addSelectionColumn} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Column
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {(question.selectionColumns || []).map((column, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <Input
                                placeholder={`Column ${index + 1} name`}
                                value={column}
                                onChange={(e) => updateSelectionColumn(index, e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => removeSelectionColumn(index)}
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

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Selection Options</h3>
                          <Button onClick={addSelectionOption} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {(question.selectionOptions || []).map((option, optionIndex) => (
                            <div key={option.id} className="p-4 bg-muted rounded-lg space-y-3">
                              <div className="flex items-center gap-3">
                                <Input
                                  placeholder="Option label/value"
                                  value={option.label}
                                  onChange={(e) => updateSelectionOption(optionIndex, 'label', e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() => removeSelectionOption(optionIndex)}
                                  size="sm"
                                  variant="outline"
                                  className="shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(question.selectionColumns || []).map((columnName, columnIndex) => (
                                  <div key={columnIndex}>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                      {columnName || `Column ${columnIndex + 1}`}
                                    </label>
                                    <Input
                                      placeholder="Cell value"
                                      value={option.columns[columnIndex] || ''}
                                      onChange={(e) => updateSelectionOptionColumn(optionIndex, columnIndex, e.target.value)}
                                      className="w-full"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {(question.selectionOptions || []).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No options yet. Add your first option to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {question.format === 'data-sufficiency' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Data Sufficiency Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Main Question</h3>
                        <Textarea
                          placeholder="Enter the main question text..."
                          value={question.questionText || ''}
                          onChange={(e) => updateQuestionField('questionText', e.target.value)}
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Statements</h3>
                          <Button onClick={addSufficiencyStatement} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Statement
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {(question.sufficiencyStatements || []).map((statement, index) => (
                            <div key={statement.id} className="p-4 bg-muted rounded-lg space-y-3">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-muted-foreground min-w-0">
                                  ({index + 1})
                                </span>
                                <Button
                                  onClick={() => removeSufficiencyStatement(index)}
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
                                onChange={(e) => updateSufficiencyStatement(index, e.target.value)}
                                rows={2}
                                className="w-full"
                              />
                            </div>
                          ))}
                          
                          {(question.sufficiencyStatements || []).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No statements yet. Add your first statement to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Answer Options</h3>
                          <Button onClick={addSufficiencyOption} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {(question.sufficiencyOptions || []).map((option, index) => (
                            <div key={option.id} className="p-4 bg-muted rounded-lg space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`correct-${option.id}`}
                                    checked={option.isCorrect}
                                    onCheckedChange={(checked) => 
                                      updateSufficiencyOption(index, 'isCorrect', checked === true)
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
                                  onClick={() => removeSufficiencyOption(index)}
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
                                onChange={(e) => updateSufficiencyOption(index, 'text', e.target.value)}
                                rows={2}
                                className="w-full"
                              />
                            </div>
                          ))}
                          
                          {(question.sufficiencyOptions || []).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No options yet. Add your first option to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Question Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderPreview()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;