"use client"

import A11yChecker from '@/components/a11y-checker';
import AdBanner from '@/components/ad-banner';
import { Github } from 'lucide-react';

export default function Home() {
  const adPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ID;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-accent"
              aria-label="Acess11 Insights Logo"
            >
              <path d="M12 1.5a10.5 10.5 0 1 0 10.5 10.5A10.5 10.5 0 0 0 12 1.5" />
              <path d="M12 5.5a2 2 0 1 0 2 2 2 2 0 0 0-2-2" />
              <path d="M12 9.5a6 6 0 0 1 6 6" />
            </svg>
            <span className="text-lg font-bold">Acess11 Insights</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-8 px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Tool for Website Accessibility Checking</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Enter any URL to instantly scan for WCAG violations and get AI-powered suggestions to improve your website's accessibility.
            </p>
        </div>
        
        {adPublisherId && adSlotId && (
            <div className="container mx-auto max-w-4xl my-4">
                <AdBanner
                    data-ad-client={adPublisherId}
                    data-ad-slot={adSlotId}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        )}

        <A11yChecker />
      </main>
      <footer className="w-full border-t">
        <div className="container flex h-14 items-center justify-center">
            <p className="text-sm text-muted-foreground">
                For support, contact: <a href="mailto:muhirejonathan4@gmail.com" className="font-medium underline underline-offset-4">muhirejonathan4@gmail.com</a>
            </p>
        </div>
      </footer>
    </div>
  );
}
