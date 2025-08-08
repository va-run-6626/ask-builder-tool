import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, FileText, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="container pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Professional GMAT Question Builder
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Create sophisticated data insights questions with interactive tables, 
            multiple-choice statements, and professional formatting - just like the official GMAT exam.
          </p>
          <Link to="/builder">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Building Questions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Interactive Data Tables</CardTitle>
              <CardDescription>
                Build dynamic data tables with customizable columns, row data, and professional formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Custom column types (text, numbers, percentages)</li>
                <li>• Flexible row management</li>
                <li>• Professional table styling</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Smart Question Statements</CardTitle>
              <CardDescription>
                Create multiple-choice statements with correct answer tracking and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Yes/No statement options</li>
                <li>• Answer key management</li>
                <li>• Custom instructions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-time Preview</CardTitle>
              <CardDescription>
                See exactly how your question will look with GMAT-style formatting and layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Live preview updates</li>
                <li>• Professional GMAT styling</li>
                <li>• Export ready questions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
