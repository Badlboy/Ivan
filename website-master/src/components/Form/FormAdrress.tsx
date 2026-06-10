import { IUserAddress, IUserAddressForm } from '@/models/IUser'
import React, { useEffect, useState } from 'react'
import AddressItem from '../User/AddressItem'
import authService from '@/services/authService'
import toast from 'react-hot-toast'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Input from './Input'
import Select from './Select'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import NovaPoshtaSelector from './NovaPoshtaSelector'
import NovaPoshtaSelectorProfile from './NovaPoshtaSelectorProfile'

const FormAdrress = ({
    address,
    fetchAddressData,
    locale,
}: {
    address: IUserAddress[]
    fetchAddressData: any
    locale: AllowedLangs
}) => {
    const { translations } = useLang()

    const selectDeliver = [
        {
            name: 'delivery_method',
            title: translations[locale].order.delivery_method_pickup,
            value: 'Pickup',
        },
        {
            name: 'delivery_method',
            title: translations[locale].order.delivery_method_courier,
            value: 'Courier',
        },
    ]

    const SignupSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(1, translations[locale].errors.name)
            .required(translations[locale].errors.required),
        last_name: Yup.string()
            .min(1, translations[locale].errors.last_name)
            .required(translations[locale].errors.required),
        phone: Yup.string()
            .matches(/^\+380\d{9}$/, translations[locale].errors.phone)
            .required(translations[locale].errors.required),
        delivery_method: Yup.string()
            .required(translations[locale].errors.required)
            .oneOf(
                ['Pickup', 'Courier'],
                translations[locale].errors.delivery_method
            ),
        delivery_address: Yup.string().test(
            'delivery-address-required',
            translations[locale].errors.delivery_address,
            function (value) {
                const { delivery_method } = this.parent
                if (delivery_method === 'Courier') {
                    return !!value && value.length <= 255
                }
                return true
            }
        ),
        city: Yup.string().test(
            'city-required',
            translations[locale].errors.required,
            function (value) {
                const { delivery_method } = this.parent
                if (delivery_method === 'Pickup') {
                    return !!value && value.length <= 255
                }
                return true
            }
        ),
        department_postomat: Yup.string().test(
            'department-postomat-required',
            translations[locale].errors.department_postomat,
            function (value) {
                const { delivery_method } = this.parent
                if (delivery_method === 'Pickup') {
                    return !!value && value.length <= 255
                }
                return true
            }
        ),
    })

    const [activeAddress, setActiveAddress] = useState<IUserAddress>(
        {} as IUserAddress
    )

    const [initialValues, setInitialValues] = useState<IUserAddressForm>({
        first_name: activeAddress.first_name ?? '',
        last_name: activeAddress.last_name ?? '',
        phone: activeAddress.phone ?? '',
        delivery_method: activeAddress.delivery_method ?? '',
        delivery_address: activeAddress.delivery_address ?? '',
        city: activeAddress.city ?? '',
        department_postomat: activeAddress.department_postomat ?? '',
    })

    async function removeAddress(id: number) {
        const toast_id = toast.loading(translations[locale].info.delete)
        try {
            await authService.removeUserAddress(id)
            fetchAddressData()
            toast.success(translations[locale].profile.deleteAddress, { id: toast_id })
        } catch (error) {
            toast.error('Помилка', { id: toast_id })
            console.error('Error fetching data:', error)
        }
    }
    async function isSetActiveAddress(id: number) {
        const toast_id = toast.loading(translations[locale].info.load)
        try {
            await authService.getUserSetActiveAddress(id)
            fetchAddressData()
            toast.success(translations[locale].profile.address, {
                id: toast_id,
            })
        } catch (error) {
            toast.error('Помилка', { id: toast_id })
            console.error('Error fetching data:', error)
        }
    }
    async function onSubmit(values: IUserAddressForm) {
        if (activeAddress.id) {
            const toast_id = toast.loading(translations[locale].info.save)
            try {
                await authService.updateUserAddress(
                    activeAddress.id,
                    values.first_name,
                    values.last_name,
                    values.phone,
                    values.delivery_method,
                    values.delivery_address,
                    values.city,
                    values.department_postomat
                )
                setActiveAddress({} as IUserAddress)
                toast.success(translations[locale].profile.address, {
                    id: toast_id,
                })
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error(translations[locale].errors.error, {
                    id: toast_id,
                })
            }
        } else {
            const toast_id = toast.loading(translations[locale].info.add)
            try {
                await authService.createUserAddress(
                    values.first_name,
                    values.last_name,
                    values.phone,
                    values.delivery_method,
                    values.delivery_address,
                    values.city,
                    values.department_postomat
                )
                setActiveAddress({} as IUserAddress)
                toast.success(translations[locale].profile.addAddress, {
                    id: toast_id,
                })
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error(translations[locale].errors.error, {
                    id: toast_id,
                })
            }
        }
        await fetchAddressData()
        setInitialValues({} as IUserAddressForm)
    }

    useEffect(() => {
        if (activeAddress) {
            setInitialValues({
                first_name: activeAddress.first_name ?? '',
                last_name: activeAddress.last_name ?? '',
                phone: activeAddress.phone ?? '',
                delivery_method: activeAddress.delivery_method ?? '',
                delivery_address: activeAddress.delivery_address ?? '',
                city: activeAddress.city ?? '',
                department_postomat: activeAddress.department_postomat ?? '',
            })
        }
    }, [activeAddress])

    return (
        <div className="input-box address">
            <span className="title-section">
                {translations[locale].profile.address_title}
            </span>
            <div className="address-section">
                <div className="left address-list">
                    {address.map((item) => (
                        <AddressItem
                            locale={locale}
                            removeAddress={removeAddress}
                            isSetActiveAddress={isSetActiveAddress}
                            setActiveAddress={setActiveAddress}
                            key={item.id}
                            address={item}
                        />
                    ))}
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={SignupSchema}
                    onSubmit={onSubmit}
                    enableReinitialize={true}
                >
                    {({
                        values,
                        errors,
                        touched,
                        isSubmitting,
                        setFieldValue,
                    }) => {
                        return (
                            <Form className="right">
                                <Input
                                    name="first_name"
                                    label={translations[locale].form.name}
                                    type="text"
                                    value={values.first_name}
                                    edit={true}
                                />
                                <Input
                                    name="last_name"
                                    label={translations[locale].form.last_name}
                                    type="text"
                                    value={values.last_name}
                                    edit={true}
                                />
                                <Input
                                    name="phone"
                                    label={translations[locale].form.phone}
                                    type="text"
                                    value={values.phone}
                                    edit={true}
                                    mask="+380999999999"
                                />
                                <Select
                                    name="delivery_method"
                                    label={
                                        translations[locale].profile
                                            .delivery_method
                                    }
                                    fields={selectDeliver}
                                    value={values.delivery_method}
                                />
                                {values.delivery_method == 'Pickup' ? (
                                    <NovaPoshtaSelectorProfile
                                        locale={locale}
                                        valueCity={values.city}
                                        selectedBranch={
                                            values.department_postomat
                                        }
                                        setInitialUserDeliver={(
                                            selectedBranch: string
                                        ) => {
                                            setFieldValue(
                                                'department_postomat',
                                                selectedBranch
                                            )
                                        }}
                                        setInitialUserCity={(city: string) => {
                                            setFieldValue('city', city)
                                        }}
                                    />
                                ) : values.delivery_method == 'Courier' ? (
                                    <Input
                                        name="delivery_address"
                                        label={
                                            translations[locale].profile
                                                .delivery_address
                                        }
                                        type="text"
                                        value={values.delivery_address}
                                    />
                                ) : (
                                    ''
                                )}
                                <button
                                    disabled={isSubmitting}
                                    className="btn-opacity"
                                >
                                    {activeAddress.id
                                        ? translations[locale].form.save
                                        : translations[locale].form.create}
                                </button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default FormAdrress
