"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { scanUrl, getFixSuggestion } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Search, Loader2 } from 'lucide-react';
import ResultsDisplay from './results-display';
import { Skeleton } from './ui/skeleton';
import type { Violation } from "@/ai/flows/get-accessibility-insights-from-api";
import { useState } from 'react';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Scanning...' : 'Scan Website'}
    </Button>
  );
}

function LoadingSkeleton() {
    return (
        <div className="animate-pulse">
            <Card className="mb-6">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                </CardHeader>
                <CardContent>
                     <Skeleton className="h-10 w-full bg-muted" />
                </CardContent>
            </Card>
        </div>
    );
}

export default function A11yChecker() {
  const [state, formAction, isPending] = useActionState(scanUrl, undefined);
  
  const [fixSuggestions, setFixSuggestions] = useState<Record<string, string>>({});
  const [loadingFixes, setLoadingFixes] = useState<Record<string, boolean>>({});

  const handleGetFix = async (violation: Violation) => {
    const key = `${violation.id}-${violation.nodes[0].target[0]}`;
    setLoadingFixes(prev => ({ ...prev, [key]: true }));
    const result = await getFixSuggestion(violation);
    if ('suggestion' in result) {
      setFixSuggestions(prev => ({ ...prev, [key]: result.suggestion }));
    } else {
      setFixSuggestions(prev => ({ ...prev, [key]: result.error || 'Could not get suggestion.' }));
    }
    setLoadingFixes(prev => ({ ...prev, [key]: false }));
  };
  
  const showSkeleton = isPending && !state?.violations?.length;

  return (
    <div className="container mx-auto max-w-4xl pb-8 px-4">
      <form action={formAction}>
        <Card className="mb-8 border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Start Your Free Scan</CardTitle>
            <CardDescription>
              Enter a URL to check for accessibility issues with our AI-powered tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://example.com"
                  required
                  className="flex-grow"
                  disabled={isPending}
                  defaultValue={state?.url}
                />
                <SubmitButton />
              </div>
              {state?.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
            </div>
          </CardContent>
        </Card>
      </form>
      
      {showSkeleton && <LoadingSkeleton />}

      {state?.violations && (
        <ResultsDisplay
          results={state}
          onGetFix={handleGetFix}
          fixSuggestions={fixSuggestions}
          loadingFixes={loadingFixes}
          isScanning={isPending}
        />
      )}

      {!state?.url && !isPending && (
        <Alert className="border-accent/50 text-accent-foreground">
          <Lightbulb className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent">Welcome to Acess11 Insights!</AlertTitle>
          <AlertDescription>
            Use our free tool to start your website accessibility audit.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
