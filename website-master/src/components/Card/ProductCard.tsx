'use client'
import { IProdust, IVariation, Property } from '@/models/IProduct'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import toast from 'react-hot-toast'
import authService from '@/services/authService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartContext } from '@/contexts/CartContext'
import { AllowedLangs } from '@/constants/lang'
import {
    calculatePercentageChange,
    generateQueryString,
    getLangSlug,
    getNoPhotoLangs,
} from '@/utils/function'
import { useLang } from '@/hooks/useLang'
import StarBox from '../Catalog/StarBox'
import ModalBuyOneClick from '../Modal/ModalBuyOneClick'
import ModalSunscription from '../Modal/ModalSunscription'

interface IProductCardProps extends IProdust {
    favorites: number[]
    locale: AllowedLangs
    fetchFavorites?: any
    hendleActiveProduct?: any
    setIsOpenModalSunscription?: any
}
interface PropertyValue {
    dop: any
    id: number;
    name: string;
    quantity?: number
}

interface SelectedProperties {
    [propertyId: number]: number | null;
}

const ProductCard = React.memo((product: IProductCardProps) => {
    const { translations } = useLang()
    const router = useRouter()
    const { addToCart } = useCartContext()
    const { data: session, status, update } = useSession()
    const [isOpenBuyOneClick, setIsOpenBuyOneClick] = useState<boolean>(false)
    const [isOpenModalSunscription, setIsOpenModalSunscription] =
        useState<boolean>(false)

    const [favorite, setFavorite] = useState<boolean>(
        product.favorites?.includes(product.id)
    )

    useEffect(() => {
        setFavorite(
            session?.user?.favorites?.includes(product.id) ??
            product.favorites?.includes(product.id)
        )
    }, [session?.user?.favorites, product.id, product.favorites])

    const handleFavorite = async () => {
        if (session?.user?.id) {
            try {
                if (favorite) {
                    const toast_id = toast.loading(
                        translations[product.locale].product.favorite.deleteLoad
                    )
                    const response = await authService.removeFavorite(
                        product.id
                    )
                    if (response.data.data.id) {
                        await update({ ...session, user: response.data.data })
                        toast.success(
                            translations[product.locale].product.favorite
                                .delete,
                            { id: toast_id }
                        )
                    } else {
                        toast.dismiss(toast_id)
                    }
                } else {
                    const toast_id = toast.loading(
                        translations[product.locale].product.favorite.addLoad
                    )
                    const response = await authService.addFavorite(product.id)
                    if (response.data.data.id) {
                        await update({ ...session, user: response.data.data })
                        toast.success(
                            translations[product.locale].product.favorite.add,
                            { id: toast_id }
                        )
                    } else {
                        toast.dismiss(toast_id)
                    }
                }
                setFavorite(!favorite)
                if (product.fetchFavorites) {
                    product.fetchFavorites()
                }
            } catch (error: any) {
                console.error(error?.response?.data?.message)
            }
        } else {
            router.push(getLangSlug(product.locale) + '/auth')
        }
    }

    const handleBasket = async () => {
        await addToCart(product.id, variation.id, 1)
    }
    //  -------------

    const [variation, setVariation] = useState(product.variations[0])
    const [percent, setPercent] = useState<number | undefined>(
        parseFloat(variation?.discounted_price) != 0
            ? calculatePercentageChange(
                variation?.price,
                variation?.discounted_price
            )
            : undefined
    )
    const [slugVar, setSlugVar] = useState<string>('-var-' + (variation?.code ?? ''))
    // Вариации ------------------
    const [selectedProperties, setSelectedProperties] = useState<SelectedProperties>({});

    useEffect(() => {
        if (product?.variations.length > 0) {
            selectFirstVariation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.variations]);

    const selectFirstVariation = () => {
        const firstVariation = variation;
        const initialSelected: SelectedProperties = {};
        firstVariation.properties.forEach((prop) => {
            initialSelected[prop.property.id] = prop.values[0].id;
        });
        setSelectedProperties(initialSelected);
    };

    const allPropertyValues = useMemo(() => {
        const allValues: { [propertyId: number]: PropertyValue[] } = {};
        product?.variations.forEach((variation) => {
            variation.properties.forEach((prop) => {
                if (!allValues[prop.property.id]) {
                    allValues[prop.property.id] = [];
                }
                prop.values.forEach((value) => {
                    if (!allValues[prop.property.id].some((v) => v.id === value.id)) {
                        allValues[prop.property.id].push({
                            ...value, // Добавляем все текущие поля value
                            quantity: variation.quantity // Добавляем поле quantity
                        });
                    }
                });
            });
        });
        return allValues;
    }, [product?.variations]);

    const activePropertyValues = useMemo(() => {
        const activeValues: { [propertyId: number]: number[] } = {};

        Object.keys(allPropertyValues).forEach((propertyId) => {
            activeValues[Number(propertyId)] = [];

            allPropertyValues[Number(propertyId)].forEach((value) => {
                const isActive = product?.variations.some((variation) =>
                    variation.properties.every((prop) => {
                        const selectedValueId = selectedProperties[prop.property.id];

                        if (prop.property.id === Number(propertyId)) {
                            return prop.values.some((val) => val.id === value.id);
                        }

                        return selectedValueId === null ||
                            prop.values.some((val) => val.id === selectedValueId);
                    })
                );

                if (isActive) {
                    activeValues[Number(propertyId)].push(value.id);
                }
            });
        });

        return activeValues;
    }, [selectedProperties, product?.variations, allPropertyValues]);

    const handleSelectProperty = (propertyId: number, valueId: number) => {
        const updatedSelected = { ...selectedProperties, [propertyId]: valueId };

        const matchingVariation = product?.variations.find((variation) =>
            variation.properties.every((prop) => {
                const selectedValueId = updatedSelected[prop.property.id];
                return selectedValueId === null ||
                    prop.values.some((value) => value.id === selectedValueId);
            })
        );

        if (matchingVariation) {
            setSelectedProperties(updatedSelected);
            setVariation(matchingVariation);
            setPercent((
                parseFloat(matchingVariation?.discounted_price) != 0
                    ? calculatePercentageChange(
                        matchingVariation?.price,
                        matchingVariation?.discounted_price
                    )
                    : undefined
            ))

            setSlugVar('-var-' + matchingVariation.code);
        } else {
            const firstValidVariation = product?.variations.find((variation) =>
                variation.properties.every((prop) => {
                    const selectedValueId = updatedSelected[prop.property.id];
                    return selectedValueId === null ||
                        prop.values.some((value) => value.id === selectedValueId);
                })
            );

            if (firstValidVariation) {
                const newSelected = { ...updatedSelected };

                firstValidVariation.properties.forEach((prop) => {
                    const selectedValueId = newSelected[prop.property.id];
                    if (selectedValueId === null || !prop.values.some((value) => value.id === selectedValueId)) {
                        newSelected[prop.property.id] = prop.values[0].id;
                    }
                });

                setSelectedProperties(newSelected);
                setVariation(firstValidVariation);
                setPercent((
                    parseFloat(firstValidVariation?.discounted_price) != 0
                        ? calculatePercentageChange(
                            firstValidVariation?.price,
                            firstValidVariation?.discounted_price
                        )
                        : undefined
                ))

                setSlugVar('-var-' + firstValidVariation.code);
            } else {
                const fallbackVariation = product?.variations.find((variation) =>
                    variation.properties.some((prop) =>
                        prop.property.id === propertyId &&
                        prop.values.some((value) => value.id === valueId))
                );

                if (fallbackVariation) {
                    const newSelected = { ...updatedSelected };

                    fallbackVariation.properties.forEach((prop) => {
                        const selectedValueId = newSelected[prop.property.id];
                        if (selectedValueId === null || !prop.values.some((value) => value.id === selectedValueId)) {
                            newSelected[prop.property.id] = prop.values[0].id;
                        }
                    });

                    setSelectedProperties(newSelected);
                    setVariation(fallbackVariation);
                    setPercent((
                        parseFloat(fallbackVariation?.discounted_price) != 0
                            ? calculatePercentageChange(
                                fallbackVariation?.price,
                                fallbackVariation?.discounted_price
                            )
                            : undefined
                    ))

                    setSlugVar('-var-' + fallbackVariation.code);
                }
            }
        }
    };
    // /Вариации
    return (
        <>
            <div className="product-card">
                <div className={`product-card--image ${!variation?.image ? '' : 'img'}`}>
                    <Link
                        href={`${getLangSlug(product.locale)}/shop/${product.category?.slug}/${product.slug}${slugVar}`}
                    >
                        <Image
                            src={
                                variation?.image
                                    ? API_URL_IMAGE + variation.image
                                    : getNoPhotoLangs(product.locale)
                            }
                            title={product.title}
                            alt={product.title + ' - #1'}
                            loading="lazy"
                            width={322}
                            height={382}
                        />
                    </Link>
                    <div className="rating">
                        {product.reviews.length ? product.reviews.length : 0}
                        <StarBox number={product.average_rating} />
                    </div>
                    <span className="heart" onClick={handleFavorite}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.70955 11.5902L9.50339 17.0329C9.73091 17.2466 9.84467 17.3535 9.98276 17.3601C9.99468 17.3606 10.0066 17.3606 10.0185 17.3601C10.1566 17.3535 10.2704 17.2466 10.4979 17.0329L16.2918 11.5902C17.9219 10.0588 18.1199 7.53884 16.7488 5.77173L16.491 5.43946C14.8509 3.32549 11.5587 3.68002 10.4062 6.09472C10.2434 6.43581 9.75789 6.43581 9.5951 6.09472C8.44263 3.68002 5.15042 3.3255 3.51027 5.43946L3.25247 5.77173C1.88144 7.53884 2.0794 10.0588 3.70955 11.5902Z"
                                stroke="#111111"
                                fill={favorite ? '#111111' : ''}
                                strokeWidth="1.5"
                            />
                        </svg>
                    </span>
                    <div className="info-card">
                        {product.is_top_sale && (
                            <span>
                                {
                                    translations[product.locale].product
                                        .is_top_sale
                                }
                            </span>
                        )}
                        {product.is_new && (
                            <span>
                                {translations[product.locale].product.is_new}
                            </span>
                        )}
                        {percent && <span className="sales">- {Math.abs(percent)}%</span>}
                    </div>
                </div>
                <div className="product-card--info">
                    <div className="visible">
                        <Link
                            className="title"
                            href={`${getLangSlug(product.locale)}/shop/${product.category?.slug}/${product.slug}${slugVar}`}
                        >
                            {product.title.length > 35
                                ? `${product.title.slice(0, 35)}...`
                                : product.title}
                        </Link>
                        <div className="cost">
                            <span>
                                {parseFloat(variation?.discounted_price) != 0 && parseFloat(variation?.discounted_price)
                                    ? variation?.discounted_price
                                    : variation?.price}{' '}
                                <span>
                                    {
                                        translations[product.locale].system
                                            .current
                                    }
                                </span>
                            </span>
                            {parseFloat(variation?.discounted_price) != 0 && (
                                <span className="old">
                                    {variation?.price}{' '}
                                    {
                                        translations[product.locale].system
                                            .current
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="hidden">
                        <div className="order">
                            <span>
                                {variation?.quantity ? translations[product.locale].product.delivery_speed : translations[product.locale].product.delivery}
                            </span>
                            {Object.entries(allPropertyValues).map(([propertyId, values], index) => {
                                const firstProp = index;
                                if (Number(propertyId) != 2) {
                                    return;
                                }
                                if (values[0].dop) {
                                    return (
                                        <div key={propertyId} className="color">
                                            {values.map((val) => {
                                                const isActive = activePropertyValues[Number(propertyId)]?.includes(val.id);
                                                const isSelected = selectedProperties[Number(propertyId)] === val.id;
                                                const result: string[] = val.dop?.split(',') ?? ['']

                                                return (
                                                    <span
                                                        key={val.id}
                                                        onClick={() => handleSelectProperty(Number(propertyId), val.id)}
                                                        className={`properties-box__item--color ${val.quantity && val.quantity > 0 ? '' : "disable"} ${isActive && isSelected && "active"} ${result.length > 1 ? 'two' : ''}`}
                                                    >
                                                        {result.map((color, index) => (
                                                            <span
                                                                key={index}
                                                                style={{
                                                                    background: color,
                                                                }}
                                                            ></span>
                                                        ))}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={propertyId} className="size">
                                            {values.map((val) => {
                                                const isActive = activePropertyValues[Number(propertyId)]?.includes(val.id);
                                                const isSelected = selectedProperties[Number(propertyId)] === val.id;

                                                return (
                                                    <span
                                                        key={val.id}
                                                        onClick={() => handleSelectProperty(Number(propertyId), val.id)}
                                                        className={`${val.quantity && val.quantity > 0 ? '' : "disable"} ${isActive && isSelected && "active"}`}
                                                    >
                                                        {val.name}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        {variation?.quantity ? (
                            <div className="btn">
                                <span
                                    onClick={() => {
                                        if (product.hendleActiveProduct) {
                                            product.hendleActiveProduct(
                                                product.id,
                                                variation.id
                                            )
                                        } else {
                                            setIsOpenBuyOneClick(true)
                                        }
                                    }}
                                    className="btn-opacity"
                                >
                                    {
                                        translations[product.locale].product
                                            .buy_one_click
                                    }
                                </span>
                                <span
                                    className="btn-black basket"
                                    onClick={handleBasket}
                                >
                                    {
                                        translations[product.locale].product
                                            .add_basket
                                    }
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M16.1104 17.6056C16.5322 17.6056 16.8741 17.2636 16.8741 16.8419C16.8741 16.4201 16.5322 16.0781 16.1104 16.0781C15.6886 16.0781 15.3467 16.4201 15.3467 16.8419C15.3467 17.2636 15.6886 17.6056 16.1104 17.6056Z"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M7.70806 17.6056C8.12986 17.6056 8.47179 17.2636 8.47179 16.8419C8.47179 16.4201 8.12986 16.0781 7.70806 16.0781C7.28627 16.0781 6.94434 16.4201 6.94434 16.8419C6.94434 17.2636 7.28627 17.6056 7.70806 17.6056Z"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M1.59961 1.5625H4.65453L6.70132 11.7888C6.77116 12.1404 6.96244 12.4563 7.24169 12.6811C7.52094 12.9059 7.87036 13.0253 8.22878 13.0184H15.6522C16.0106 13.0253 16.3601 12.9059 16.6393 12.6811C16.9186 12.4563 17.1098 12.1404 17.1797 11.7888L18.4016 5.38114H5.41825"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <span
                                className="btn-opacity btn-empty-product"
                                onClick={() => {
                                    if (product.hendleActiveProduct) {
                                        product.setIsOpenModalSunscription(true)
                                    } else {
                                        setIsOpenModalSunscription(true)
                                    }
                                }}
                            >
                                {
                                    translations[product.locale].product
                                        .empty_variaiton
                                }
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {isOpenBuyOneClick && !product.hendleActiveProduct ? (
                <ModalBuyOneClick
                    setIsOpenBuyOneClick={setIsOpenBuyOneClick}
                    isOpenBuyOneClick={isOpenBuyOneClick}
                    locale={product.locale}
                    product={product.id}
                    product_variation={variation.id}
                />
            ) : (
                ''
            )}
            {isOpenModalSunscription && !product.hendleActiveProduct ? (
                <ModalSunscription
                    setIsOpenModalSunscription={setIsOpenModalSunscription}
                    isOpenModalSunscription={isOpenModalSunscription}
                    locale={product.locale}
                />
            ) : (
                ''
            )}
        </>
    )
})

ProductCard.displayName = 'ProductCard';

export default ProductCard
