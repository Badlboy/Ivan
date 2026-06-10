import React, { useEffect, useRef, useState } from 'react'
import BasketItem from '../Basket/BasketItem'
import { useCartContext } from '@/contexts/CartContext'
import { IProdustBasket } from '@/models/IProduct'
import Link from 'next/link'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getLangSlug } from '@/utils/function'

const BasketModal = React.memo(({
    isClient,
    setIsOpen,
    isOpen,
    locale,
    modalBtnRef,
}: {
    modalBtnRef: React.RefObject<HTMLDivElement>
    isClient: boolean
    isOpen: boolean
    setIsOpen: any
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    const modalRef = useRef<HTMLDivElement>(null)
    const { getCountCart, getCartProduct } = useCartContext()
    const [basket, setBasket] = useState<IProdustBasket[]>([])

    const [cost, setCost] = useState<number>(0)
    const [sales, setSales] = useState<number>(0)

    useEffect(() => {
        async function fetchData() {
            const response = await getCartProduct()
            let all = 0
            let all_sal = 0
            response.map((item) => {
                if (item) {
                    all += parseFloat(item.variation.price) * item.quantity
                    all_sal +=
                        parseFloat(
                            parseFloat(item.variation.discounted_price) != 0 ? item.variation.discounted_price :
                                item.variation.price
                        ) * item.quantity
                }
            })
            setCost(all)
            setSales(all_sal)
            setBasket(response)
        }

        fetchData()
    }, [getCartProduct])

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node) &&
            modalBtnRef.current &&
            !modalBtnRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false)
        }
    }
    // const handleScroll = () => {
    //     setIsOpen(false)
    // }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        // window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            document.removeEventListener('click', handleClickOutside)
            // window.removeEventListener('scroll', handleScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={modalRef}
            id="modal-basket-user"
            style={isOpen ? {} : { display: 'none' }}
        >
            <span className="close" onClick={() => setIsOpen(false)}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 8L8 16"
                        stroke="#111111"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 8L16 16"
                        stroke="#111111"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <div className="basket-box">
                <div className="top">
                    <span className="title">
                        {translations[locale].basket.title}
                    </span>
                    {isClient ? (
                        <span className="count">
                            {translations[locale].basket.basketItem}:{' '}
                            {getCountCart}
                        </span>
                    ) : (
                        ''
                    )}
                </div>
                {basket.length ? (
                    <div className="basket-list">
                        {basket.map((item) => {
                            if (item) {
                                return (
                                    <BasketItem
                                        locale={locale}
                                        key={item.variation.id}
                                        {...item}
                                    />
                                )
                            }
                            return ''
                        })}
                    </div>
                ) : (
                    <span className="title-section text-h1 center empty-title">
                        {translations[locale].basket.empty}
                    </span>
                )}

                <div className="bottom">
                    <div className="price-box">
                        <div className="price-box__item">
                            <span>{translations[locale].basket.sum}</span>
                            <span>
                                {cost > sales ? (
                                    <span className="old">
                                        {cost}{' '}
                                        {translations[locale].system.current}
                                    </span>
                                ) : (
                                    ''
                                )}
                                {sales} {translations[locale].system.current}
                            </span>
                        </div>
                    </div>
                    <div className="price-basket-all">
                        <span>{translations[locale].basket.all}</span>
                        <span>
                            {sales} {translations[locale].system.current}
                        </span>
                    </div>
                    <div className="btn-box">
                        <span
                            className="btn-opacity"
                            onClick={() => setIsOpen(false)}
                        >
                            {translations[locale].basket.btn_all}
                        </span>
                        <Link
                            prefetch={false}
                            onClick={() => setIsOpen(false)}
                            href={getLangSlug(locale) + '/basket'}
                            className="btn-black"
                        >
                            {translations[locale].basket.placeOrder}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
})

BasketModal.displayName = 'BasketModal';

export default BasketModal
