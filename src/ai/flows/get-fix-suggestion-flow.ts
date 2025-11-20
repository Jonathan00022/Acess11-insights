
'use server';
/**
 * @fileOverview A flow that provides AI-powered suggestions to fix accessibility violations.
 *
 * - getFixSuggestion - A function that takes a violation and returns a detailed suggestion.
 * - GetFixSuggestionInput - The input type for the getFixSuggestion function.
 * - GetFixSuggestionOutput - The return type for the getFixSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Violation } from './get-accessibility-insights-from-api';

const GetFixSuggestionInputSchema = z.object({
  violation: z.object({
    id: z.string(),
    impact: z.enum(['minor', 'moderate', 'serious', 'critical']).nullable(),
    description: z.string(),
    help: z.string(),
    helpUrl: z.string(),
    nodes: z.array(z.object({
      html: z.string(),
      target: z.array(z.string()),
    })),
  })
});
export type GetFixSuggestionInput = z.infer<typeof GetFixSuggestionInputSchema>;

const GetFixSuggestionOutputSchema = z.object({
  id: z.string().describe("The ID of the violation this suggestion is for."),
  suggestion: z.string().describe("A detailed, actionable suggestion on how to fix the accessibility issue. Provide code examples where appropriate. The response should be in Markdown format."),
});
export type GetFixSuggestionOutput = z.infer<typeof GetFixSuggestionOutputSchema>;

export async function getFixSuggestion(violation: Violation): Promise<GetFixSuggestionOutput | { error: string }> {
  try {
    const result = await getFixSuggestionFlow({ violation });
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: 'Failed to get suggestion from AI.' };
  }
}

const prompt = ai.definePrompt({
  name: 'getFixSuggestionPrompt',
  input: { schema: GetFixSuggestionInputSchema },
  output: { schema: GetFixSuggestionOutputSchema },
  prompt: `
You are an expert web accessibility (a11y) engineer. Your task is to provide a clear and actionable suggestion to fix a reported accessibility violation.

The user will provide you with a JSON object representing the violation data from the axe-core library.

**Violation Details:**
- **Description:** {{{violation.description}}}
- **Impact:** {{{violation.impact}}}
- **Affected HTML:** \`\`\`html\n{{{violation.violation.nodes.0.html}}}\n\`\`\`
- **Axe-core Help Text:** {{{violation.help}}}

**Your Task:**
Based on the violation details, provide a helpful, easy-to-understand suggestion to fix the issue.

**Instructions:**
1.  Start with a clear explanation of *why* this is an issue.
2.  Provide a concrete, actionable solution.
3.  If possible, include a code snippet showing the "before" and "after" or just the corrected code.
4.  Keep the tone helpful and encouraging.
5.  The response should be formatted in Markdown.
6.  Set the 'id' in the output to be the same as the input violation id: {{{violation.id}}}
`,
});

const getFixSuggestionFlow = ai.defineFlow(
  {
    name: 'getFixSuggestionFlow',
    inputSchema: GetFixSuggestionInputSchema,
    outputSchema: GetFixSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate a suggestion from the AI model.');
    }
    return output;
  }
);
