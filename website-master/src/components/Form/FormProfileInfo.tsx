'use client'
import { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import Image from 'next/image'

import { IUser } from '@/models/IUser'
import Input from '@/components/Form/Input'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import authService from '@/services/authService'
import { useSession } from 'next-auth/react'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import authConfig from '@/config/auth'

const FormProfileInfo = ({
    user,
    setUser,
    locale,
}: {
    user: IUser
    setUser: any
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    const [file, setFile] = useState<File | any>()
    const { data: session, status, update } = useSession()

    const SignupSchema = Yup.object().shape({
        name: Yup.string()
            .min(1, translations[locale].errors.name)
            .required(translations[locale].errors.required),
        last_name: Yup.string()
            .min(1, translations[locale].errors.last_name)
            .required(translations[locale].errors.required),
        phone: Yup.string()
            .matches(/^\+380\d{9}$/, translations[locale].errors.phone)
            .required(translations[locale].errors.required),
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }
    const initialValues = {
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        phone: user.phone,
    }

    async function onSubmit(values: typeof initialValues) {
        const toast_id = toast.loading(translations[locale].info.load)
        try {
            const formData = new FormData()
            formData.append('_method', 'PUT')
            formData.append('name', values.name)
            formData.append('last_name', values.last_name)
            formData.append('phone', values.phone)

            if (file) {
                formData.append('avatar', file)
            }
            const response = await authService.updateUser(formData)
            if (response.data.data.id) {
                setUser(response.data.data)
                setFile(null)
                await update({
                    ...session,
                    user: response.data.data,
                })
                toast.success(translations[locale].profile.edit, {
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
                <Form className="content content-box-three">
                    <div className="box">
                        <Input
                            name="name"
                            label={translations[locale].form.name}
                            type="text"
                            edit={true}
                            value={values.name}
                        />
                        <Input
                            name="last_name"
                            label={translations[locale].form.last_name}
                            type="text"
                            edit={true}
                            value={values.last_name}
                        />
                    </div>
                    <div className="box">
                        <Input
                            name="phone"
                            label={translations[locale].form.phone}
                            type="text"
                            edit={true}
                            value={values.phone}
                            mask="+380999999999"
                        />
                    </div>
                    <div className="image-box">
                        <input
                            id="avatar"
                            type="file"
                            name={'file'}
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png, image/jpg, image/gif"
                        />
                        <div className="image">
                            {user?.avatar?.startsWith('https://') ||
                            user?.avatar?.startsWith('http://') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={user.avatar}
                                    width={72}
                                    height={72}
                                    alt={user?.name}
                                />
                            ) : (
                                <Image
                                    src={
                                        user?.avatar
                                            ? `${API_URL_IMAGE}${user.avatar}`
                                            : '/image/avatar.png'
                                    }
                                    alt={user?.name}
                                    width={72}
                                    height={72}
                                />
                            )}
                        </div>
                        <div className="info">
                            <label htmlFor={'avatar'} className="title">
                                {translations[locale].form.loadPhoto}
                            </label>
                            <span className="text">
                                {file ? file.name : ''}
                            </span>
                        </div>
                    </div>
                    <button disabled={isSubmitting} className="btn-opacity">
                        {translations[locale].form.save}
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default FormProfileInfo
