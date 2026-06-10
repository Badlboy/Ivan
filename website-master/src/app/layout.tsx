import '@/styles/fonts/fonts.css';
import '@/styles/globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Providers } from '@/components/Providers';
import type { Viewport } from 'next';
import React from 'react';

export const metadata = {
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "facebook-domain-verification": "47ctdro99c8zvwltgxxzhyt0bwksdq",
        "google-site-verification": "Q2GXVg9gp-98NEjPPFGFmBy6v2aXHtYKS7dafQ2AIZs",
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

// Обернуть Providers в React.memo
const MemoizedProviders = React.memo(Providers);

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return <MemoizedProviders>{children}</MemoizedProviders>;
}

export default RootLayout;
