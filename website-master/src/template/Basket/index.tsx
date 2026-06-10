'use client'
import React, { useEffect, useState } from 'react'
import { useCartContext } from '@/contexts/CartContext'
import { IProdustBasket } from '@/models/IProduct'
import BasketItem from '@/components/Header/Basket/BasketItem'
import Loader from '@/components/Loader'
import orderService from '@/services/orderService'
import { IPromocod } from '@/models/IPromocod'
import Link from 'next/link'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getLangSlug } from '@/utils/function'
import { IUser } from '@/models/IUser'
import { IContact } from '@/models/IPage'
import { EmptyBasket,NewCustumer,RegisteredCustomer } from './ui'
import { IUserBasket } from '@/models/IOrder'
import authService from '@/services/authService'

declare global {
    interface Window {
        gtag: any
    }
}

const Basket = ({
    locale,
    session,
    contact,
}: {
    locale: AllowedLangs
    session: IUser
    contact: IContact
}) => {
    const [isNewUser, setIsNewUser] = useState<boolean>(true)
    const [firstLoading, setFirstLoading] = useState<boolean>(true)
    const { translations } = useLang()
    const [basket, setBasket] = useState<IProdustBasket[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isCallPhone, setIsCallPhone] = useState<boolean>(false)
    const [isPolitic, setIsPolitic] = useState<boolean>(false)
    const [allCost, setAllCost] = useState<number>(0)
    const [sales, setSales] = useState<number>(0)
    const { getCartProduct } = useCartContext()
    const [cost, setCost] = useState<number>(0)
    const [initialUserBasket, setInitialUserBasket] = useState<IUserBasket>({
        first_name: session?.name ?? '',
        last_name: session?.last_name ?? '',
        phone: session?.phone ?? '',
        email: session?.email ?? '',
        delivery_method: 'Pickup',
        city: '',
        department_postomat: '',
        delivery_address: '',
    })

    // const [costDelivery, setCostDelivery] = useState<number>(80)

    const [strPromocod, setStrPromocod] = useState<string>('')
    const [promocod, setPromocod] = useState<IPromocod>({} as IPromocod)
    const [errorPromocod, setErrorPromocod] = useState<string>('')

    const [initialUserPayments, setInitialUserPayments] =
        useState<string>('Cash')

    const loadingHandler = (val: boolean) => {
        setLoading(val)
    }
    const newUserClick = (val:boolean) => {
        setIsNewUser(val)
    }
    async function fetchSeacrhPromocod(promocod: string) {
        setLoading(true)
        setErrorPromocod('')
        if (promocod) {
            try {
                const response =
                    await orderService.fetchSearchPromocod(promocod)
                setPromocod(response.data.data)
                setStrPromocod('')
            } catch (error) {
                console.error(error)
                setErrorPromocod(translations[locale].order.promcod_not)
            } finally {
                setLoading(false)
            }
            return
        }
        setErrorPromocod(translations[locale].order.promcod_input)
        setLoading(false)
        return
    }

    async function fetchData() {
        setLoading(true)
        try {
            const response = await getCartProduct()
            let all = 0
            let all_sal = 0
            response.map((item) => {
                all += parseFloat(item.variation.price) * item.quantity
                all_sal +=
                    parseFloat(
                        parseFloat(item.variation.discounted_price) != 0
                            ? item.variation.discounted_price
                            : item.variation.price
                    ) * item.quantity
            })
            setCost(all)
            setSales(all_sal)
            setBasket(response)
            setAllCost(all_sal)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            if (firstLoading) {
                setFirstLoading(false)
            }
        }
    }

    async function fetchAddressData() {
        try {
            const response = await authService.getUserAddressOne()
            const address = response.data.data
            setInitialUserBasket({
                delivery_method: address.delivery_method,
                city: address.city ?? '',
                department_postomat: address.department_postomat ?? '',
                delivery_address: address.delivery_address ?? '',
                first_name: address?.first_name ?? '',
                last_name: address?.last_name ?? '',
                phone: address?.phone ?? '',
                email: session?.email ?? '',
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCartProduct])

    useEffect(() => {
        if (session?.id) {
            fetchAddressData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(cost < 499) { 
            setInitialUserPayments('IBAN');
        }
    },[cost]);
    return (
        <article className="basket-article">
            {firstLoading ? (
                <Loader />
            ) : (
                <>
                    {basket.length ? (
                        <section
                            className={`section-order-product box-content${loading ? ' loading' : ''}`}
                        >
                            {loading ? <Loader /> : ''}
                            {isNewUser ? (
                                <NewCustumer
                                    isNewUser={isNewUser}
                                    loadingHandler={loadingHandler}
                                    locale={locale}
                                    session={session}
                                    basket={basket}
                                    initialUserBasket={initialUserBasket}
                                    isCallPhone={isCallPhone}
                                    initialUserPayments={initialUserPayments}
                                    newUserClick={newUserClick}
                                    setInitialUserBasket={setInitialUserBasket}
                                    setInitialUserPayments={setInitialUserPayments}
                                    promocod={promocod}
                                    cost={cost}
                                />
                            ) : (
                                <RegisteredCustomer
                                    isNewUser={isNewUser}
                                    locale={locale}
                                    onClick={newUserClick}
                                    session={session}
                                />
                            )}
                            <div className="section-order-product__right">
                                <div className="product-list box">
                                    <span className="title-section">
                                        {
                                            translations[locale].order.other
                                                .order_user_title
                                        }
                                    </span>
                                    {promocod.id ? (
                                        <span className="active-promocod">
                                            {
                                                translations[locale].order.other
                                                    .you_save
                                            }
                                            :{' '}
                                            {(allCost *
                                                promocod.discount_amount) /
                                                100}{' '}
                                            {
                                                translations[locale].system
                                                    .current
                                            }
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                    <div className="basket-list">
                                        {basket.map((item) => (
                                            <BasketItem
                                                locale={locale}
                                                key={item.variation.id}
                                                {...item}
                                            />
                                        ))}
                                    </div>
                                    <div className="all-price">
                                        <div className="dop">
                                            <div>
                                                <span>
                                                    {
                                                        translations[locale]
                                                            .basket.sum
                                                    }
                                                </span>
                                                <span>
                                                    {sales}{' '}
                                                    {
                                                        translations[locale]
                                                            .system.current
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                                    {
                                                        translations[locale]
                                                            .profile.historyBox
                                                            .delivery
                                                    }
                                                </span>
                                                <span>
                                                    {
                                                        translations[locale]
                                                            .system
                                                            .delivery_cost
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="all">
                                            <span>
                                                {
                                                    translations[locale].basket
                                                        .all
                                                }
                                            </span>
                                            <span>
                                                {sales}{' '}
                                                {
                                                    translations[locale].system
                                                        .current
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="promocod box">
                                    <span className="title-section">
                                        {
                                            translations[locale].order.other
                                                .promcod
                                        }
                                    </span>
                                    {promocod.id ? (
                                        <div className="promocod-using">
                                            <span>
                                                <span>
                                                    {
                                                        translations[locale]
                                                            .product.code
                                                    }
                                                </span>{' '}
                                                {promocod.code}
                                            </span>
                                            <div>
                                                <span>
                                                    -
                                                    {(allCost *
                                                        promocod.discount_amount) /
                                                        100}{' '}
                                                    {
                                                        translations[locale]
                                                            .system.current
                                                    }
                                                </span>
                                                <span
                                                    className="delete"
                                                    onClick={() =>
                                                        setPromocod(
                                                            {} as IPromocod
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7.5 11.25L7.5 9"
                                                            stroke="#111111"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        ></path>
                                                        <path
                                                            d="M10.5 11.25L10.5 9"
                                                            stroke="#111111"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        ></path>
                                                        <path
                                                            d="M2.25 5.25H15.75V5.25C15.5178 5.25 15.4017 5.25 15.304 5.25963C14.3544 5.35315 13.6032 6.10441 13.5096 7.05397C13.5 7.15175 13.5 7.26783 13.5 7.5V11C13.5 12.8856 13.5 13.8284 12.9142 14.4142C12.3284 15 11.3856 15 9.5 15H8.5C6.61438 15 5.67157 15 5.08579 14.4142C4.5 13.8284 4.5 12.8856 4.5 11V7.5C4.5 7.26783 4.5 7.15175 4.49037 7.05397C4.39685 6.10441 3.64559 5.35315 2.69603 5.25963C2.59825 5.25 2.48217 5.25 2.25 5.25V5.25Z"
                                                            stroke="#111111"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        ></path>
                                                        <path
                                                            d="M7.55111 2.52794C7.63657 2.44821 7.82489 2.37775 8.08686 2.32749C8.34882 2.27724 8.6698 2.25 9 2.25C9.3302 2.25 9.65118 2.27724 9.91314 2.32749C10.1751 2.37775 10.3634 2.44821 10.4489 2.52794"
                                                            stroke="#111111"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        ></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <form
                                            action=""
                                            className="promocod-form"
                                        >
                                            <div
                                                className={`input-text${strPromocod ? ' show' : ''}`}
                                            >
                                                <input
                                                    value={strPromocod}
                                                    onChange={(e) =>
                                                        setStrPromocod(
                                                            e.target.value
                                                        )
                                                    }
                                                    type="text"
                                                />
                                                <span>
                                                    {
                                                        translations[locale]
                                                            .product.code
                                                    }
                                                </span>
                                                {errorPromocod ? (
                                                    <span className="error">
                                                        {errorPromocod}
                                                    </span>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <span
                                                onClick={() =>
                                                    fetchSeacrhPromocod(
                                                        strPromocod
                                                    )
                                                }
                                                className="btn-black"
                                            >
                                                {
                                                    translations[locale].order
                                                        .other.promcod_send
                                                }
                                            </span>
                                        </form>
                                    )}
                                </div>
                                <div className="payments box">
                                    <span className="title-section">
                                        {
                                            translations[locale].profile
                                                .historyBox.all_cost
                                        }
                                    </span>
                                    <span className="price">
                                        {allCost -
                                            (promocod.discount_amount
                                                ? (allCost *
                                                      promocod.discount_amount) /
                                                  100
                                                : 0)}{' '}
                                        {translations[locale].system.current}
                                    </span>
                                </div>
                                <div className="checkbox">
                                    <div className="input-checkbox">
                                        <input
                                            type="checkbox"
                                            name="isCallPhone"
                                            checked={isCallPhone}
                                            onChange={() =>
                                                setIsCallPhone(!isCallPhone)
                                            }
                                            id="isCallPhone"
                                        />
                                        <label htmlFor="isCallPhone">
                                            {
                                                translations[locale].order.other
                                                    .phone_me
                                            }
                                        </label>
                                    </div>
                                    <div className="input-checkbox">
                                        <input
                                            type="checkbox"
                                            name="isPolitic"
                                            checked={isPolitic}
                                            onChange={() =>
                                                setIsPolitic(!isPolitic)
                                            }
                                            id="isPolitic"
                                        />
                                        <label htmlFor="isPolitic">
                                            <span>
                                                {
                                                    translations[locale].order
                                                        .other.politic_1
                                                }{' '}
                                                <Link
                                                    href={
                                                        getLangSlug(locale) +
                                                        '/privacy-policy'
                                                    }
                                                >
                                                    {
                                                        translations[locale]
                                                            .order.other
                                                            .politic_2
                                                    }
                                                </Link>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    form={isPolitic ? 'form1' : ''}
                                    className={
                                        'btn-black ' +
                                        (!isPolitic ? 'disable' : '')
                                    }
                                >
                                    {
                                        translations[locale].order.other
                                            .send_order
                                    }
                                </button>
                            </div>
                        </section>
                    ) : (
                        <EmptyBasket locale={locale} />
                    )}
                </>
            )}
        </article>
    )
}

export default Basket
