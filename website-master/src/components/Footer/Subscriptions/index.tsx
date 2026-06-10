'use client'
import subscriptionsService from '@/services/subscriptionsService'
import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import Input from '@/components/Form/Input'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

interface IEmail {
    email: string
}

const SubscriptionsBox = React.memo(({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
    })

    const createSubscriptions = async (values: IEmail, actions: any) => {
        const toast_id = toast.loading(translations[locale].info.ifEmail)
        try {
            await subscriptionsService.fetchCreateSubscriptions(
                values.email,
                locale
            )
            toast.success(translations[locale].info.ifEmail_sec, {
                id: toast_id,
            })
            actions.resetForm()
        } catch (error: any) {
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

    return (
        <div className="right">
            <span className="footer-title">
                {translations[locale].subscriptions.title}
            </span>
            <span className="footer-link">
                {translations[locale].subscriptions.description}
            </span>
            <Formik
                initialValues={{
                    email: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={createSubscriptions}
            >
                {({ values, isSubmitting }) => (
                    <Form className="form-box">
                        <label
                            htmlFor="subscriptions"
                            style={{ display: 'none' }}
                        ></label>
                        <Input
                            id="subscriptions"
                            name="email"
                            label={translations[locale].form.email}
                            type="text"
                            value={values.email}
                            className={'white'}
                        />
                        <button disabled={isSubmitting} className="btn-white">
                            {translations[locale].subscriptions.send}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
})

SubscriptionsBox.displayName = 'SubscriptionsBox';

export default SubscriptionsBox
