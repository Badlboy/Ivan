'use client'
import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import toast from 'react-hot-toast'
import pagesService from '@/services/pagesService'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const AboutUsForm = ({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()

    const initialForm = {
        type: '',
        name: '',
        email: '',
        comment: '',
        file: null as File | null,
    }

    const selectType = [
        {
            name: 'type',
            title: translations[locale].page.aboutus.type_list.type1,
            value: "Зворотній зв'язок",
        },
        {
            name: 'type',
            title: translations[locale].page.aboutus.type_list.type2,
            value: 'Скарга',
        },
        {
            name: 'type',
            title: translations[locale].page.aboutus.type_list.type3,
            value: 'Пропозиція',
        },
    ]

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
        name: Yup.string()
            .min(1, translations[locale].errors.name)
            .required(translations[locale].errors.required),
        type: Yup.string()
            .min(1, translations[locale].page.aboutus.form_input)
            .required(translations[locale].errors.required),
    })

    async function onSubmit(
        values: typeof initialForm,
        { resetForm }: { resetForm: () => void }
    ) {
        const toast_id = toast.loading(translations[locale].info.save)
        try {
            const formData = new FormData()

            formData.append('type', values.type)
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('comment', values.comment)

            if (values.file) {
                formData.append('file', values.file)
            }

            await pagesService.sendAboutUsForm(formData)
            toast.success(translations[locale].page.aboutus.send_info, {
                id: toast_id,
            })
            resetForm()
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(translations[locale].errors.error, {
                id: toast_id,
            })
        }
    }

    return (
        <Formik
            initialValues={initialForm}
            validationSchema={SignupSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="form">
                    <Select
                        name="type"
                        label={translations[locale].page.aboutus.type}
                        fields={selectType}
                        value={values.type}
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
                        <Field
                            as="textarea"
                            name="comment"
                            id="comment"
                            value={values.comment}
                            placeholder={
                                translations[locale].page.aboutus.form_comment
                            }
                        />
                    </div>
                    <div className="controll">
                        <div className="input-file">
                            <input
                                id="file"
                                name="file"
                                type="file"
                                onChange={(event: any) => {
                                    setFieldValue(
                                        'file',
                                        event.currentTarget.files[0]
                                    )
                                }}
                            />
                            <label htmlFor="file">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.0026 4.16667L9.47227 3.63634L10.0026 3.10601L10.5329 3.63634L10.0026 4.16667ZM10.7526 11.6667C10.7526 12.0809 10.4168 12.4167 10.0026 12.4167C9.58839 12.4167 9.2526 12.0809 9.2526 11.6667L10.7526 11.6667ZM5.30561 7.80301L9.47227 3.63634L10.5329 4.697L6.36627 8.86367L5.30561 7.80301ZM10.5329 3.63634L14.6996 7.80301L13.6389 8.86367L9.47227 4.697L10.5329 3.63634ZM10.7526 4.16667L10.7526 11.6667L9.2526 11.6667L9.2526 4.16667L10.7526 4.16667Z"
                                        fill="#111111"
                                    />
                                    <path
                                        d="M4.16406 13.3333L4.16406 14.1667C4.16406 15.0871 4.91025 15.8333 5.83073 15.8333L14.1641 15.8333C15.0845 15.8333 15.8307 15.0871 15.8307 14.1667V13.3333"
                                        stroke="#111111"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                                <span>
                                    {values.file
                                        ? values.file.name
                                        : translations[locale].page.aboutus
                                              .load_file}
                                </span>
                            </label>
                        </div>
                        <button disabled={isSubmitting} className="btn-black">
                            {translations[locale].pages.auth.send}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default AboutUsForm
