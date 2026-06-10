"use client";;
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import toast from 'react-hot-toast'
import { AxiosError } from 'axios';
import Input from '@/components/Form/Input';
import { AllowedLangs } from '@/constants/lang';
import { useLang } from '@/hooks/useLang';
import feedBackService from '@/services/feedbackService';
import dropShipingService from '@/services/dropshiping';
export interface IDropshippingFedbackForm {
    phone: string;
    email: string;
    website: string;
    message: string;
}


const FeedbackForm = ({
    locale
}: {
    locale: AllowedLangs
}) => {

    const { translations } = useLang();
    const [isSuccess,setIsSuccess] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaKey, setCaptchaKey] = useState<string | null>(null);
    const phoneRegEx = /^\+380\s?\(?\d{2,3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;

    const onVerify = useCallback((token:string) => {
        setCaptchaToken(token);
    },[]);
    const validationSchema = Yup.object({
        phone: Yup.string().matches(phoneRegEx,translations[locale].dropshipping.feedbackForm.errors.requiredError)
        .required(translations[locale].dropshipping.feedbackForm.errors.requiredError),
        email: Yup.string()
        .email(translations[locale].dropshipping.feedbackForm.errors.emailFormatError)
        .required(translations[locale].dropshipping.feedbackForm.errors.requiredError),
        website: Yup.string()
        .url(translations[locale].dropshipping.feedbackForm.errors.webSiteError)
        .required(translations[locale].dropshipping.feedbackForm.errors.requiredError),
        message: Yup.string().required(translations[locale].dropshipping.feedbackForm.errors.requiredError),
    });
    //@ts-ignore
    async function onSubmit(values: IDropshippingFedbackForm, {setErrors,resetForm}) {
        const toast_id = toast.loading(translations[locale].info.load)
        dropShipingService.sendDropShipingRequest({
            description:values.message,
            email: values.email,
            phone:values.phone,
            url:values.website,
            "g-recaptcha-response":captchaToken || '',
        }).then(()=>{
            toast.success(translations[locale].info.load, {
                id: toast_id,
            })
            resetForm();
        }).catch((error)=>{
            toast.error(
                translations[locale].errors.error,
                {
                    id: toast_id,
                }
            )
            if(error instanceof AxiosError) { 
                //@ts-ignore
                const errors = error.response?.data.errors as Record<string,string[]>;
                const errorsFields = Object.entries(errors).reduce((acc,[key,value]) => {
                    if(key === 'description') {
                        acc.message = value[0];
                        return acc;    
                    }
                    if(key === 'url'){ 
                        acc.website = value[0];
                        return acc;   
                    }
                    acc[key] = value[0];
                    return acc;
                },{} as Record<string,string>);
                setErrors(errorsFields);
                return;
            }
            
        })
    }

    const formInitialValues: IDropshippingFedbackForm = {
        phone: "",
        email: "",
        website: "",
        message: ""
    }

    useEffect(() => {
        if(!isSuccess){ 
            (async function fetchCaptchaKey() {
                try {
                    const response = await feedBackService.getGoogleRecaptionSiteKey();
                    setCaptchaKey(response.data.site_key);
                    setIsSuccess(true);
                   
                } catch (error) {
                    console.error("Ошибка при получении reCAPTCHA ключа:", error);
                }
            })();
        }
    }, [isSuccess]);
    return (
        <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            
        >
            {({ values, isSubmitting,errors }) => (
                <Form className="contact-form">
                    <Input
                        name="phone"
                        label={translations[locale].dropshipping.feedbackForm.phoneLabel}
                        mask='+380(99)999-99-99'
                        type="tel"
                        value={values.phone}
                        
                    />

                    <Input
                        name="email"
                        label={translations[locale].dropshipping.feedbackForm.emailLabel}
                        type="email"
                        value={values.email}

                    />

                    <Input
                        name="website"
                        label={translations[locale].dropshipping.feedbackForm.websiteLabel}
                        type="text"
                        value={values.website}
                    />

                     <div className="input-textarea">
                        <Field
                            as="textarea"
                            name="message"
                            id="message" 
                            value={values.message}
                            placeholder={
                                translations[locale].dropshipping.feedbackForm.messagePlaceholder
                            }
                        />
                        <ErrorMessage name={'message'}>
                            {(error) => (
                                <span className="error">{error}</span>
                            )}
                        </ErrorMessage>
                    </div>
                    
                    <div className='captcha-wrapper'>
                        {captchaKey && (
                            <GoogleReCaptchaProvider
                                reCaptchaKey={captchaKey}

                            >
                                <GoogleReCaptcha refreshReCaptcha={false} onVerify={onVerify} />
                            </GoogleReCaptchaProvider>
                        )}
                    </div>
                    

                    <button
                        type="submit"
                        className="btn-black"
                        disabled={isSubmitting || !captchaToken}
                    >
                        {translations[locale].dropshipping.feedbackForm.submitAction}
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default FeedbackForm;