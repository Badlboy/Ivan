import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import React, { useContext, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IUserBasket } from '@/models/IOrder'
import { IUser } from '@/models/IUser'
import { LocalStorageLib } from '@/libs/localStorageLib'
import { UTM_MARKERS } from '@/constants/localStorageConstants'

import { UtmContext } from '@/contexts/UtmContext'
import { useCartContext } from '@/contexts/CartContext'
import { IProdustBasket } from '@/models/IProduct'
import orderService from '@/services/orderService'
import { getLangSlug } from '@/utils/function'
import Input from '@/components/Form/Input'
import NovaPoshtaSelector from '@/components/Form/NovaPoshtaSelector'
import BasketPayment from '@/components/Basket/BasketPayment'
import { useNewCustomerSchema } from '../../model'
import { IPromocod } from '@/models/IPromocod'

interface RegisteredCustomerProps {
    className?: string;
    locale: AllowedLangs;
    session: IUser;
    isNewUser: boolean;
    loadingHandler: (val: boolean) => void;
    basket: IProdustBasket[];
    initialUserBasket: IUserBasket;
    isCallPhone:boolean;
    initialUserPayments:string;
    newUserClick:(val:boolean) => void;
    setInitialUserBasket:React.Dispatch<React.SetStateAction<IUserBasket>>;
    setInitialUserPayments:React.Dispatch<React.SetStateAction<string>>;
    promocod:IPromocod;
    cost:number;
}

export const NewCustumer = (props: RegisteredCustomerProps) => {
    const {
        className,
        locale,
        isNewUser,
        session,
        loadingHandler,
        basket,
        initialUserBasket,
        isCallPhone,
        initialUserPayments,
        newUserClick,
        setInitialUserBasket,
        setInitialUserPayments,
        promocod,
        cost,
    } = props
    const router = useRouter()
    const { translations } = useLang()
    const utmContext = useContext(UtmContext)
    const newCustomerSchema = useNewCustomerSchema(locale);
    const { clearCart } = useCartContext()
    const [comment, setComment] = useState<string>('')

    const setLoading = (val: boolean) => {
        loadingHandler(val)
    }

    const createOrder = async (values: typeof initialUserBasket) => {
        const toast_id = toast.loading(translations[locale].order.create_load)
        try {
            setLoading(true)
            const items = basket.map((item) => {
                return {
                    product_id: item.id,
                    variation_id: item.variation.id,
                    quantity: item.quantity,
                }
            })
            const response = await orderService.fetchCreateOrder(
                values.first_name ?? '',
                values.last_name ?? '',
                values.phone ?? '',
                values.email ?? '',
                values?.delivery_method ?? '',
                values?.delivery_address ?? '',
                values?.city ?? '',
                values?.department_postomat ?? '',
                initialUserPayments ?? '',
                comment,
                promocod.id,
                items,
                isCallPhone,
                locale,
                utmContext?.utmSourse,
                utmContext?.utmCampaign,
                utmContext?.utmMedium
            )
            toast.success(translations[locale].order.create_success, {
                id: toast_id,
            })
            if (response.data?.order?.id) {
                if (response.data?.ecommerce_data) {
                    const ecommerceData = response.data?.ecommerce_data
                    if (window.gtag) {
                        window.gtag('event', 'purchase', {
                            transaction_id: ecommerceData.transaction_id,
                            affiliation: 'Google Merchandise Store',
                            value: ecommerceData.value,
                            currency: ecommerceData.currency,
                            coupon: ecommerceData.coupon,
                            items: ecommerceData.items.map((item) => ({
                                item_id: item.item_id,
                                item_name: item.item_name,
                                affiliation: item.affiliation,
                                quantity: item.quantity,
                                price: item.price,
                                item_brand: item.item_brand,
                                item_category: item.item_category,
                                item_variant: item.item_variant,
                                coupon: item.coupon,
                                discount: item.discount,
                            })),
                        })
                    }
                }
                LocalStorageLib.clearItem(UTM_MARKERS)
                router.push(
                    getLangSlug(locale) + '/basket/' + response.data?.order?.id
                )
                clearCart()
            }
        } catch (error: any) {
            if (error?.response.status == 422) {
                toast.error(translations[locale].order.error_fields, {
                    id: toast_id,
                })
            } else {
                toast.error(
                    translations[locale].errors.error +
                        ' ' +
                        error?.response.data.message,
                    {
                        id: toast_id,
                    }
                )
            }
            console.error(error)
        } finally {
            setLoading(false)

            setTimeout(() => {
                window.scroll({
                    top: 0,
                    behavior: 'smooth',
                })
            }, 100)
        }
    }

    return (
        <Formik
            initialValues={initialUserBasket}
            validationSchema={newCustomerSchema}
            onSubmit={createOrder}
            enableReinitialize={true}
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Form id="form1" className="section-order-product__left">
                    <div className="order-section">
                        <span className="order-section__title">
                            1. {translations[locale].order.basket.title_contact}
                        </span>
                        {!session?.id ? (
                            <div className="users-btn">
                                <span
                                    className={`btn-opacity ${isNewUser ? 'active' : ''}`}
                                    onClick={() => newUserClick(true)}
                                >
                                    {
                                        translations[locale].order.basket
                                            .new_buyer
                                    }
                                </span>
                                <span
                                    className={`btn-opacity ${!isNewUser ? 'active' : ''}`}
                                    onClick={() => newUserClick(false)}
                                >
                                    {
                                        translations[locale].order.basket
                                            .btn_register
                                    }
                                </span>
                            </div>
                        ) : (
                            ''
                        )}

                        <div className="form-box">
                            <div className="form-user">
                                <Input
                                    name="first_name"
                                    label={translations[locale].form.name}
                                    type="text"
                                    value={values.first_name}
                                />
                                <Input
                                    name="last_name"
                                    label={translations[locale].form.last_name}
                                    type="text"
                                    value={values.last_name}
                                />
                                <Input
                                    name="phone"
                                    label={translations[locale].form.phone}
                                    type="text"
                                    value={values.phone}
                                    mask="+380999999999"
                                />
                                <Input
                                    name="email"
                                    label={translations[locale].form.email}
                                    type="text"
                                    value={values.email}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="order-section">
                        <span className="order-section__title">
                            2. {translations[locale].order.basket.deliver.title}
                        </span>
                        <div className="form-box">
                            <div className="deliver-section">
                                <div
                                    className={`deliver-section-item ${values.delivery_method === 'Pickup' ? 'active' : ''}`}
                                >
                                    <div className="top">
                                        <div className="input-checkbox">
                                            <Field
                                                type="radio"
                                                name="delivery_method"
                                                checked={
                                                    values.delivery_method ===
                                                    'Pickup'
                                                }
                                                value="Pickup"
                                                id="delivery_method_1"
                                            />
                                            <label htmlFor="delivery_method_1">
                                                {
                                                    translations[locale].order
                                                        .delivery_method_pickup
                                                }
                                            </label>
                                        </div>
                                        <span>
                                            {
                                                translations[locale].order
                                                    .basket.deliver.tarif
                                            }
                                        </span>
                                    </div>
                                    <div
                                        className="list-value"
                                        style={
                                            values.delivery_method === 'Pickup'
                                                ? {}
                                                : {
                                                      display: 'none',
                                                  }
                                        }
                                    >
                                        <NovaPoshtaSelector
                                            values={values}
                                            locale={locale}
                                            selectedBranch={
                                                initialUserBasket.department_postomat
                                            }
                                            valueCity={initialUserBasket.city}
                                            setInitialUserBasket={
                                                setInitialUserBasket
                                            }
                                        />
                                    </div>
                                    <ErrorMessage name={'department_postomat'}>
                                        {(error) => (
                                            <span className="error-novaposhta">
                                                {error}
                                            </span>
                                        )}
                                    </ErrorMessage>
                                </div>
                                <div
                                    className={`deliver-section-item ${values.delivery_method === 'Courier' ? 'active' : ''}`}
                                >
                                    <div className="top">
                                        <div className="input-checkbox">
                                            <Field
                                                type="radio"
                                                name="delivery_method"
                                                value="Courier"
                                                checked={
                                                    values.delivery_method ===
                                                    'Courier'
                                                }
                                                id="delivery_method_2"
                                            />
                                            <label htmlFor="delivery_method_2">
                                                {
                                                    translations[locale].order
                                                        .delivery_method_courier
                                                }
                                            </label>
                                        </div>
                                        <span>
                                            {
                                                translations[locale].order
                                                    .basket.deliver.tarif
                                            }
                                        </span>
                                    </div>
                                    <div
                                        className="list-value"
                                        style={
                                            values.delivery_method === 'Courier'
                                                ? {}
                                                : {
                                                      display: 'none',
                                                  }
                                        }
                                    >
                                        <Input
                                            name="delivery_address"
                                            label={
                                                translations[locale].profile
                                                    .delivery_address
                                            }
                                            type="text"
                                            value={values.delivery_address}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ErrorMessage name={'delivery_method'}>
                            {(error) => <span className="error">{error}</span>}
                        </ErrorMessage>
                    </div>
                    <BasketPayment
                        locale={locale}
                        initialUserPayments={initialUserPayments}
                        setInitialUserPayments={setInitialUserPayments}
                        cost={cost}
                    />
                    <div className="input-textarea">
                        <span className="order-section__title">
                            {translations[locale].order.other.comment_title}
                        </span>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={
                                translations[locale].order.other
                                    .comment_placeholder
                            }
                        ></textarea>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
