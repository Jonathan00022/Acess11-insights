"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Violation } from "@/ai/flows/get-accessibility-insights-from-api";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


type IssueCardProps = {
  violation: Violation;
  onGetFix: (violation: Violation) => void;
  suggestion?: string;
  isLoading?: boolean;
};

const impactColorClasses = {
  critical: "border-chart-1/50 bg-chart-1/10",
  serious: "border-chart-2/50 bg-chart-2/10",
  moderate: "border-chart-3/50 bg-chart-3/10",
  minor: "border-chart-4/50 bg-chart-4/10",
};

export default function IssueCard({ violation, onGetFix, suggestion, isLoading }: IssueCardProps) {
  const { id, impact, description, helpUrl, nodes, tags } = violation;

  const colorClass = impact ? impactColorClasses[impact] : '';

  return (
    <AccordionItem value={`${id}-${nodes[0].target[0]}`} className={`rounded-lg border px-4 ${colorClass}`}>
      <AccordionTrigger>
        <div className="flex flex-col text-left">
          <span className="font-semibold">{description}</span>
          {impact && <div className="text-xs text-muted-foreground mt-1">Impact: <span className="font-medium capitalize">{impact}</span></div>}
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Affected Element:</h4>
          <div className="p-2 bg-background/50 rounded-md">
            <code className="text-sm text-accent">
              {nodes[0].html}
            </code>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Selector: <code className="text-xs">{nodes[0].target.join(', ')}</code></p>
        </div>
        
        <div className="flex flex-wrap gap-1">
            {tags.map(tag => <Badge variant="secondary" key={tag}>{tag}</Badge>)}
            <a href={helpUrl} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="hover:bg-accent/20">
                Learn more <ExternalLink className="ml-1 h-3 w-3" />
              </Badge>
            </a>
        </div>
        
        <div className="pt-2">
          {!suggestion && (
            <Button onClick={() => onGetFix(violation)} disabled={isLoading} size="sm" variant="outline">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Thinking...' : 'Suggest a Fix'}
            </Button>
          )}

          {suggestion && (
            <div>
              <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> AI Suggestion</h4>
              <div className="prose prose-sm dark:prose-invert max-w-none text-accent-foreground/90 whitespace-pre-wrap rounded-md border border-accent/50 bg-accent/10 p-3">
                 <ReactMarkdown
                    components={{
                        code({node, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {suggestion}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
