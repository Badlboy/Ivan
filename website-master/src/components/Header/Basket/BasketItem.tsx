'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IProdustBasket } from '@/models/IProduct'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { getNoPhotoLangs } from '@/utils/function'
import { useCartContext } from '@/contexts/CartContext'
import { AllowedLangs } from '@/constants/lang'

interface IProdustBasketThis extends IProdustBasket {
    locale: AllowedLangs
}

const BasketItem = ({ variation, title, id, quantity, locale }: IProdustBasketThis) => {
    const { updateQuantity, removeFromCart } = useCartContext()
    const [buyCount, setBuyCount] = useState<number>(quantity)

    useEffect(() => {
        setBuyCount(quantity)
    }, [quantity])

    if (!variation) return null

    const discountedPrice = parseFloat(variation.discounted_price) || 0
    const price = parseFloat(variation.price)
    const itemTotalPrice = (buyCount * (discountedPrice || price)).toFixed(2)
    const originalPrice = discountedPrice !== 0 ? (price * buyCount).toFixed(2) : null

    const handleQuantityChange = (increment: number) => {
        const newCount = buyCount + increment
        if (newCount > 0 && newCount <= variation.quantity) {
            updateQuantity(id, variation.id, newCount)
        }
    }

    return (
        <div className="basket-item">
            <figure>
                <Image
                    src={variation.image && variation.image != 'null' ? API_URL_IMAGE + variation.image : getNoPhotoLangs(locale)}
                    alt={title}
                    width={322}
                    height={382}
                />
            </figure>
            <div className="detail">
                <span className="title">{title}</span>
                <div className="info">
                    <div className="properties">
                        {variation.properties?.map(prop => (
                            <span key={prop.property.id}>{prop.property.name}: <span>{prop.values[0].name}</span></span>
                        ))}
                    </div>
                    <span className="price">
                        {originalPrice && <span className="old">{originalPrice} грн</span>}
                        {itemTotalPrice} грн
                    </span>
                </div>
                <div className="controll">
                    <div className="count">
                        <span onClick={() => handleQuantityChange(-1)}>-</span>
                        <span>{buyCount}</span>
                        <span onClick={() => handleQuantityChange(1)}>+</span>
                    </div>
                    <span className="delete" onClick={() => removeFromCart(id, variation.id)}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 11.25L7.5 9" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M10.5 11.25L10.5 9" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M2.25 5.25H15.75V5.25C15.5178 5.25 15.4017 5.25 15.304 5.25963C14.3544 5.35315 13.6032 6.10441 13.5096 7.05397C13.5 7.15175 13.5 7.26783 13.5 7.5V11C13.5 12.8856 13.5 13.8284 12.9142 14.4142C12.3284 15 11.3856 15 9.5 15H8.5C6.61438 15 5.67157 15 5.08579 14.4142C4.5 13.8284 4.5 12.8856 4.5 11V7.5C4.5 7.26783 4.5 7.15175 4.49037 7.05397C4.39685 6.10441 3.64559 5.35315 2.69603 5.25963C2.59825 5.25 2.48217 5.25 2.25 5.25V5.25Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M7.55111 2.52794C7.63657 2.44821 7.82489 2.37775 8.08686 2.32749C8.34882 2.27724 8.6698 2.25 9 2.25C9.3302 2.25 9.65118 2.27724 9.91314 2.32749C10.1751 2.37775 10.3634 2.44821 10.4489 2.52794" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BasketItem
