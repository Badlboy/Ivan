'use client'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Input from '@/components/Form/Input'
import { useLang } from '@/hooks/useLang'
import { AllowedLangs } from '@/constants/lang'
import authService from '@/services/authService'
import { useState } from 'react'

const ForgotPasswordPage = ({ locale }: { locale: AllowedLangs }) => {
    const [send, setSend] = useState(false)
    const { translations } = useLang()

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
    })

    const initialValues = {
        email: '',
    }

    async function onSubmit(values: typeof initialValues) {
        const toast_id = toast.loading(translations[locale].info.load)

        try {
            await authService.userPasswordForgot(values.email, locale)
            toast.success(translations[locale].pages.password.send, {
                id: toast_id,
            })
            setSend(true)
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
        <section className="section-auth-register login">
            <figure>
                <Image
                    src="/image/auth-img.png"
                    alt={translations[locale].pages.auth.login}
                    width={0}
                    sizes="50vw"
                    height={0}
                />
            </figure>
            <div className="section-auth-register__box">
                <Formik
                    initialValues={initialValues}
                    validationSchema={SignupSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, isSubmitting }) => (
                        <Form className="form">
                            {!send ? (
                                <>
                                    <span className="form-title">
                                        {
                                            translations[locale].pages.auth
                                                .forgot_password
                                        }
                                    </span>
                                    <div className="input-list">
                                        <div className="input-text">
                                            <Input
                                                name="email"
                                                label={
                                                    translations[locale].form
                                                        .email
                                                }
                                                type="email"
                                                value={values.email}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-black"
                                        disabled={isSubmitting}
                                    >
                                        {translations[locale].pages.auth.send}
                                    </button>
                                </>
                            ) : (
                                <span className="form-title">
                                    {translations[locale].pages.password.send}
                                </span>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    )
}

export default ForgotPasswordPage
