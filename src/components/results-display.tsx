"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import IssueCard from './issue-card';
import type { ScanResult } from '@/app/actions';
import { ShieldAlert, ShieldCheck, Shield, ShieldX, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from './ui/separator';
import { Violation } from '@/ai/flows/get-accessibility-insights-from-api';
import { useState, useEffect } from 'react';

type ResultsDisplayProps = {
  results: ScanResult;
  onGetFix: (violation: Violation) => void;
  fixSuggestions: Record<string, string>;
  loadingFixes: Record<string, boolean>;
  isScanning: boolean;
};

const impactLevels = [
    { level: 'critical', icon: <ShieldX className="h-5 w-5 text-chart-1" />, color: 'text-chart-1' },
    { level: 'serious', icon: <ShieldAlert className="h-5 w-5 text-chart-2" />, color: 'text-chart-2' },
    { level: 'moderate', icon: <Shield className="h-5 w-5 text-chart-3" />, color: 'text-chart-3' },
    { level: 'minor', icon: <ShieldCheck className="h-5 w-5 text-chart-4" />, color: 'text-chart-4' },
];

export default function ResultsDisplay({ results, onGetFix, fixSuggestions, loadingFixes, isScanning }: ResultsDisplayProps) {
  const { url, violations, summary } = results;
  const [activeTab, setActiveTab] = useState('critical');

  const filteredViolations = (impact: string) => violations.filter(v => v.impact === impact);

  const totalIssues = violations.length;

  useEffect(() => {
    // If the current active tab has no issues, switch to the first one that does.
    const currentTabHasIssues = filteredViolations(activeTab).length > 0;
    if (!currentTabHasIssues) {
      const firstTabWithIssues = impactLevels.find(level => filteredViolations(level.level).length > 0);
      if (firstTabWithIssues) {
        setActiveTab(firstTabWithIssues.level);
      }
    }
  }, [violations, activeTab]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Scan Summary for <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{url}</a>
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            {isScanning && <Loader2 className="h-4 w-4 animate-spin" />}
            {isScanning ? `Scanning... Found ${totalIssues} so far.` : `Found ${totalIssues} potential issue${totalIssues !== 1 ? 's' : ''}.`}
          </CardDescription>
        </CardHeader>
        {summary && !isScanning && (
          <CardContent>
            <div className="rounded-lg border bg-secondary/30 p-4 text-sm">
                <p className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-secondary-foreground/90">{summary}</span>
                </p>
            </div>
          </CardContent>
        )}
      </Card>

      {(totalIssues > 0 || isScanning) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                {impactLevels.map(impact => {
                    const count = filteredViolations(impact.level).length;
                    return (
                        <TabsTrigger key={impact.level} value={impact.level} disabled={count === 0 && !isScanning}>
                            <div className="flex items-center gap-2">
                            {impact.icon}
                            <span className="capitalize">{impact.level}</span>
                            {count > 0 && <Badge variant={activeTab === impact.level ? "default" : "secondary"}>{count}</Badge>}
                            </div>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
            <Separator className="my-4" />
            {impactLevels.map(impact => {
                const issues = filteredViolations(impact.level);
                if(issues.length === 0) return null;
                return (
                    <TabsContent key={impact.level} value={impact.level} forceMount>
                        <Accordion type="multiple" className="w-full space-y-2">
                            {issues.map((violation) => {
                                const key = `${violation.id}-${violation.nodes[0].target[0]}`;
                                return (
                                    <IssueCard
                                        key={key}
                                        violation={violation}
                                        onGetFix={onGetFix}
                                        suggestion={fixSuggestions[key]}
                                        isLoading={loadingFixes[key]}
                                    />
                                );
                            })}
                        </Accordion>
                    </TabsContent>
                )
            })}
        </Tabs>
      )}

      {totalIssues === 0 && !isScanning && !results.error && (
            <Card>
              <CardHeader><CardTitle>All Clear!</CardTitle></CardHeader>
              <CardContent><p>We didn't find any accessibility issues on {url}. Great job!</p></CardContent>
            </Card>
      )}
    </div>
  );
}
