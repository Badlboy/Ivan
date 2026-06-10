import { PropertiesList, Property } from '@/models/IProduct'
import React from 'react'
import PropertyColor from './PropertyColor'
import PropertyOther from './PropertyOther'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const PropertyList = ({
    setIsOpenModalSize,
    locale,
    groupedProperties,
    handleUpdateProperty,
    propertyActive,
}: {
    setIsOpenModalSize?: any
    locale: AllowedLangs
    groupedProperties: PropertiesList[]
    handleUpdateProperty: any
    propertyActive: Property[]
}) => {
    const { translations } = useLang()
    return (
        <>
            {groupedProperties?.map((prop) => {
                return (
                    <div key={prop.property.id} className="properties-box">
                        <span className="properties-box__title">
                            {prop.property.name}
                            {!prop.values[0].dop && setIsOpenModalSize ? (
                                <span
                                    className="modal-size-btn btn-modal-size"
                                    onClick={() => setIsOpenModalSize(true)}
                                >
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_1144_20389)">
                                            <path
                                                d="M19.099 13.97L19.1284 7.3291C19.128 7.21943 19.1059 7.11092 19.0634 7.0098C19.0209 6.90869 18.9589 6.81695 18.8809 6.73984C18.7257 6.58591 18.5162 6.49914 18.2976 6.49825L1.59218 6.46879C1.37202 6.46944 1.16107 6.55719 1.0054 6.71286C0.849727 6.86853 0.761981 7.07948 0.761326 7.29964L0.761326 13.97C0.761773 14.0797 0.783865 14.1882 0.826335 14.2893C0.868803 14.3904 0.930815 14.4822 1.00881 14.5593C1.16405 14.7132 1.37356 14.8 1.59218 14.8009H4.92736L14.9329 14.8009L18.2681 14.8009C18.4883 14.8002 18.6992 14.7125 18.8549 14.5568C19.0106 14.4011 19.0983 14.1902 19.099 13.97ZM15.7638 13.5721L15.7638 12.2965C15.7631 12.0764 15.6754 11.8654 15.5197 11.7097C15.364 11.5541 15.1531 11.4663 14.9329 11.4657C14.8229 11.4652 14.7139 11.4866 14.6122 11.5284C14.5105 11.5703 14.418 11.632 14.3403 11.7097C14.2625 11.7875 14.2008 11.88 14.159 11.9817C14.1171 12.0834 14.0957 12.1924 14.0962 12.3024L14.0962 13.578L12.4286 13.5721L12.4286 10.6348C12.4124 10.4256 12.3178 10.2301 12.1638 10.0875C12.0098 9.94497 11.8076 9.86577 11.5977 9.86577C11.3879 9.86577 11.1857 9.94497 11.0317 10.0875C10.8776 10.2301 10.7831 10.4256 10.7669 10.6348L10.7669 13.5721H9.0934L9.09929 12.3024C9.09929 12.0805 9.01114 11.8677 8.85422 11.7108C8.6973 11.5538 8.48447 11.4657 8.26255 11.4657C8.04063 11.4657 7.82781 11.5538 7.67089 11.7108C7.51397 11.8677 7.42581 12.0805 7.42581 12.3024L7.4317 13.5721L5.76411 13.578L5.75821 10.6348C5.75756 10.4147 5.66981 10.2037 5.51414 10.048C5.35847 9.89238 5.14752 9.80463 4.92736 9.80397C4.70721 9.80463 4.49626 9.89237 4.34059 10.048C4.18491 10.2037 4.09717 10.4147 4.09651 10.6348L4.09651 13.5721L2.12044 13.578L2.11987 7.74306L17.9647 7.7427L17.9489 13.578L15.7638 13.5721Z"
                                                fill="#111111"
                                            ></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1144_20389">
                                                <rect
                                                    width="20"
                                                    height="20"
                                                    fill="white"
                                                    transform="translate(0 0.58844)"
                                                ></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <span>
                                        {
                                            translations[locale].product.size
                                                .title
                                        }
                                    </span>
                                </span>
                            ) : (
                                ''
                            )}
                        </span>
                        {prop.values[0].dop ? (
                            <div className="properties-box__list color">
                                {prop.values.map((val, index) => (
                                    <PropertyColor
                                        key={val.id}
                                        val={val}
                                        prop={prop}
                                        handleUpdateProperty={
                                            handleUpdateProperty
                                        }
                                        propertyActive={propertyActive}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="properties-box__list size">
                                {prop.values.map((val, key) => (
                                    <PropertyOther
                                        key={val.id}
                                        val={val}
                                        prop={prop}
                                        handleUpdateProperty={
                                            handleUpdateProperty
                                        }
                                        propertyActive={propertyActive}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}

export default PropertyList
