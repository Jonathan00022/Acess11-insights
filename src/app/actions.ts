
"use server";

import { z } from "zod";
import { getAccessibilityInsightsFlow } from "@/ai/flows/get-accessibility-insights-from-api";
import { getFixSuggestion as getFixSuggestionFlow } from "@/ai/flows/get-fix-suggestion-flow";
import type { Violation } from "@/ai/flows/get-accessibility-insights-from-api";


const UrlSchema = z.string().url({ message: "Please enter a valid URL." });

export type ScanResult = {
  url: string;
  violations: Violation[];
  summary?: string;
  error?: string;
};

export async function scanUrl(prevState: ScanResult | undefined, formData: FormData): Promise<ScanResult> {
  const url = formData.get("url");
  const validatedUrl = UrlSchema.safeParse(url);

  if (!validatedUrl.success) {
    return { url: '', violations: [], error: validatedUrl.error.errors[0].message };
  }
  
  try {
    const result = await getAccessibilityInsightsFlow({ url: validatedUrl.data });

    if (result.error) {
        return { url: validatedUrl.data, violations: [], error: result.error };
    }

    const violations = result.violations || [];
    
    return {
        url: validatedUrl.data,
        violations: violations,
        summary: `Scan finished for ${validatedUrl.data}. Found ${violations.length} potential issues.`,
    };

  } catch (e: any) {
    return {
        url: validatedUrl.data,
        violations: [],
        error: `Failed to scan the page. Please ensure the URL is correct and the site is accessible. Error: ${e.message}`,
    };
  }
}

export async function getFixSuggestion(violation: Violation): Promise<{id: string; suggestion: string} | {error: string}> {    
    return getFixSuggestionFlow(violation);
}
