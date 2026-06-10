'use client'
import React, { useEffect, useRef } from 'react'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import productsService from '@/services/productService'
import Input from '../Form/Input'

const ModalReview = ({
    locale,
    product,
    setIsOpenModalReview,
    isOpenModalReview,
    modalReviewBtnRef,
    scrolled
}: {
    setIsOpenModalReview: any
    isOpenModalReview: boolean
    locale: AllowedLangs
    product: number
    modalReviewBtnRef: React.RefObject<HTMLDivElement>
    scrolled: boolean
}) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node) &&
            modalReviewBtnRef.current &&
            !modalReviewBtnRef.current.contains(event.target as Node)
        ) {
            setIsOpenModalReview(false)
        }
    }
    const { translations } = useLang()
    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
        name: Yup.string()
            .min(1, translations[locale].errors.name)
            .required(translations[locale].errors.required),
        text: Yup.string().required(translations[locale].errors.required),
        rating: Yup.number()
            .required(translations[locale].errors.required)
            .min(1, translations[locale].product.reviewsForm.form.error.rating)
            .max(5, translations[locale].product.reviewsForm.form.error.rating)
            .integer(
                translations[locale].product.reviewsForm.form.error.rating
            ),
    })

    const initialValues = {
        email: '',
        name: '',
        text: '',
        rating: 0,
    }

    async function onSubmit(values: typeof initialValues, actions: any) {
        const toast_id = toast.loading(translations[locale].info.load)
        try {
            await productsService.fetchCreateReview(
                product,
                values.text,
                values.email,
                values.name,
                values.rating
            )
            toast.success(translations[locale].product.reviewsForm.form.info, {
                id: toast_id,
            })
            actions.resetForm()
            setIsOpenModalReview(false)
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

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={modalRef}
            className={scrolled ? ' scrolled' : ''}
            id="modal-review"
            style={isOpenModalReview ? {} : { display: 'none' }}
        >
            <div
                className="body-bg"
                onClick={() => setIsOpenModalReview(false)}
            ></div>
            <div className="box review">
                <span
                    className="close"
                    onClick={() => setIsOpenModalReview(false)}
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
                    {translations[locale].product.reviewsForm.title}
                </span>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={SignupSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, errors, touched, isSubmitting }) => (
                        <Form className="review">
                            <RatingInput
                                name="rating"
                                label={
                                    translations[locale].product.reviewsForm
                                        .rating
                                }
                            />
                            <Input
                                name="name"
                                label={translations[locale].form.name}
                                type="text"
                                value={values.name}
                            />
                            <Input
                                name="email"
                                label={translations[locale].form.email}
                                type="text"
                                value={values.email}
                            />
                            <div className="input-textarea">
                                <span>
                                    {
                                        translations[locale].product.reviewsForm
                                            .comment
                                    }
                                </span>
                                <Field
                                    as="textarea"
                                    name="text"
                                    value={values.text}
                                    placeholder={
                                        translations[locale].product.reviewsForm
                                            .placeholder
                                    }
                                />
                                <ErrorMessage name={'text'}>
                                    {(error) => (
                                        <span className="error">{error}</span>
                                    )}
                                </ErrorMessage>
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="btn-black"
                            >
                                {translations[locale].product.reviewsForm.btn}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default ModalReview

interface RatingInputProps {
    name: string
    label: string
}

const RatingInput: React.FC<RatingInputProps> = ({ name, label }) => {
    const { setFieldValue } = useFormikContext()

    return (
        <div className="start-input">
            <span>{label}</span>
            <div className="stars">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <React.Fragment key={rating}>
                        <Field
                            type="radio"
                            id={`star${rating}`}
                            name={name}
                            value={rating}
                            onChange={() => setFieldValue(name, rating)}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor={`star${rating}`}>
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                    stroke="#888888"
                                />
                            </svg>
                        </label>
                    </React.Fragment>
                ))}
            </div>
            <ErrorMessage name={name}>
                {(error) => <span className="error">{error}</span>}
            </ErrorMessage>
        </div>
    )
}
