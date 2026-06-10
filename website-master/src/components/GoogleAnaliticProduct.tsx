import React from 'react';
import Script from 'next/script';
import { IProdust, IVariation } from '@/models/IProduct';
import { findVariation } from '@/utils/function';

const GoogleAnaliticProduct = ({ variations, getVariation }: { variations: IVariation[]; getVariation: string }) => {

    const variation = findVariation(variations, getVariation);
    const price = parseFloat(variation?.discounted_price) !=
        0 && parseFloat(variation?.discounted_price)
        ? variation?.discounted_price
        : variation?.price;
    return (
        <Script
            id="google-ads-product"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                        gtag('event', 'page_view', {
                            'send_to': 'AW-463066611',
                            'value': '${price}',
                            'items': [{
                                'id': '${variation.id}',
                                'google_business_vertical': 'retail'
                            }]
                        });
                    `,
            }}
        />
    );
};

export default GoogleAnaliticProduct;