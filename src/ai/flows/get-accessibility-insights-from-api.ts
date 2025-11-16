
'use server';

/**
 * @fileOverview This file defines a Genkit flow for getting accessibility insights using axe-core and JSDOM.
 *
 * - `getAccessibilityInsightsFlow`: A flow that takes a URL and returns accessibility insights.
 * - `Violation`: The type representing a single accessibility violation from axe-core.
 * - `GetAccessibilityInsightsOutput`: The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {JSDOM} from 'jsdom';
import axe from 'axe-core';

// This is a subset of the axe-core result format.
// For the full format, see https://github.com/dequelabs/axe-core/blob/develop/doc/results.md
const NodeSchema = z.object({
  html: z.string(),
  target: z.array(z.string()),
});

const ViolationSchema = z.object({
  id: z.string(),
  impact: z.enum(['minor', 'moderate', 'serious', 'critical']).nullable(),
  description: z.string(),
  help: z.string(),
  helpUrl: z.string(),
  tags: z.array(z.string()),
  nodes: z.array(NodeSchema),
});
export type Violation = z.infer<typeof ViolationSchema>;

const GetAccessibilityInsightsOutputSchema = z.object({
  violations: z.array(ViolationSchema).optional(),
  error: z.string().optional(),
});

export type GetAccessibilityInsightsOutput = z.infer<typeof GetAccessibilityInsightsOutputSchema>;

export const getAccessibilityInsightsFlow = ai.defineFlow(
  {
    name: 'getAccessibilityInsightsFlow',
    inputSchema: z.object({url: z.string()}),
    outputSchema: GetAccessibilityInsightsOutputSchema,
  },
  async ({url}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      if (!response.ok) {
        if (response.status === 403) {
            return {
                error: `This website is blocking automated scans. Try another URL or use a browser extension for analysis.`
            }
        }
        return {
          error: `Failed to fetch the URL. Status: ${response.status} ${response.statusText}`,
        };
      }
      const html = await response.text();
      const dom = new JSDOM(html, {url});

      // JSDOM doesn't implement layout, so some rules will be inaccurate.
      // We disable them here.
      const axeResults = await axe.run(dom.window.document.documentElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
        rules: {
          'color-contrast': { enabled: false },
          'link-in-text-block': { enabled: false },
          'scrollable-region-focusable': { enabled: false },
        },
        resultTypes: ['violations'],
      });

      // Convert violations to plain objects to ensure they are serializable
      // when passing from Server Components to Client Components.
       const serializableViolations = axeResults.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags,
        nodes: v.nodes.map(n => ({
          html: n.html,
          target: n.target,
        })),
      }));

      return { violations: serializableViolations };

    } catch (error: any) {
      console.error('Axe-core analysis failed:', error);
      return {
        error: `Failed to perform accessibility scan. ${error.message}`,
      };
    }
  }
);
