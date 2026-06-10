import { AllowedLangs } from '@/constants/lang';
import { useLang } from '@/hooks/useLang';
import * as Yup from 'yup'

export const useSignupEmailSchema = (locale: AllowedLangs) => { 
    const { translations } = useLang();

    return Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
        password: Yup.string().required(translations[locale].errors.required),
        save: Yup.string(),
    })
};

export const useNewCustomerSchema = (locale: AllowedLangs) => {
    const { translations } = useLang();

    return Yup.object().shape({
        email: Yup.string()
            .email(translations[locale].errors.email)
            .required(translations[locale].errors.required),
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
}