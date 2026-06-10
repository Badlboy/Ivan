import { AllowedLangs } from '@/constants/lang'
import orderService from '@/services/orderService'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { useLang } from '@/hooks/useLang'
import Input from '../Form/Input'
import { UtmContext } from '@/contexts/UtmContext'
import { LocalStorageLib } from '@/libs/localStorageLib'
import { UTM_MARKERS } from '@/constants/localStorageConstants'

declare global {
    interface Window {
        gtag: any
    }
}

const ModalBuyOneClick = React.memo(({
    locale,
    product,
    product_variation,
    setIsOpenBuyOneClick,
    isOpenBuyOneClick,
}: {
    setIsOpenBuyOneClick: any
    isOpenBuyOneClick: boolean
    locale: AllowedLangs
    product: number
    product_variation: number
}) => {
    const { translations } = useLang();
    const utmContext = useContext(UtmContext);
    const SignupSchema = Yup.object().shape({
        name: Yup.string()
            .min(1, translations[locale].errors.name)
            .required(translations[locale].errors.required),
        phone: Yup.string()
            .matches(/^\+380\d{9}$/, translations[locale].errors.phone)
            .required(translations[locale].errors.required),
    })

    const initialValues = {
        name: '',
        phone: '',
    }

    async function onSubmit(values: typeof initialValues, actions: any) {
        const toast_id = toast.loading(translations[locale].info.load)
        try {
            const response = await orderService.fetchCreateOrderOneClick(
                values.name,
                values.phone,
                product,
                product_variation,
                utmContext?.utmSourse,
                utmContext?.utmCampaign,
                utmContext?.utmMedium,
            )
            toast.success(translations[locale].product.oneClick.info, {
                id: toast_id,
            })
            actions.resetForm()
            if (response.data?.data?.id) {
                if (response.data?.ecommerce_data) {
                    const ecommerceData = response.data?.ecommerce_data;
                    if (window.gtag) {
                        window.gtag('event', 'purchase', {
                            transaction_id: ecommerceData.transaction_id,
                            affiliation: 'Google Merchandise Store',
                            value: ecommerceData.value,
                            currency: ecommerceData.currency,
                            coupon: ecommerceData.coupon,
                            items: ecommerceData.items.map(item => ({
                                item_id: item.item_id,
                                item_name: item.item_name,
                                affiliation: item.affiliation,
                                quantity: item.quantity,
                                price: item.price,
                                item_brand: item.item_brand,
                                item_category: item.item_category,
                                item_variant: item.item_variant,
                                coupon: item.coupon,
                                discount: item.discount
                            }))
                        });
                    }
                }
            }
            LocalStorageLib.clearItem(UTM_MARKERS);
            setIsOpenBuyOneClick(false)
        } catch (error: any) {
            toast.error(
                translations[locale].errors.error +
                ' ' +
                error?.response?.data?.message,
                {
                    id: toast_id,
                }
            )
        }
    }

    return (
        <div
            className="modal-form-center"
            id="modal-buy-one-click"
            style={isOpenBuyOneClick ? {} : { display: 'none' }}
        >
            <div
                className="body-bg"
                onClick={() => setIsOpenBuyOneClick(false)}
            ></div>
            <div className="box max">
                <span
                    className="close"
                    onClick={() => setIsOpenBuyOneClick(false)}
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20.1459 9.85291L10.293 19.7058"
                            stroke="#111111"
                            strokeWidth="1.47793"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10.2956 9.85291L20.1484 19.7058"
                            stroke="#111111"
                            strokeWidth="1.47793"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <span className="title">
                    {translations[locale].product.oneClick.title}
                </span>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={SignupSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, errors, touched, isSubmitting, resetForm }) => (
                        <Form className="form">
                            <Input
                                name="name"
                                label={translations[locale].form.name}
                                type="text"
                                value={values.name}
                            />
                            <Input
                                name="phone"
                                label={translations[locale].form.phone}
                                type="text"
                                value={values.phone}
                                mask="+380999999999"
                            />
                            <div className="btn">
                                <button
                                    disabled={isSubmitting}
                                    className="btn-black"
                                >
                                    {
                                        translations[locale].product.oneClick
                                            .title
                                    }
                                </button>
                                <span
                                    className="close btn-opacity"
                                    onClick={() => {
                                        resetForm()
                                        setIsOpenBuyOneClick(false)
                                    }}
                                >
                                    {
                                        translations[locale].product.oneClick
                                            .cancel
                                    }
                                </span>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
})

ModalBuyOneClick.displayName = 'ModalBuyOneClick';

export default ModalBuyOneClick
