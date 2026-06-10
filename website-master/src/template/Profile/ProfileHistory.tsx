'use client'
import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Loader from '@/components/Loader'
import { IOrder } from '@/models/IOrder'
import authService from '@/services/authService'
import { formatNumber, getNoPhotoLangs } from '@/utils/function'
import Image from 'next/image'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const ProfileHistory = ({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(true)
    const [activeFilter, setActiveFilter] = useState('Pending')
    const [orders, setOrders] = useState<IOrder[]>([])
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await authService.fetchUserOrders(
                    locale,
                    activeFilter
                )
                setOrders(response.data.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [locale, activeFilter])

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            setIsOpen(true)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div className="section-personal-area__order-history">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <span className="title-section">
                        {translations[locale].profile.historyBox.title}
                    </span>
                    <div className="top">
                        <div className="input-text"></div>
                        <div className="sorty">
                            <span>
                                {translations[locale].catalog.sort.sort_active}:
                            </span>
                            <div className="input-list-drop" ref={modalRef}>
                                <span
                                    className={`title ${!isOpen ? 'active' : ''}`}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <span>
                                        {activeFilter === 'InProgress'
                                            ? translations[locale].profile
                                                .historyBox.inProgress
                                            : activeFilter === 'Shipped'
                                                ? translations[locale].profile
                                                    .historyBox.shipped
                                                : activeFilter === 'Received'
                                                    ? translations[locale].profile
                                                        .historyBox.received
                                                    : activeFilter === 'Return'
                                                        ? translations[locale].profile
                                                            .historyBox.return
                                                        : activeFilter === 'Cancelled'
                                                            ? translations[locale].profile
                                                                .historyBox.cancelled
                                                            : ''}
                                    </span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4 7L10 13L16 7"
                                            stroke="#111111"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </span>
                                <div
                                    className="list"
                                    style={!isOpen ? {} : { display: 'none' }}
                                >
                                    <label
                                        onClick={() =>
                                            setActiveFilter('InProgress')
                                        }
                                    >
                                        {
                                            translations[locale].profile
                                                .historyBox.inProgress
                                        }
                                    </label>
                                    <label
                                        onClick={() =>
                                            setActiveFilter('Shipped')
                                        }
                                    >
                                        {
                                            translations[locale].profile
                                                .historyBox.shipped
                                        }
                                    </label>
                                    <label
                                        onClick={() =>
                                            setActiveFilter('Received')
                                        }
                                    >
                                        {
                                            translations[locale].profile
                                                .historyBox.received
                                        }
                                    </label>
                                    <label
                                        onClick={() =>
                                            setActiveFilter('Return')
                                        }
                                    >
                                        {
                                            translations[locale].profile
                                                .historyBox.return
                                        }
                                    </label>
                                    <label
                                        onClick={() =>
                                            setActiveFilter('Cancelled')
                                        }
                                    >
                                        {
                                            translations[locale].profile
                                                .historyBox.cancelled
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-list">
                        {orders.length ? (
                            orders.map((order) => (
                                <OrderItem
                                    locale={locale}
                                    key={order.id}
                                    {...order}
                                />
                            ))
                        ) : (
                            <div className="title-section empty-title">
                                {translations[locale].profile.historyBox.empty}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

interface IOrderProps extends IOrder {
    locale: AllowedLangs
}

const OrderItem = (order: IOrderProps) => {
    const { translations } = useLang()
    const locale = order.locale
    const [isOpen, setOpen] = useState<boolean>(true)
    const date = new Date(order.created_at)
    const deliverDate = new Date(date)
    deliverDate.setDate(date.getDate() + 3)
    return (
        <div
            className={`order-item ${order.status === 'Received'
                ? 'execute'
                : order.status === 'Cancelled' || order.status === 'Return'
                    ? 'close'
                    : 'accepted'
                } ${!isOpen ? 'active' : ''}`}
        >
            <div className="title" onClick={() => setOpen(!isOpen)}>
                <div className="left">
                    <div className="date">
                        <span>{format(date, 'dd/MM/yyyy')}</span>
                        <span>{format(date, 'HH:mm')}</span>
                    </div>
                    <div className="name">
                        {translations[locale].profile.historyBox.order} №
                        {order.id}
                    </div>
                    <span className="status">
                        {order.status === 'InProgress'
                            ? translations[locale].profile
                                .historyBox.inProgress
                            : order.status === 'Shipped'
                                ? translations[locale].profile
                                    .historyBox.shipped
                                : order.status === 'Received'
                                    ? translations[locale].profile
                                        .historyBox.received
                                    : order.status === 'Return'
                                        ? translations[locale].profile
                                            .historyBox.return
                                        : order.status === 'Cancelled'
                                            ? translations[locale].profile
                                                .historyBox.cancelled
                                            : ''}
                    </span>
                </div>
                <div className="right">
                    <div className="product-preview">
                        {order.order_items.length > 3 ? (
                            <span>+{order.order_items.length - 3}</span>
                        ) : (
                            ''
                        )}
                        {order.order_items.map((item, index) => {
                            if (index > 2) {
                                return ''
                            }
                            return (
                                <Image
                                    key={item.id}
                                    src={
                                        item.variation_details.image
                                            ? API_URL_IMAGE +
                                            item.variation_details.image
                                            : getNoPhotoLangs(locale)
                                    }
                                    alt={item.product_name.title}
                                    width={40}
                                    height={48}
                                />
                            )
                        })}
                    </div>
                    <div className="all-cost">
                        <span>{translations[locale].basket.all}</span>
                        <span className="money">
                            {formatNumber(order.total_cost)}{' '}
                            {translations[locale].system.current}
                        </span>
                    </div>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 7L10 13L16 7"
                            stroke="#111111"
                            strokeWidth="1.5"
                        />
                    </svg>
                </div>
            </div>
            <div className="box" style={isOpen ? { display: 'none' } : {}}>
                <div className="box-left">
                    <div className="product-list">
                        {order.order_items.map((item, index) => {
                            if (index > 2) {
                                return ''
                            }
                            return (
                                <div
                                    key={item.id}
                                    className="product-list__item"
                                >
                                    <figure className="image">
                                        <Image
                                            key={item.id}
                                            src={
                                                item.variation_details.image
                                                    ? API_URL_IMAGE +
                                                    item.variation_details
                                                        .image
                                                    : getNoPhotoLangs(locale)
                                            }
                                            alt={item.product_name.title}
                                            width={120}
                                            height={90}
                                        />
                                    </figure>
                                    <div className="product-list__item--left">
                                        <div className="info">
                                            <span className="name">
                                                {item.product_name.title}
                                            </span>
                                            <div className="property">
                                                {item.variation_details.properties.map(
                                                    (prop) => (
                                                        <span
                                                            key={
                                                                prop.property.id
                                                            }
                                                        >
                                                            {prop.property.name}
                                                            :{' '}
                                                            <span>
                                                                {
                                                                    prop
                                                                        .values[0]
                                                                        .name
                                                                }
                                                            </span>
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="product-cost">
                                            <span>
                                                {item.quantity}{' '}
                                                {
                                                    translations[locale].profile
                                                        .historyBox.quantity
                                                }
                                            </span>
                                            <span>х</span>
                                            <span>
                                                {formatNumber(parseFloat(item.variation_details?.discounted_price) != 0 && parseFloat(item.variation_details?.discounted_price)
                                                    ? item.variation_details?.discounted_price
                                                    : item.variation_details?.price)}
                                                {' '}
                                                {
                                                    translations[locale].system
                                                        .current
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="product-list__cost">
                        <div className="product-list__cost--item">
                            <span>{translations[locale].basket.all}</span>
                            <span>
                                {formatNumber(order.total_cost ?? 0)}{' '}
                                {translations[locale].system.current}
                            </span>
                        </div>
                        {order.promo_code_id && order.discount ? (
                            <div className="product-list__cost--item">
                                <span>
                                    {translations[locale].order.other.promcod}
                                </span>
                                <span>
                                    - {formatNumber(order.discount)}{' '}
                                    {translations[locale].system.current}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                        <div className="product-list__cost--item">
                            <span>
                                {
                                    translations[locale].profile.historyBox
                                        .delivery
                                }
                            </span>
                            <span>
                                {formatNumber(order.delivery_cost ?? 0)}{' '}
                                {translations[locale].system.current}
                            </span>
                        </div>
                        <div className="product-list__cost--item">
                            <span className="all">
                                {
                                    translations[locale].profile.historyBox
                                        .all_cost
                                }
                            </span>
                            <span>
                                {formatNumber(
                                    (
                                        parseFloat(order.total_cost) -
                                        parseFloat(order.discount ?? 0) +
                                        parseFloat(order.delivery_cost ?? 0)
                                    ).toString()
                                )}{' '}
                                {translations[locale].system.current}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="box-right delivery">
                    <span>
                        {translations[locale].profile.historyBox.delivery_date}:{' '}
                        {format(deliverDate, 'dd/MM/yyyy')}
                    </span>
                    <span>
                        {translations[locale].profile.phone_short} {order.phone}
                    </span>
                    <span>
                        {order.delivery_method == 'Pickup'
                            ? order.department_postomat
                            : order.delivery_address}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProfileHistory
