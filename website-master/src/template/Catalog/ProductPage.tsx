'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import ModalBuyOneClick from '@/components/Modal/ModalBuyOneClick'
import ModalReview from '@/components/Modal/ModalReview'
import ModalSize from '@/components/Modal/ModalSize'
import SectionSeoText from '@/components/Section/SectionSeoText'
import { IProdust, IVariation } from '@/models/IProduct'
import ProductSliderImage from './ProductSliderImage'
import {
    calculatePercentageChange,
    findVariation,
    getLangSlug,
} from '@/utils/function'
import { useCartContext } from '@/contexts/CartContext'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation';
import StarBox from '@/components/Catalog/StarBox'
import ModalSunscription from '@/components/Modal/ModalSunscription'
import Link from 'next/link'
import ProductsSlider from '@/components/Main/Sliders/ProductsSlider'
import toast from 'react-hot-toast'
import authService from '@/services/authService'
import { useSession } from 'next-auth/react'
import productsService from '@/services/productService'
import DOMPurify from 'dompurify'
import Loader from '@/components/Loader'

interface PropertyValue {
    dop: any
    id: number;
    name: string;
    quantity?: number
}

interface SelectedProperties {
    [propertyId: number]: number | null; // propertyId -> valueId
}

const ProductPage = ({
    productData,
    locale,
    favorites,
    products_like,
    getVariation
}: {
    favorites: number[]
    productData: IProdust
    locale: AllowedLangs
    products_like: IProdust[]
    getVariation: string
}) => {
    const modalReviewBtnRef = useRef<HTMLDivElement>(null)
    const modalSizeBtnRef = useRef<HTMLDivElement>(null)
    const [isLoadingVariation, setIsLoadingVariation] = useState<boolean>(false)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
   
    const [transition, startTransition] = useTransition()
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const { translations } = useLang()
    const [favorite, setFavorite] = useState<boolean>(
        favorites?.includes(productData.id)
    )
    const { addToCart } = useCartContext()
    const [isOpenModalSunscription, setIsOpenModalSunscription] =
        useState<boolean>(false)
    const [isOpenModalSize, setIsOpenModalSize] = useState<boolean>(false)
    const [isOpenModalReview, setIsOpenModalReview] = useState<boolean>(false)
    const [isOpenBuyOneClick, setIsOpenBuyOneClick] = useState<boolean>(false)
    const [tabActive, setTabActive] = useState<number>(
        productData.description ? 1 : productData.properties.length > 0 ? 2 : 3
    )

    const [variation, setVariation] = useState(findVariation(productData?.variations, getVariation))
    const [buyCount, setBuyCount] = useState<number>(1)
    // Вариации ------------------
    const initializeSelectedProperties = (variation: IVariation) => {
        const initialSelected: SelectedProperties = {};
        variation?.properties.forEach((prop) => {
            initialSelected[prop.property.id] = prop.values[0].id;
        });
        return initialSelected;
    };
    const [selectedProperties, setSelectedProperties] = useState<SelectedProperties>(() => initializeSelectedProperties(variation));

    const allPropertyValues = useMemo(() => {
        const allValues: { [propertyId: number]: PropertyValue[] } = {};
        productData?.variations.forEach((variation) => {
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
    }, [productData?.variations]);
    console.log(productData);
    const activePropertyValues = useMemo(() => {
        const activeValues: { [propertyId: number]: number[] } = {};

        Object.keys(allPropertyValues).forEach((propertyId) => {
            activeValues[Number(propertyId)] = [];

            allPropertyValues[Number(propertyId)].forEach((value) => {
                const isActive = productData?.variations.some((variation) =>
                    variation.properties.every((prop) => {
                        const selectedValueId = selectedProperties[prop.property.id];
                        // Проверка для активного свойства
                        if (prop.property.id === Number(propertyId)) {
                            return prop.values.some((val) => val.id === value.id);
                        }

                        // Проверка для других свойств
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
    }, [selectedProperties, productData?.variations, allPropertyValues]);

    const handleSelectProperty = (propertyId: number, valueId: number) => {
        const updatedSelected = { ...selectedProperties, [propertyId]: valueId };

        const matchingVariation = productData?.variations.find((variation) =>
            variation.properties.every((prop) => {
                const selectedValueId = updatedSelected[prop.property.id];
                return selectedValueId === null ||
                    prop.values.some((value) => value.id === selectedValueId);
            })
        );

        if (matchingVariation) {
            setSelectedProperties(updatedSelected);
            setVariation(matchingVariation);

            setIsLoadingVariation(true);
            startTransition(async () => {
                router.push(`${productData.slug}-var-${matchingVariation.code}`, { scroll: false });
                await delay(500);
                setIsLoadingVariation(false);
            });
        } else {
            const firstValidVariation = productData?.variations.find((variation) =>
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

                setIsLoadingVariation(true);
                startTransition(async () => {
                    router.push(`${productData.slug}-var-${firstValidVariation.code}`, { scroll: false });
                    await delay(500);
                    setIsLoadingVariation(false);
                });
            } else {
                const fallbackVariation = productData?.variations.find((variation) =>
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

                    setIsLoadingVariation(true);
                    startTransition(async () => {
                        router.push(`${productData.slug}-var-${fallbackVariation.code}`, { scroll: false });
                        await delay(500);
                        setIsLoadingVariation(false);
                    });
                }
            }
        }
    };
    // /Вариации

    const productSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: productData.title,
        image: productData.variations
            .map((variation) => variation?.image)
            .filter(Boolean),
        description: productData.description,
        sku: productData.variations[0]?.article_number || '',
        mpn: productData.variations[0]?.code || '',
        brand: {
            '@type': 'Brand',
            name: 'Название бренда',
        },
        review: {
            '@type': 'Review',
            reviewRating: {
                '@type': 'Rating',
                ratingValue: productData.average_rating,
                bestRating: '5',
            },
            author: {
                '@type': 'Organization',
                name: 'Footbalshop',
            },
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: productData.average_rating,
            reviewCount: productData.reviews?.length || 0,
        },
        offers: productData.variations?.map((variation) => ({
            '@type': 'Offer',
            url: `${getLangSlug(locale)}/${productData.category?.slug}/${productData.slug}?variation=${variation?.id}`,
            priceCurrency: 'UAH',
            price: variation?.discounted_price || variation?.price,
            itemCondition: 'https://schema.org/NewCondition',
            availability:
                variation?.quantity > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
            sku: variation?.article_number,
        })),
    }

    const handleFavorite = async () => {
        if (session?.user?.id) {
            try {
                if (favorite) {
                    const toast_id = toast.loading(
                        translations[locale].product.favorite.deleteLoad
                    )
                    const response = await authService.removeFavorite(
                        productData.id
                    )
                    if (response.data.data.id) {
                        await update({ ...session, user: response.data.data })
                        toast.success(
                            translations[locale].product.favorite.delete,
                            { id: toast_id }
                        )
                    } else {
                        toast.dismiss(toast_id)
                    }
                } else {
                    const toast_id = toast.loading(
                        translations[locale].product.favorite.addLoad
                    )
                    const response = await authService.addFavorite(
                        productData.id
                    )
                    if (response.data.data.id) {
                        await update({ ...session, user: response.data.data })
                        toast.success(
                            translations[locale].product.favorite.add,
                            { id: toast_id }
                        )
                    } else {
                        toast.dismiss(toast_id)
                    }
                }
                setFavorite(!favorite)
            } catch (error: any) {
                console.error(error?.response?.data?.message)
            }
        } else {
            router.push(getLangSlug(locale) + '/auth')
        }
    }

    let images: {
        id: number
        url: string
    }[] = productData?.picture ? productData?.picture : [];

    if (images.length === 0) {
        const foundImage = productData?.variations.find((item) => item.image);
        if (foundImage) {
            images = [{
                id: foundImage.id,
                url: foundImage.image
            }];
        }
    }
    // Size 
    const [size, setSize] = useState<{
        description: string
        category: string
        images: string[]
    }>({
        description: '',
        category: '',
        images: []
    })

    async function fetchData(locale: AllowedLangs) {
        try {
            const response = await productsService.fetchSizeTable(locale, productData.category.id)
            setSize({
                description: DOMPurify.sanitize(response.data.data.description),
                category: response.data.data.category,
                images: response.data.data.images,
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData(locale)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale])

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
            <article className="section-detail-product">
                {isLoadingVariation ? <Loader /> : ''}
                <section className="product-preview box-content">
                    <ProductSliderImage
                        title={productData.title}
                        locale={locale}
                        percent={
                            parseFloat(variation?.discounted_price) != 0
                                ? calculatePercentageChange(
                                    variation?.price,
                                    variation?.discounted_price
                                )
                                : undefined
                        }
                        is_new={productData.is_new}
                        is_top_sale={productData.is_top_sale}
                        images={images}
                    />
                    <div className="product-preview__right">
                        <div className="title-top">
                            <div className="box">
                                <div className="rating">
                                    <span>{productData.reviews.length}</span>
                                    <StarBox
                                        number={productData.average_rating}
                                    />
                                </div>

                                {variation?.article_number && (
                                    <div className="code">
                                        {translations[locale].product.article}:
                                        <span>{variation?.article_number}</span>
                                    </div>
                                )}
                            </div>
                            <div className="box">
                                {productData?.brand?.image ? (
                                    <Link href={getLangSlug(locale) + '/brands/' + productData.brand.slug}>
                                        <Image
                                            src={
                                                API_URL_IMAGE +
                                                productData?.brand?.image
                                            }
                                            title={productData?.brand?.name}
                                            alt={productData?.brand?.name + ' - #1'}
                                            width={40}
                                            height={30}
                                        />
                                    </Link>
                                ) : (
                                    ''
                                )}
                                {/* {variation?.code && (
                                    <div className="code">
                                        {translations[locale].product.code}:
                                        <span>
                                            {variation.code.length > 25
                                                ? `${variation.code.substring(0, 25)}...`
                                                : variation.code}
                                        </span>
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <h1>{variation.title}</h1>
                        <div className="price-box">
                            <div className="price">
                                {parseFloat(variation?.discounted_price) !=
                                    0 && (
                                        <span className="old">
                                            {variation?.price}{' '}
                                            {translations[locale].system.current}
                                        </span>
                                    )}
                                <span className="active">
                                    {parseFloat(variation?.discounted_price) !=
                                        0 && parseFloat(variation?.discounted_price)
                                        ? variation?.discounted_price
                                        : variation?.price}{' '}
                                    <span>
                                        {translations[locale].system.current}
                                    </span>
                                </span>
                            </div>
                            <div className="info-box">
                                {variation?.quantity == 0 ? (
                                    <span className="info active">
                                        {
                                            translations[locale].product
                                                .delivery
                                        }
                                    </span>
                                ) : (
                                    <span className="info active">
                                        {translations[locale].product.delivery_speed}
                                    </span>
                                )}
                                <span
                                    className="heart"
                                    onClick={handleFavorite}
                                >
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
                            </div>
                        </div>
                        {Object.entries(allPropertyValues).map(([propertyId, values], index) => {
                            const firstProp = index;
                            const titleProp = productData?.variations[0].properties.find((p) => p.property.id === Number(propertyId))?.property
                                .name;
                            return (
                                <div key={propertyId}>
                                    <div key={propertyId} className="properties-box">
                                        <span className="properties-box__title">
                                            {titleProp}
                                            {(titleProp == 'Розмір' || titleProp == 'Размер' || titleProp == 'Size') && size.category ? (
                                                <span
                                                    ref={modalSizeBtnRef}
                                                    className="modal-size-btn btn-modal-size"
                                                    onClick={() => setIsOpenModalSize(true)}
                                                >
                                                    <svg
                                                        width="20"
                                                        height="21"
                                                        viewBox="0 0 20 21"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g clipPath="url(#clip0_1144_20389)">
                                                            <path
                                                                d="M19.099 13.97L19.1284 7.3291C19.128 7.21943 19.1059 7.11092 19.0634 7.0098C19.0209 6.90869 18.9589 6.81695 18.8809 6.73984C18.7257 6.58591 18.5162 6.49914 18.2976 6.49825L1.59218 6.46879C1.37202 6.46944 1.16107 6.55719 1.0054 6.71286C0.849727 6.86853 0.761981 7.07948 0.761326 7.29964L0.761326 13.97C0.761773 14.0797 0.783865 14.1882 0.826335 14.2893C0.868803 14.3904 0.930815 14.4822 1.00881 14.5593C1.16405 14.7132 1.37356 14.8 1.59218 14.8009H4.92736L14.9329 14.8009L18.2681 14.8009C18.4883 14.8002 18.6992 14.7125 18.8549 14.5568C19.0106 14.4011 19.0983 14.1902 19.099 13.97ZM15.7638 13.5721L15.7638 12.2965C15.7631 12.0764 15.6754 11.8654 15.5197 11.7097C15.364 11.5541 15.1531 11.4663 14.9329 11.4657C14.8229 11.4652 14.7139 11.4866 14.6122 11.5284C14.5105 11.5703 14.418 11.632 14.3403 11.7097C14.2625 11.7875 14.2008 11.88 14.159 11.9817C14.1171 12.0834 14.0957 12.1924 14.0962 12.3024L14.0962 13.578L12.4286 13.5721L12.4286 10.6348C12.4124 10.4256 12.3178 10.2301 12.1638 10.0875C12.0098 9.94497 11.8076 9.86577 11.5977 9.86577C11.3879 9.86577 11.1857 9.94497 11.0317 10.0875C10.8776 10.2301 10.7831 10.4256 10.7669 10.6348L10.7669 13.5721H9.0934L9.09929 12.3024C9.09929 12.0805 9.01114 11.8677 8.85422 11.7108C8.6973 11.5538 8.48447 11.4657 8.26255 11.4657C8.04063 11.4657 7.82781 11.5538 7.67089 11.7108C7.51397 11.8677 7.42581 12.0805 7.42581 12.3024L7.4317 13.5721L5.76411 13.578L5.75821 10.6348C5.75756 10.4147 5.66981 10.2037 5.51414 10.048C5.35847 9.89238 5.14752 9.80463 4.92736 9.80397C4.70721 9.80463 4.49626 9.89237 4.34059 10.048C4.18491 10.2037 4.09717 10.4147 4.09651 10.6348L4.09651 13.5721L2.12044 13.578L2.11987 7.74306L17.9647 7.7427L17.9489 13.578L15.7638 13.5721Z"
                                                                fill="#111111"
                                                            ></path>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_1144_20389">
                                                                <rect
                                                                    width="20"
                                                                    height="20"
                                                                    fill="white"
                                                                    transform="translate(0 0.58844)"
                                                                ></rect>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <span>
                                                        {
                                                            translations[locale].product.size
                                                                .title
                                                        }
                                                    </span>
                                                </span>
                                            ) : ''}
                                        </span>
                                        {values[0].dop ? (
                                            <div className="properties-box__list color">
                                                {values.map((val, index) => {
                                                    const isActive = activePropertyValues[Number(propertyId)]?.includes(val.id);
                                                    const isSelected = selectedProperties[Number(propertyId)] === val.id;
                                                    const result: string[] = val.dop?.split(',') ?? ['']

                                                    return (
                                                        <span
                                                            key={val.id}
                                                            onClick={() => handleSelectProperty(Number(propertyId), val.id)}
                                                            className={`properties-box__item--color ${isActive ? (isSelected ? "active" : "") : (val.quantity && val.quantity > 0 ? '' : "disable")} ${result.length > 1 ? 'two' : ''}`}
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
                                        ) : (
                                            <div className="properties-box__list size">
                                                {values.map((val, index) => {
                                                    const isActive = activePropertyValues[Number(propertyId)]?.includes(val.id);
                                                    const isSelected = selectedProperties[Number(propertyId)] === val.id;
                                                    return (
                                                        <span
                                                            key={val.id}
                                                            onClick={() => handleSelectProperty(Number(propertyId), val.id)}
                                                            className={`properties-box__item--size ${val.quantity && val.quantity > 0 ? '' : "disable"} ${isActive && isSelected && "active"}`}
                                                        >
                                                            {val.name}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        {variation?.quantity != 0 ? (
                            <div className="product-preview__button">
                                <div className="top">
                                    {variation?.quantity ? (
                                        <QuantityBox
                                            buyCount={buyCount}
                                            setBuyCount={setBuyCount}
                                            maxCount={variation.quantity}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    <span
                                        onClick={() =>
                                            addToCart(
                                                productData.id,
                                                variation.id,
                                                buyCount
                                            )
                                        }
                                        className="btn-black basket"
                                    >
                                        {
                                            translations[locale].product
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
                                <span
                                    className="btn-opacity buy-one-click-js"
                                    onClick={() => setIsOpenBuyOneClick(true)}
                                >
                                    {translations[locale].product.buy_one_click}
                                </span>
                            </div>
                        ) : (
                            <div className="product-preview__button">
                                <span
                                    className="btn-opacity btn-empty-product"
                                    onClick={() =>
                                        setIsOpenModalSunscription(true)
                                    }
                                >
                                    {
                                        translations[locale].product
                                            .empty_variaiton
                                    }
                                </span>
                            </div>
                        )}

                        <div className="product-preview__info">
                            <Link
                                href={
                                    getLangSlug(locale) + '/exchange-and-return'
                                }
                            >
                                <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.668 5.58844L17.1983 6.11877L17.7286 5.58844L17.1983 5.05811L16.668 5.58844ZM3.41797 9.75511C3.41797 10.1693 3.75376 10.5051 4.16797 10.5051C4.58218 10.5051 4.91797 10.1693 4.91797 9.75511L3.41797 9.75511ZM13.865 9.4521L17.1983 6.11877L16.1376 5.05811L12.8043 8.39144L13.865 9.4521ZM17.1983 5.05811L13.865 1.72478L12.8043 2.78544L16.1376 6.11877L17.1983 5.05811ZM16.668 4.83844L8.16797 4.83844L8.16797 6.33844L16.668 6.33844V4.83844ZM3.41797 9.58844V9.75511L4.91797 9.75511V9.58844L3.41797 9.58844ZM8.16797 4.83844C5.54462 4.83844 3.41797 6.96509 3.41797 9.58844L4.91797 9.58844C4.91797 7.79352 6.37304 6.33844 8.16797 6.33844L8.16797 4.83844Z"
                                        fill="#111111"
                                    />
                                    <path
                                        d="M3.33203 15.5884L2.8017 15.0581L2.27137 15.5884L2.8017 16.1188L3.33203 15.5884ZM16.582 11.4218C16.582 11.0076 16.2462 10.6718 15.832 10.6718C15.4178 10.6718 15.082 11.0076 15.082 11.4218L16.582 11.4218ZM6.13504 11.7248L2.8017 15.0581L3.86236 16.1188L7.19569 12.7854L6.13504 11.7248ZM2.8017 16.1188L6.13503 19.4521L7.1957 18.3914L3.86236 15.0581L2.8017 16.1188ZM3.33203 16.3384L11.832 16.3384L11.832 14.8384L3.33203 14.8384L3.33203 16.3384ZM16.582 11.5884V11.4218L15.082 11.4218V11.5884L16.582 11.5884ZM11.832 16.3384C14.4554 16.3384 16.582 14.2118 16.582 11.5884L15.082 11.5884C15.082 13.3834 13.627 14.8384 11.832 14.8384L11.832 16.3384Z"
                                        fill="#111111"
                                    />
                                </svg>
                                {translations[locale].product.obmin}
                            </Link>
                            <Link
                                href={getLangSlug(locale) + '/delivery-payment'}
                            >
                                <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7.51682 14.6468C7.41955 15.3244 7.07927 15.9444 6.55846 16.3929C6.03766 16.8415 5.37132 17.0884 4.68182 17.0884C3.99232 17.0884 3.32597 16.8415 2.80517 16.3929C2.28437 15.9444 1.94408 15.3244 1.84682 14.6468H1V4.90062C1 4.68522 1.0862 4.47863 1.23964 4.32632C1.39308 4.17401 1.60119 4.08844 1.81818 4.08844H13.2727C13.4897 4.08844 13.6978 4.17401 13.8513 4.32632C14.0047 4.47863 14.0909 4.68522 14.0909 4.90062V6.52498H16.5455L19 9.81919V14.6468H17.335C17.2377 15.3244 16.8974 15.9444 16.3766 16.3929C15.8558 16.8415 15.1895 17.0884 14.5 17.0884C13.8105 17.0884 13.1442 16.8415 12.6234 16.3929C12.1026 15.9444 11.7623 15.3244 11.665 14.6468H7.51682ZM12.8636 5.3118H2.22727V12.6214C2.97832 11.8695 3.35686 11.6788 3.79553 11.5371C4.23419 11.3953 4.70088 11.3608 5.15585 11.4366C5.61083 11.5123 6.04063 11.6961 6.40868 11.9722C6.77673 12.2483 7.19389 12.7737 7.41761 13.4336L11.7577 13.4306C11.8762 12.942 12.2956 12.3023 12.8636 11.9018V5.3118ZM14.0909 11.3981H17.7727V10.3544L15.7207 7.74326H14.0909V11.3981ZM16.1311 14.2331C16.1311 15.1302 15.3985 15.8575 14.4948 15.8575C13.591 15.8575 12.8584 15.1302 12.8584 14.2331C12.8584 13.336 13.591 12.6087 14.4948 12.6087C15.3985 12.6087 16.1311 13.336 16.1311 14.2331ZM4.68129 15.8575C5.58502 15.8575 6.31765 15.1302 6.31765 14.2331C6.31765 13.336 5.58502 12.6087 4.68129 12.6087C3.77755 12.6087 3.04492 13.336 3.04492 14.2331C3.04492 15.1302 3.77755 15.8575 4.68129 15.8575Z"
                                        fill="#111111"
                                    />
                                </svg>
                                {translations[locale].product.method_delivery}
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="box-content product-detail__content">
                    <div className="product-detail__content--tabs">
                        {variation.description ? (
                            <span
                                onClick={() => setTabActive(1)}
                                className={tabActive == 1 ? 'active' : ''}
                            >
                                {translations[locale].product.description}
                            </span>
                        ) : (
                            ''
                        )}
                        {productData.properties?.length > 0 ? (
                            <span
                                onClick={() => setTabActive(2)}
                                className={tabActive == 2 ? 'active' : ''}
                            >
                                {translations[locale].product.characteristics}
                            </span>
                        ) : (
                            ''
                        )}
                        <span
                            onClick={() => setTabActive(3)}
                            className={tabActive == 3 ? 'active' : ''}
                        >
                            {translations[locale].product.reviews}
                        </span>
                    </div>
                    {variation.description ? (
                        <div
                            id="tabs_content"
                            className="product-detail__content--item content-text"
                            dangerouslySetInnerHTML={{
                                __html: variation.description,
                            }}
                            style={tabActive == 1 ? {} : { display: 'none' }}
                        ></div>
                    ) : (
                        ''
                    )}

                    {productData.properties?.length > 0 ? (
                        <div
                            id="characteristics_content"
                            className="product-detail__content--item content-characteristics"
                            style={tabActive == 2 ? {} : { display: 'none' }}
                        >
                            {productData.properties.map((prop) => (
                                <div
                                    key={prop.property.id}
                                    className="content-characteristics__item"
                                >
                                    <span>{prop.property.name}</span>
                                    <span>
                                        {prop.values.map((val, index) => {
                                            let str = val.name
                                            if (
                                                prop.values.length - 1 !=
                                                index
                                            ) {
                                                str += ', '
                                            }
                                            return str
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        ''
                    )}
                    <div
                        id="rating_content"
                        className="product-detail__content--item content-rating"
                        style={tabActive == 3 ? {} : { display: 'none' }}
                    >
                        <div className="top">
                            <div className="rating">
                                <span>{productData.reviews.length}</span>
                                <StarBox number={productData.average_rating} />
                                {productData.average_rating ? (
                                    <span className="rating-number">
                                        {productData.average_rating}/5
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>
                            <span
                                ref={modalReviewBtnRef}
                                className="btn-opacity btn-modal-review"
                                onClick={() => setIsOpenModalReview(true)}
                            >
                                {translations[locale].product.add_reviews}
                            </span>
                        </div>
                        <div className="rating-list">
                            {productData.reviews.length > 0
                                ? productData.reviews.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rating-item"
                                    >
                                        <div className="stars">
                                            <StarBox
                                                number={parseInt(item.rating)}
                                            />
                                        </div>
                                        <div className="info">
                                            <span>{item.created_at}</span>
                                        </div>
                                        <span className="text">
                                            {item.text}
                                        </span>
                                    </div>
                                ))
                                : translations[locale].product.reviews_empty}
                        </div>
                    </div>
                </section>
                <ModalBuyOneClick
                    isOpenBuyOneClick={isOpenBuyOneClick}
                    setIsOpenBuyOneClick={setIsOpenBuyOneClick}
                    locale={locale}
                    product={productData.id}
                    product_variation={variation?.id}
                />
                <ModalSize
                    modalSizeBtnRef={modalSizeBtnRef}
                    setIsOpenModalSize={setIsOpenModalSize}
                    isOpenModalSize={isOpenModalSize}
                    locale={locale}
                    size={size}
                    scrolled={scrolled}
                />
                <ModalReview
                    modalReviewBtnRef={modalReviewBtnRef}
                    isOpenModalReview={isOpenModalReview}
                    setIsOpenModalReview={setIsOpenModalReview}
                    locale={locale}
                    scrolled={scrolled}
                    product={productData.id}
                />
                <ModalSunscription
                    setIsOpenModalSunscription={setIsOpenModalSunscription}
                    isOpenModalSunscription={isOpenModalSunscription}
                    locale={locale}
                />
            </article>
            {products_like?.length > 0 ? (
                <article className="section-products-article no-margin">
                    <ProductsSlider
                        index={'product_detail'}
                        favorites={favorites}
                        locale={locale}
                        products={products_like}
                        title={translations[locale].product.title_like}
                        link={''}
                    />
                </article>
            ) : (
                ''
            )}
            <SectionSeoText locale={locale} text={productData.seo_text} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />
        </>
    )
}

export default ProductPage

const QuantityBox = ({
    buyCount,
    setBuyCount,
    maxCount,
}: {
    buyCount: number
    maxCount: number
    setBuyCount: any
}) => {
    return (
        <div className="count-input">
            <span
                className="minus"
                onClick={() =>
                    setBuyCount((count: number) => {
                        if (count > 1) {
                            return count - 1
                        }
                        return count
                    })
                }
            >
                -
            </span>
            <span>{buyCount}</span>
            <span
                className="plus"
                onClick={() =>
                    setBuyCount((count: number) => {
                        if (count < maxCount) {
                            return count + 1
                        }
                        return count
                    })
                }
            >
                +
            </span>
        </div>
    )
}
