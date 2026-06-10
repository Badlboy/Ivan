import { useState, useEffect, useCallback, useMemo } from 'react'
import productsService from '@/services/productService'
import toast from 'react-hot-toast'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from './useLang'

type CartItem = {
    product_id: number
    variationId: number
    quantity: number
}

const useCart = (locale: AllowedLangs) => {
    const { translations } = useLang()
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('basket')
            return savedCart ? JSON.parse(savedCart) : []
        }
        return []
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('basket', JSON.stringify(cartItems))
        }
    }, [cartItems])

    const fetchAvailableQuantity = useCallback(
        async (productId: number, variationId: number) => {
            try {
                const response = await productsService.fetchProductQuantity(
                    productId,
                    variationId
                )
                return response.data.data.quantity
            } catch (error) {
                console.error('Error fetching product quantity:', error)
                return 0
            }
        },
        []
    )

    const getCountCart = useMemo(
        () => cartItems.reduce((total, item) => total + item.quantity, 0),
        [cartItems]
    )

    const getCartProduct = async () => {
        if (!cartItems.length) return []
        try {
            const response = await productsService.fetchProductBasket(
                cartItems,
                locale
            )
            if (cartItems.length == Object.keys(response.data.data).length) {
                return response.data.data
            }
            setCartItems([])
            localStorage.removeItem('basket')
            return []
        } catch (error) {
            console.error('Error fetching cart products:', error)
            return []
        }
    }

    const findCartItemIndex = (productId: number, variationId: number) =>
        cartItems.findIndex(
            (item) =>
                item.product_id === productId &&
                item.variationId === variationId
        )

    const addToCart = async (
        productId: number,
        variationId: number,
        quantity: number
    ) => {
        const toastId = toast.loading(translations[locale].basket.load)
        const availableQuantity = await fetchAvailableQuantity(
            productId,
            variationId
        )
        const currentCartQuantity = cartItems.reduce(
            (total, item) =>
                item.product_id === productId &&
                item.variationId === variationId
                    ? total + item.quantity
                    : total,
            0
        )

        if (currentCartQuantity + quantity > availableQuantity) {
            toast.error(translations[locale].basket.insufficient_product, {
                id: toastId,
            })
            console.error('Quantity exceeds available stock')
            return
        }

        const itemIndex = findCartItemIndex(productId, variationId)
        const updatedItems =
            itemIndex > -1
                ? cartItems.map((item, index) =>
                      index === itemIndex
                          ? { ...item, quantity: item.quantity + quantity }
                          : item
                  )
                : [
                      ...cartItems,
                      { product_id: productId, variationId, quantity },
                  ]

        setCartItems(updatedItems)
        toast.success(translations[locale].basket.add, { id: toastId })
    }

    const removeFromCart = (productId: number, variationId: number) => {
        setCartItems((prevItems) =>
            prevItems.filter(
                (item) =>
                    item.product_id !== productId ||
                    item.variationId !== variationId
            )
        )
        toast.success(translations[locale].basket.delete)
    }

    const updateQuantity = async (
        productId: number,
        variationId: number,
        quantity: number
    ) => {
        const toastId = toast.loading(translations[locale].basket.editLoad)
        const availableQuantity = await fetchAvailableQuantity(
            productId,
            variationId
        )

        if (quantity > availableQuantity) {
            toast.error(translations[locale].basket.insufficient_product, {
                id: toastId,
            })
            console.error('Quantity exceeds available stock')
            return
        }

        setCartItems((prevItems) => {
            const itemIndex = findCartItemIndex(productId, variationId)
            if (itemIndex > -1) {
                const updatedItems = [...prevItems]
                updatedItems[itemIndex].quantity = quantity
                return updatedItems
            }
            return prevItems
        })
        toast.success(translations[locale].basket.edit, { id: toastId })
    }

    const clearCart = () => setCartItems([])

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCountCart,
        getCartProduct,
        clearCart,
    }
}

export default useCart
