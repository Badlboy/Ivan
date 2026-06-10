import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IUserAddress } from '@/models/IUser'
import React from 'react'

const AddressItem = ({
    address,
    removeAddress,
    isSetActiveAddress,
    setActiveAddress,
    locale,
}: {
    address: IUserAddress
    removeAddress: any
    isSetActiveAddress: any
    setActiveAddress: any
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    return (
        <div
            className={`address-list__item${address.is_active ? ' active' : ''}`}
        >
            <div className="top">
                <div className="name">
                    <span
                        className="circle"
                        onClick={() => {
                            if (!address.is_active) {
                                isSetActiveAddress(address.id)
                            }
                        }}
                    ></span>
                    <span>
                        {address.first_name} {address.last_name}
                    </span>
                </div>
                <div
                    className="delete"
                    onClick={() => removeAddress(address.id)}
                >
                    <svg
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7.5 11.4952L7.5 9.24519"
                            stroke="#111111"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M10.5 11.4952L10.5 9.24519"
                            stroke="#111111"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M2.25 5.49519H15.75V5.49519C15.5178 5.49519 15.4017 5.49519 15.304 5.50482C14.3544 5.59835 13.6032 6.34961 13.5096 7.29916C13.5 7.39694 13.5 7.51302 13.5 7.74519V11.2452C13.5 13.1308 13.5 14.0736 12.9142 14.6594C12.3284 15.2452 11.3856 15.2452 9.5 15.2452H8.5C6.61438 15.2452 5.67157 15.2452 5.08579 14.6594C4.5 14.0736 4.5 13.1308 4.5 11.2452V7.74519C4.5 7.51302 4.5 7.39694 4.49037 7.29916C4.39685 6.34961 3.64559 5.59835 2.69603 5.50482C2.59825 5.49519 2.48217 5.49519 2.25 5.49519V5.49519Z"
                            stroke="#111111"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M7.55111 2.77314C7.63657 2.6934 7.82489 2.62294 8.08686 2.57269C8.34882 2.52243 8.6698 2.49519 9 2.49519C9.3302 2.49519 9.65118 2.52243 9.91314 2.57269C10.1751 2.62294 10.3634 2.6934 10.4489 2.77314"
                            stroke="#111111"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>
            <div className="text">
                <div className="info">
                    <span>{address.delivery_address}</span>
                    <span>
                        {translations[locale].profile.phone_short}{' '}
                        {address.phone}
                    </span>
                    {address.department_postomat ? (
                        <>
                            <span>
                                {translations[locale].order.nova_pochta}
                            </span>
                            <span>{address.department_postomat}</span>
                        </>
                    ) : (
                        ''
                    )}
                </div>
                <span
                    className="edit"
                    onClick={() => setActiveAddress(address)}
                >
                    {translations[locale].form.edit}
                </span>
            </div>
        </div>
    )
}

export default AddressItem
