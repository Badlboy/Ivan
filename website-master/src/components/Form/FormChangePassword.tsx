'use client'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import Input from '@/components/Form/Input'
import authService from '@/services/authService'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const FormChangePassword = ({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()
    const initialValues = {
        old_password: '',
        password: '',
        password_confirmation: '',
    }

    const SignupSchema = Yup.object().shape({
        old_password: Yup.string().required(
            translations[locale].errors.old_password
        ),
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

    async function onSubmit(values: typeof initialValues) {
        const toast_id = toast.loading(translations[locale].info.load)
        try {
            const response = await authService.userChangePassword(
                values.old_password,
                values.password,
                values.password_confirmation,
                locale
            )
            if (response.data.data.id) {
                toast.success(translations[locale].profile.password, {
                    id: toast_id,
                })
            }
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
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={SignupSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Form className="input-box password">
                    <span className="title-section">
                        {translations[locale].profile.password_title}
                    </span>
                    <div className="content content-box-three">
                        <div className="box">
                            <Input
                                name="old_password"
                                label={translations[locale].form.old_password}
                                type="password"
                                password={true}
                                value={values.old_password}
                            />
                        </div>
                        <div className="box">
                            <Input
                                name="password"
                                label={translations[locale].form.new_password}
                                type="password"
                                id="password"
                                password={true}
                                value={values.password}
                            />
                        </div>
                        <div className="box">
                            <Input
                                name="password_confirmation"
                                label={
                                    translations[locale].form.replay_password
                                }
                                type="password"
                                password={true}
                                value={values.password_confirmation}
                            />
                        </div>
                    </div>
                    <button className="btn-opacity" disabled={isSubmitting}>
                        {translations[locale].form.save}
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default FormChangePassword
