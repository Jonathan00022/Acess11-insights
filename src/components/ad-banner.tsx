"use client";

import { useEffect } from 'react';

type AdBannerProps = {
    'data-ad-client': string;
    'data-ad-slot': string;
    'data-ad-format'?: string;
    'data-full-width-responsive'?: string;
    className?: string;
};

export default function AdBanner(props: AdBannerProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("Failed to push AdSense ad", err);
        }
    }, []);

    if (!props['data-ad-client'] || !props['data-ad-slot']) {
        return null;
    }

    return (
        <div className="ad-container text-center">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={props['data-ad-client']}
                data-ad-slot={props['data-ad-slot']}
                data-ad-format={props['data-ad-format'] || 'auto'}
                data-full-width-responsive={props['data-full-width-responsive'] || 'true'}
            />
        </div>
    );
}
