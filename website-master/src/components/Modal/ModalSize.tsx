import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

import { API_URL_IMAGE } from '@/http/axiosConfig'

const ModalSize = ({
    locale,
    setIsOpenModalSize,
    isOpenModalSize,
    size,
    modalSizeBtnRef,
    scrolled
}: {
    size: {
        description: string
        category: string
        images: string[]
    }
    setIsOpenModalSize: any
    isOpenModalSize: boolean
    locale: AllowedLangs
    modalSizeBtnRef: React.RefObject<HTMLDivElement>
    scrolled: boolean
}) => {
    const { translations } = useLang()

    const modalRef = useRef<HTMLDivElement>(null)
    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node) &&
            modalSizeBtnRef.current &&
            !modalSizeBtnRef.current.contains(event.target as Node)
        ) {
            setIsOpenModalSize(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            // className="modal-form-center"
            ref={modalRef}
            className={scrolled ? ' scrolled' : ''}
            id="modal-size"
            style={isOpenModalSize ? {} : { display: 'none' }}
        >
            <div
                className="body-bg"
                onClick={() => setIsOpenModalSize(false)}
            ></div>
            <div className="box size">
                <span
                    className="close"
                    onClick={() => setIsOpenModalSize(false)}
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20.1459 9.85291L10.293 19.7058"
                            stroke="#111111"
                            strokeWidth="1.47793"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10.2956 9.85291L20.1484 19.7058"
                            stroke="#111111"
                            strokeWidth="1.47793"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <span className="title">
                    {translations[locale].product.size.title}
                </span>
                <div className="breadcrumb-modal">
                    <span>{translations[locale].product.size.breadcrumb} </span>
                    <span>/ {size.category}</span>
                </div>
                <div
                    className="size-box table-size"
                    dangerouslySetInnerHTML={{
                        __html: size.description,
                    }}
                ></div>
                {size.images.length > 0 ? (
                    <div className="size-box image">
                        {size.images.map((item, index) => (
                            <Image key={index}
                                src={
                                    API_URL_IMAGE +
                                    item
                                }
                                title={'Table size #' + index}
                                alt={'Table size #' + index}
                                width={450}
                                height={200}
                            />
                        ))}
                    </div>
                ) : ''}

            </div>
        </div>
    )
}

export default ModalSize
