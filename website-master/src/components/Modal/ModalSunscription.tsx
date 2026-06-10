import { AllowedLangs } from '@/constants/lang'
import orderService from '@/services/orderService'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import React from 'react'
import toast from 'react-hot-toast'
import { useLang } from '@/hooks/useLang'
import Input from '../Form/Input'
import subscriptionsService from '@/services/subscriptionsService'

interface IEmail {
    email: string
}

const ModalSunscription = React.memo(({
    locale,
    setIsOpenModalSunscription,
    isOpenModalSunscription,
}: {
    setIsOpenModalSunscription: any
    isOpenModalSunscription: boolean
    locale: AllowedLangs
}) => {
    const { translations } = useLang()

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
    })

    const createSubscriptions = async (values: IEmail, actions: any) => {
        const toast_id = toast.loading(translations[locale].info.ifEmail)
        try {
            await subscriptionsService.fetchCreateSubscriptions(values.email)
            toast.success(translations[locale].product.emptyProduct.info, {
                id: toast_id,
            })
        } catch (error: any) {
            console.error(error)
            if (error?.response?.status == 422) {
                toast.success(translations[locale].product.emptyProduct.info, {
                    id: toast_id,
                })
            } else {
                toast.error(
                    translations[locale].errors.error +
                    ' ' +
                    error?.response?.data.message,
                    {
                        id: toast_id,
                    }
                )
            }
        }
        actions.resetForm()
        setIsOpenModalSunscription(false)
    }

    return (
        <div
            className="modal-form-center"
            id="modal-empty-product"
            style={isOpenModalSunscription ? {} : { display: 'none' }}
        >
            <div
                className="body-bg"
                onClick={() => setIsOpenModalSunscription(false)}
            ></div>
            <div className="box max">
                <span
                    className="close"
                    onClick={() => setIsOpenModalSunscription(false)}
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
                    {translations[locale].product.emptyProduct.title}
                </span>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={createSubscriptions}
                >
                    {({ values, errors, touched, isSubmitting, resetForm }) => (
                        <Form className="form">
                            <Input
                                name="email"
                                label={translations[locale].form.email}
                                type="text"
                                value={values.email}
                            />
                            <div className="btn">
                                <button
                                    disabled={isSubmitting}
                                    className="btn-black"
                                >
                                    {
                                        translations[locale].product
                                            .emptyProduct.btn
                                    }
                                </button>
                                <span
                                    className="close btn-opacity"
                                    onClick={() => {
                                        resetForm()
                                        setIsOpenModalSunscription(false)
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

ModalSunscription.displayName = 'ModalSunscription';

export default ModalSunscription
