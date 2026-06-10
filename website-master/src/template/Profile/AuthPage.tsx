'use client'
import { signIn } from 'next-auth/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { ProvidersEnum } from '@/config/auth'
import Input from '@/components/Form/Input'
import { useLang } from '@/hooks/useLang'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import Link from 'next/link'
import Checkbox from '@/components/Form/Checkbox'
import { useRouter } from 'next/navigation'

const AuthPage = ({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()
    const router = useRouter()

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
        password: Yup.string().required(translations[locale].errors.required),
        save: Yup.string(),
    })

    const initialValues = {
        email: '',
        password: '',
        save: '',
    }

    async function onSubmit(values: typeof initialValues) {
        const toast_id = toast.loading(translations[locale].info.load)
        const result = await signIn(ProvidersEnum.SingIn, {
            ...values,
            lang: locale,
            redirect: false,
        })
        console.log(result);
        if (result?.ok) {
            toast.dismiss(toast_id)
            router.push(getLangSlug(locale) + '/profile')
        } else {
            const errorMessage =
                result?.error || translations[locale].errors.error
            toast.error(errorMessage, { id: toast_id })
        }
    }
    return (
        <section className="section-auth-register login">
            <figure>
                <Image
                    src="/image/auth-img.png"
                    alt={translations[locale].pages.auth.login}
                    style={{objectFit: "contain"}}
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
                            <span className="form-title">
                                {translations[locale].pages.auth.login}
                            </span>
                            <div className="social">
                                <span>
                                    {translations[locale].page.basket.register}:
                                </span>
                                <div className="btn">
                                    <span
                                        className="btn-social"
                                        onClick={() => signIn('google')}
                                    >
                                        <svg
                                            width="20"
                                            height="18"
                                            viewBox="0 0 20 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M18.8494 9.1684C18.8494 8.43095 18.7891 7.8928 18.6587 7.33473H10.1758V10.6632H15.155C15.0547 11.4904 14.5126 12.7361 13.3079 13.5732L13.291 13.6846L15.9732 15.7473L16.159 15.7657C17.8656 14.201 18.8494 11.899 18.8494 9.1684Z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M10.1768 17.9382C12.6162 17.9382 14.6641 17.1409 16.16 15.7657L13.3089 13.5732C12.546 14.1014 11.522 14.4701 10.1768 14.4701C7.78754 14.4701 5.75969 12.9055 5.03682 10.743L4.93086 10.7519L2.14194 12.8945L2.10547 12.9952C3.59121 15.9251 6.64306 17.9382 10.1768 17.9382Z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.03569 10.743C4.84495 10.1849 4.73457 9.58692 4.73457 8.96908C4.73457 8.35117 4.84495 7.75325 5.02565 7.19519L5.0206 7.07633L2.19673 4.89929L2.10434 4.94292C1.49199 6.15874 1.14062 7.52406 1.14062 8.96908C1.14062 10.4141 1.49199 11.7793 2.10434 12.9952L5.03569 10.743Z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M10.1768 3.46802C11.8733 3.46802 13.0178 4.19551 13.6703 4.80346L16.2202 2.33196C14.6542 0.886946 12.6162 0 10.1768 0C6.64305 0 3.59121 2.01305 2.10547 4.94292L5.02678 7.19519C5.75969 5.03265 7.78754 3.46802 10.1768 3.46802Z"
                                                fill="#EB4335"
                                            />
                                        </svg>
                                        <span>Google</span>
                                    </span>
                                    <span
                                        className="btn-social"
                                        onClick={() => signIn('facebook')}
                                    >
                                        <svg
                                            width="19"
                                            height="18"
                                            viewBox="0 0 19 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.4588 4.29519C10.4588 4.4794 10.4588 5.07984 10.4588 5.93287H13.4133L13.0929 8.54733H10.4588C10.4588 12.5793 10.4588 17.9824 10.4588 17.9824H6.96247C6.96247 17.9824 6.96247 12.6508 6.96247 8.54733H5.14062V5.93287H6.96247C6.96247 4.89604 6.96247 4.15878 6.96247 3.9535C6.96247 2.97545 6.88824 2.51139 7.30687 1.75349C7.72572 0.995631 8.90716 -0.00611174 10.9506 0.0180054C12.9944 0.0430015 13.856 0.238189 13.856 0.238189L13.4133 3.02457C13.4133 3.02457 12.1081 2.68246 11.4675 2.80438C10.8277 2.92634 10.4588 3.31756 10.4588 4.29519Z"
                                                fill="#1877F2"
                                            />
                                        </svg>
                                        <span>facebook</span>
                                    </span>
                                </div>
                            </div>
                            <span className="line-or">
                                <span>або</span>
                            </span>
                            <div className="input-list">
                                <div className="input-text">
                                    <Input
                                        name="email"
                                        label={translations[locale].form.email}
                                        type="email"
                                        value={values.email}
                                    />
                                </div>
                                <div className="input-text">
                                    <Input
                                        name="password"
                                        label={
                                            translations[locale].form.password
                                        }
                                        type="password"
                                        password={true}
                                        value={values.password}
                                    />
                                </div>
                            </div>
                            <div className="checkbox-box">
                                <Checkbox
                                    label={
                                        translations[locale].pages.auth.remember
                                    }
                                    value="save"
                                    name={'save'}
                                />
                                <Link
                                    href={
                                        getLangSlug(locale) +
                                        '/auth/forgot-password'
                                    }
                                    className="forgot-password"
                                >
                                    {
                                        translations[locale].pages.auth
                                            .forgot_password
                                    }
                                </Link>
                            </div>
                            <button
                                type="submit"
                                className="btn-black"
                                disabled={isSubmitting}
                            >
                                {translations[locale].pages.auth.login}
                            </button>
                            <span className="text-info">
                                {translations[locale].pages.register.info}{' '}
                                <Link
                                    href={
                                        getLangSlug(locale) + '/privacy-policy'
                                    }
                                >
                                    {translations[locale].pages.register.info2}
                                </Link>
                            </span>
                            <div className="login-register-btn">
                                <span>
                                    {translations[locale].pages.register.info3}
                                </span>
                                <Link
                                    href={
                                        getLangSlug(locale) + '/auth/register'
                                    }
                                >
                                    {translations[locale].pages.register.info4}
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    )
}

export default AuthPage
