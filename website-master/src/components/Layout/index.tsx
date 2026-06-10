'use client';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Header from '../Header';
import Footer from '../Footer';
import { IContact } from '@/models/IPage';
import { ICategoriesLittle } from '@/models/ICategories';
import { AllowedLangs } from '@/constants/lang';
import { useEffect, useState, useMemo } from 'react';
import { IBrand } from '@/models/IBrand';
import FixedSectionBtn from './FixedSectionBtn';
import React from 'react';

const authPaths = [
    '/auth',
    '/auth/register',
    '/auth/forgot-password',
    '/ru/auth/forgot-password',
    '/en/auth/forgot-password',
    '/ru/auth',
    '/ru/auth/register',
    '/en/auth',
    '/en/auth/register',
];

const Layout = React.memo(({
    children,
    session,
    contact,
    categories,
    locale,
    brands,
}: {
    children: React.ReactNode;
    session: any;
    contact: IContact;
    categories: ICategoriesLittle[];
    locale: AllowedLangs;
    brands: IBrand[];
}) => {
    const pathname = usePathname();

    // Мемоизация isAuthPage
    const isAuthPage = useMemo(() => authPaths.includes(pathname), [pathname]);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        <>
            <Header
                locale={locale}
                categories={categories}
                contact={contact}
                sessionUser={session}
                brands={brands}
                scrolled={scrolled}
            />
            <FixedSectionBtn contact={contact} />
            <main>{children}</main>
            {!isAuthPage && (
                <Footer
                    locale={locale}
                    categories={categories}
                    sessionUser={session}
                    contact={contact}
                />
            )}
            <NextTopLoader
                color={!scrolled ? "#f6f6f6" : "#111"}
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow={!scrolled ? "0 0 10px #f6f6f6,0 0 5px #f6f6f6" : "0 0 10px #111,0 0 5px #111"}
                zIndex={1600}
                showAtBottom={false}
            />
        </>
    );
});

Layout.displayName = 'Layout';

export default Layout;
