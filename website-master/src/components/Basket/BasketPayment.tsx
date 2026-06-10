import React, { useMemo } from 'react'
import Radio from '../Form/Radio'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const BasketPayment = ({
    locale,
    initialUserPayments,
    setInitialUserPayments,
    cost,
}: {
    locale: AllowedLangs
    initialUserPayments: string
    setInitialUserPayments: any,
    cost:number,
}) => {
    const { translations } = useLang()
    const paymentsList = useMemo(() => {
        if(cost < 499) {
            return [
                {
                    label: translations[locale].order.payments.iban,
                    value: 'IBAN',
                },
            ]
        }
        return [
            {
                label: translations[locale].order.payments.cash,
                value: 'Cash',
            },
            {
            label: translations[locale].order.payments.iban,
            value: 'IBAN',
            },
            // {
            //     label: 'Apple Pay',
            //     value: 'ApplePay',
            // },
            // {
            //     label: 'Google Pay',
            //     value: 'GooglePay',
            // },
        ]
    },[cost])

    return (
        <div className="order-section">
            <span className="order-section__title">
                3. {translations[locale].order.payment_title}
            </span>
            <div className="payments-section">
                {paymentsList.map((item, index) => (
                    <Radio
                        key={index}
                        checked={initialUserPayments === item.value}
                        value={item.value}
                        name={'payments'}
                        label={item.label}
                        setInitialUserPayments={setInitialUserPayments}
                    />
                ))}
            </div>
        </div>
    )
}

export default BasketPayment
