import React from 'react';
import Script from 'next/script';

const GoogleAnaliticHead = () => {
    return (
        <>
            {/* Google Tag Manager */}
            <Script
                id="google-tag-manager"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-WPZMQLP');
                        `,
                }}
            />
            {/* End Google Tag Manager */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-LPSP7553E9"
                strategy="beforeInteractive"
                async
            />
            <Script
                id="google-analytics"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-LPSP7553E9');
                        `,
                }}
            />
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=AW-463066611"
                strategy="beforeInteractive"
                async
            />
            <Script
                id="google-ads"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);console.log('gtag')}
                        gtag('js', new Date());
                        gtag('config', 'AW-463066611');
                    `,
                }}
            />
        </>
    );
};

export default GoogleAnaliticHead;