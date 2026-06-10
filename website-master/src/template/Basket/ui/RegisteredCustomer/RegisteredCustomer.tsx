import toast from 'react-hot-toast'
import { Form, Formik } from 'formik'
import { signIn } from 'next-auth/react'
import Input from '@/components/Form/Input'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { ProvidersEnum } from '@/config/auth'
import { getLangSlug } from '@/utils/function'
import { useSignupEmailSchema } from '../../model'
import { IUser } from '@/models/IUser'

interface NewCustumerProps {
    className?: string;
    locale: AllowedLangs;
    session: IUser;
    isNewUser:boolean;
    onClick:(val:boolean) => void;
}

export const RegisteredCustomer = (props: NewCustumerProps) => {
    const { className,session,isNewUser, onClick, locale } = props
    const { translations } = useLang()

    const initialValues = {
        email: '',
        password: '',
        save: '',
    }
    const SignupEmailSchema = useSignupEmailSchema(locale);
    async function onSubmit(values: typeof initialValues) {
        const toast_id = toast.loading(translations[locale].info.load)
        const result = await signIn(ProvidersEnum.SingIn, {
            ...values,
            redirect: false,
        })

        if (result?.ok) {
            toast.dismiss(toast_id)
            window.location.href = getLangSlug(locale) + '/basket'
        } else {
            const errorMessage =
                result?.error || translations[locale].errors.error
            toast.error(errorMessage, { id: toast_id })
        }
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={SignupEmailSchema}
            onSubmit={onSubmit}
        >
            {({ values, isSubmitting }) => (
                <Form className="section-order-product__left">
                    <div className="order-section">
                        <span className="order-section__title">
                            1. {translations[locale].order.basket.title_contact}
                        </span>
                        {!session?.id ? (
                            <div className="users-btn">
                                <span
                                    className={`btn-opacity ${isNewUser ? 'active' : ''}`}
                                    onClick={() => onClick(true)}
                                >
                                    {
                                        translations[locale].order.basket
                                            .new_buyer
                                    }
                                </span>
                                <span
                                    className={`btn-opacity ${!isNewUser ? 'active' : ''}`}
                                    onClick={() => onClick(false)}
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
                        <div className="login-social">
                            <div className="form">
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
                        </div>
                        <button className="login btn-opacity">
                            {translations[locale].pages.auth.login}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}