'use client';

import { AllowedLangs } from '@/constants/lang';
import useCart from '@/hooks/useCart';
import React, { createContext, useContext, ReactNode, useMemo } from 'react';

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
    locale: AllowedLangs;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, locale }) => {
    const cart = useCart(locale);

    // Меморизация контекста
    const value = useMemo(() => cart, [cart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};
