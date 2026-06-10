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

const ForgotPasswordEditPage = ({
    locale,
    searchParams,
}: {
    locale: AllowedLangs
    searchParams: { token: string; email: string }
}) => {
    const [send, setSend] = useState(false)
    const { translations } = useLang()

    const SignupSchema = Yup.object().shape({
        token: Yup.string(),
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
        password: Yup.string()
            .required(translations[locale].errors.new_password)
            .min(6, translations[locale].errors.lenght_password),
        password_confirmation: Yup.string()
            .oneOf(
                [Yup.ref('password')],
                translations[locale].errors.not_match_password
            )
            .required(translations[locale].errors.confirmation_password),
    })

    const initialValues = {
        token: searchParams.token,
        email: searchParams.email,
        password: '',
        password_confirmation: '',
    }

    async function onSubmit(values: typeof initialValues) {
        const toast_id = toast.loading(translations[locale].info.load)

        try {
            await authService.userPasswordReset(
                values.token,
                values.email,
                values.password,
                values.password_confirmation,
                locale
            )
            toast.success(translations[locale].pages.password.info_short, {
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
                                            translations[locale].pages.password
                                                .title
                                        }
                                        : {searchParams.email}
                                    </span>
                                    <div className="input-list">
                                        <div className="input-text">
                                            <Input
                                                name="password"
                                                label={
                                                    translations[locale].form
                                                        .new_password
                                                }
                                                type="password"
                                                id="password"
                                                password={true}
                                                value={values.password}
                                            />
                                        </div>
                                        <div className="input-text">
                                            <Input
                                                name="password_confirmation"
                                                label={
                                                    translations[locale].form
                                                        .replay_password
                                                }
                                                type="password"
                                                password={true}
                                                value={
                                                    values.password_confirmation
                                                }
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-black"
                                        disabled={isSubmitting}
                                    >
                                        {translations[locale].form.save}
                                    </button>
                                </>
                            ) : (
                                <span className="form-title">
                                    {translations[locale].pages.password.info}
                                </span>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    )
}

export default ForgotPasswordEditPage
