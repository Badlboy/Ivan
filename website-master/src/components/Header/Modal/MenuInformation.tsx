import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IContact } from '@/models/IPage'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import LangModal from '../LangModal'
import { getLangSlug } from '@/utils/function'
import { ICategoriesLittle } from '@/models/ICategories'

const MenuInformation = React.memo(({
    categories,
    modalInfoBtnRef2,
    modalInfoBtnRef,
    isOpen,
    sessionUser,
    setIsOpen,
    contact,
    locale,
}: {
    categories: ICategoriesLittle[]
    modalInfoBtnRef2: React.RefObject<HTMLDivElement>
    modalInfoBtnRef: React.RefObject<HTMLDivElement>
    isOpen: boolean
    setIsOpen: any
    sessionUser: any
    contact: IContact
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    const modalRef = useRef<HTMLDivElement>(null)
    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node) &&
            modalInfoBtnRef.current &&
            !modalInfoBtnRef.current.contains(event.target as Node) &&
            modalInfoBtnRef2.current &&
            !modalInfoBtnRef2.current.contains(event.target as Node)
        ) {
            setIsOpen(false)
        }
    }
    // const handleScroll = () => {
    //     setIsOpen(false)
    // }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        // window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            document.removeEventListener('click', handleClickOutside)
            // window.removeEventListener('scroll', handleScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={modalRef}
            id="modal-menu-information"
            style={isOpen ? {} : { display: 'none' }}
        >
            <span className="close" onClick={() => setIsOpen(false)}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 8L8 16"
                        stroke="#111111"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 8L16 16"
                        stroke="#111111"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <div className="mobile-menu">
                {categories.map((item) => (
                    <MenuHeaderMobile
                        setIsOpen={setIsOpen}
                        locale={locale}
                        key={item.id}
                        {...item}
                    />
                ))}
                <div className="mobile-menu__box">
                    <Link
                        onClick={() => setIsOpen(false)}
                        href={getLangSlug(locale) + '/shop/sales'}
                        className="title red"
                    >
                        {translations[locale].menu.sales}
                    </Link>
                </div>
            </div>
            <div className="bottom-box">
                <div className="dop-menu-mobile">
                    {sessionUser?.user?.id ? (
                        <Link
                            onClick={() => setIsOpen(false)}
                            className="text-regular"
                            href={getLangSlug(locale) + '/profile'}
                        >
                            {translations[locale].menu.profile}
                        </Link>
                    ) : (
                        <Link
                            onClick={() => setIsOpen(false)}
                            className="text-regular"
                            href={getLangSlug(locale) + '/auth'}
                        >
                            {translations[locale].menu.auth} /{' '}
                            {translations[locale].menu.register}
                        </Link>
                    )}
                    <LangModal locale={locale} />
                </div>
                <nav className="menu">
                    <ul>
                        <li>
                            <Link
                                onClick={() => setIsOpen(false)}
                                href={getLangSlug(locale) + '/about-us'}
                            >
                                {translations[locale].menu.aboutUs}
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setIsOpen(false)}
                                href={getLangSlug(locale) + '/delivery-payment'}
                            >
                                {translations[locale].menu.deliveryPayment}
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setIsOpen(false)}
                                href={getLangSlug(locale) + '/dropshippings'}
                            >
                                {translations[locale].menu.dropshippings}
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setIsOpen(false)}
                                href={getLangSlug(locale) + '/blogs'}
                            >
                                {translations[locale].menu.blogs}
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setIsOpen(false)}
                                href={getLangSlug(locale) + '/career'}
                            >
                                {translations[locale].menu.career}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className='contact-header'>
                    <div className="phone">
                        {contact?.phone1 && (
                            <Link href={'tel:+' + contact.phone1.replace(/\D/g, '')}>
                                {contact.phone1}
                            </Link>
                        )}
                        {contact?.phone2 && (
                            <Link href={'tel:+' + contact.phone2.replace(/\D/g, '')}>
                                {contact.phone2}
                            </Link>
                        )}
                    </div>
                    <div className="btn">
                        {contact?.link_telegram && (
                            <Link
                                rel="noindex, nofollow"
                                href={contact.link_telegram}
                                className="tg"
                            >
                                <svg
                                    width="23"
                                    height="18"
                                    viewBox="0 0 23 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.75783 7.83905L14.6242 2.49635C15.8943 1.93981 20.2015 0.15891 20.2015 0.15891C20.2015 0.15891 22.1894 -0.620235 22.0238 1.27197C21.9686 2.05112 21.5268 4.77813 21.085 7.72775L19.7045 16.4653C19.7045 16.4653 19.5941 17.7453 18.6553 17.9679C17.7166 18.1906 16.1704 17.1888 15.8943 16.9662C15.6734 16.7992 11.7528 14.2948 10.317 13.0705C9.93048 12.7365 9.48872 12.0687 10.3722 11.2896C12.3602 9.453 14.7347 7.17122 16.1704 5.72423C16.8331 5.05639 17.4957 3.4981 14.7347 5.39031L6.94857 10.6774C6.94857 10.6774 6.06504 11.2339 4.40842 10.733C2.75181 10.2321 0.819085 9.56431 0.819085 9.56431C0.819085 9.56431 -0.506209 8.72951 1.75783 7.83905Z"
                                        fill="white"
                                    />
                                </svg>
                                Telegram
                            </Link>
                        )}
                        {contact?.link_viber && (
                            <Link
                                rel="noindex, nofollow"
                                href={contact.link_viber}
                                className="viber"
                            >
                                <svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 20 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.3519 1.55808C15.9007 1.17518 13.9529 0.0321905 9.88877 0.0156342C9.88877 0.0156342 5.07652 -0.27967 2.74035 1.69655C1.43978 2.89552 1.00175 4.67848 0.953079 6.85458C0.904409 9.03068 0.656222 13.1866 4.91762 14.2923C4.91762 14.2923 4.90118 17.3781 4.89893 17.6493C4.89893 17.8389 4.93116 17.9687 5.04719 17.9954C5.131 18.0144 5.25573 17.9741 5.36242 17.875C6.04348 17.236 8.22495 14.7781 8.22495 14.7781C11.1523 14.9566 13.4807 14.4169 13.7311 14.3404C14.3203 14.164 17.5126 13.9067 18.0544 9.83019C18.6162 5.6261 17.8514 2.75705 16.3519 1.55808Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M11.8963 6.9315C11.8267 6.93151 11.7597 6.90651 11.7093 6.86169C11.6588 6.81686 11.6287 6.75564 11.6253 6.69068C11.5792 5.82946 11.1447 5.40772 10.258 5.36317C10.1873 5.35792 10.1217 5.32711 10.075 5.27729C10.0284 5.22747 10.0044 5.1626 10.0082 5.09651C10.012 5.03042 10.0434 4.96834 10.0955 4.92351C10.1476 4.87868 10.2165 4.85465 10.2873 4.85655C11.4573 4.91675 12.1078 5.54078 12.1677 6.6654C12.1695 6.69868 12.1643 6.73197 12.1523 6.76336C12.1403 6.79475 12.1218 6.82362 12.0978 6.84833C12.0739 6.87304 12.045 6.8931 12.0127 6.90737C11.9805 6.92165 11.9455 6.92984 11.9099 6.9315H11.8963Z"
                                        fill="#7360F2"
                                    />
                                    <path
                                        d="M13.2906 7.36612H13.2842C13.2122 7.36454 13.1438 7.33632 13.094 7.28766C13.0443 7.239 13.0173 7.17389 13.0189 7.10663C13.0399 6.23939 12.7746 5.5371 12.2079 4.95974C11.6413 4.38237 10.8694 4.06931 9.84018 3.99887C9.76821 3.99396 9.70127 3.96255 9.65409 3.91154C9.60691 3.86054 9.58336 3.79412 9.58861 3.7269C9.59387 3.65967 9.62751 3.59716 9.68212 3.55309C9.73673 3.50903 9.80785 3.48704 9.87983 3.49195C11.0379 3.57112 11.9559 3.9495 12.6086 4.61627C13.2613 5.28304 13.5859 6.1265 13.562 7.11717C13.5606 7.18356 13.5314 7.24678 13.4807 7.29331C13.4299 7.33984 13.3617 7.36597 13.2906 7.36612Z"
                                        fill="#7360F2"
                                    />
                                    <path
                                        d="M14.7168 7.88422C14.6451 7.88415 14.5763 7.85763 14.5254 7.81045C14.4745 7.76327 14.4456 7.69923 14.445 7.63227C14.4325 6.08109 13.9542 4.89627 12.9827 4.01066C12.0228 3.13769 10.8102 2.68977 9.37817 2.68013C9.30611 2.67989 9.2371 2.65293 9.18632 2.60517C9.13555 2.55741 9.10717 2.49277 9.10742 2.42547C9.10768 2.35817 9.13655 2.29372 9.18769 2.2463C9.23883 2.19888 9.30804 2.17237 9.38011 2.17261H9.38236C10.9592 2.18345 12.2981 2.67953 13.3621 3.64762C14.426 4.61571 14.9746 5.95768 14.9888 7.62926C14.9893 7.69651 14.9612 7.7612 14.9107 7.80912C14.8602 7.85704 14.7914 7.88427 14.7193 7.88483L14.7168 7.88422Z"
                                        fill="#7360F2"
                                    />
                                    <path
                                        d="M10.3269 10.0754C10.3269 10.0754 10.7089 10.1055 10.9145 9.86888L11.3155 9.39778C11.5089 9.16419 11.9756 9.01518 12.4326 9.25299C12.7751 9.43542 13.1076 9.63374 13.4289 9.84721C13.7322 10.0555 14.3533 10.5396 14.3553 10.5396C14.6512 10.7729 14.7195 11.1154 14.518 11.4766C14.518 11.4788 14.5164 11.4824 14.5164 11.4842C14.2946 11.8434 14.0129 12.1673 13.6819 12.4438C13.6781 12.4456 13.6781 12.4474 13.6745 12.4493C13.387 12.6736 13.1046 12.8011 12.8271 12.8319C12.7863 12.8385 12.7448 12.841 12.7034 12.8391C12.581 12.8402 12.4593 12.8227 12.343 12.7873L12.334 12.775C11.9066 12.6624 11.193 12.3806 10.0046 11.7683C9.31688 11.4182 8.66217 11.0143 8.04746 10.5609C7.73935 10.3338 7.44545 10.0904 7.1672 9.83186L7.13755 9.80416L7.1079 9.77647L7.07824 9.74877C7.06825 9.73974 7.05858 9.73041 7.04859 9.72108C6.77174 9.46122 6.5111 9.18674 6.26793 8.89898C5.78258 8.32495 5.35009 7.7136 4.9751 7.07147C4.3195 5.9613 4.01781 5.29543 3.89726 4.89568L3.88405 4.88725C3.84626 4.7786 3.82765 4.66493 3.82893 4.5507C3.82667 4.51203 3.82916 4.47325 3.83634 4.43511C3.87094 4.17643 4.00771 3.91243 4.24666 3.64312C4.24859 3.63981 4.25053 3.63981 4.25246 3.63619C4.54845 3.32714 4.89532 3.06415 5.28002 2.85715C5.28195 2.85715 5.28582 2.85534 5.28807 2.85534C5.67486 2.6672 6.04166 2.73102 6.29114 3.00585C6.29307 3.00766 6.81039 3.58773 7.03247 3.87099C7.26107 4.17133 7.47343 4.48218 7.66873 4.80236C7.92337 5.22891 7.76382 5.66569 7.5137 5.84571L7.00927 6.22018C6.75463 6.41223 6.78815 6.76894 6.78815 6.76894C6.78815 6.76894 7.53529 9.40982 10.3269 10.0754Z"
                                        fill="#7360F2"
                                    />
                                </svg>
                                Viber
                            </Link>
                        )}
                    </div>
                </div>
                <div className="bottom">
                    <div className="contact">
                        <div className="left">
                            <span className="title">
                                {translations[locale].system.workTime}
                            </span>
                            {contact?.work1 ? (
                                <span>
                                    <span>
                                        {
                                            translations[locale].system
                                                .workTimeDay
                                        }
                                        :
                                    </span>
                                    {contact.work1}
                                </span>
                            ) : (
                                ''
                            )}
                            {contact?.work2 ? (
                                <span>
                                    <span>
                                        {
                                            translations[locale].system
                                                .workTimeDay2
                                        }
                                        :
                                    </span>
                                    {contact.work2}
                                </span>
                            ) : (
                                ''
                            )}
                            <span>
                                <span>
                                    {translations[locale].system.workTimeDay3}:
                                </span>
                                {translations[locale].system.workTimeDay_nowork}
                            </span>
                        </div>
                        <div className="">
                            <span className="title">
                                {translations[locale].menu.social}
                            </span>
                            {contact?.link_facebook ? (
                                <Link
                                    rel="noindex, nofollow"
                                    href={contact.link_facebook}
                                >
                                    Facebook
                                </Link>
                            ) : (
                                ''
                            )}
                            {contact?.link_youtube ? (
                                <Link
                                    href={contact.link_youtube}
                                    rel="noindex, nofollow"
                                >
                                    Youtube
                                </Link>
                            ) : (
                                ''
                            )}
                            {contact?.link_instagram && (
                                <Link
                                    href={contact.link_instagram}
                                    rel="noindex, nofollow"
                                >
                                    Instagram
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

MenuInformation.displayName = 'MenuInformation';

export default MenuInformation

interface ICategoriesLittleProps extends ICategoriesLittle {
    locale: AllowedLangs
    setIsOpen: any
}


const MenuHeaderMobile = React.memo((category: ICategoriesLittleProps) => {
    const { translations } = useLang()
    const [isOpen, setIsOpen] = useState(false)

    const CloseModal = () => {
        setIsOpen(false)
        category.setIsOpen(false)
    }

    return (
        <div
            className={`mobile-menu__box ${category.children.length > 0 ? 'active-modal-detect-js' : ''}`}
        >
            {category.children.length == 0 ? (
                <Link
                    onClick={() => CloseModal()}
                    href={
                        getLangSlug(category.locale) + '/shop/' + category.slug
                    }
                    className="title"
                >
                    {category.title}
                </Link>
            ) : (
                <div className="title" onClick={() => setIsOpen(true)}>
                    {category.title}
                </div>
            )}

            {category.children.length > 0 ? (
                <div
                    className="mobile-menu__box--item modal-detect-js"
                    style={isOpen ? {} : { display: 'none' }}
                >
                    <span className="close" onClick={() => setIsOpen(false)}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16 8L8 16"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8 8L16 16"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <div className="back" onClick={() => setIsOpen(false)}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 4L7 10L13 16"
                                stroke="#111111"
                                strokeWidth="1.5"
                            />
                        </svg>
                        {translations[category.locale].breadcrumb.back}
                    </div>
                    <div className="mobile-menu__menu">
                        {category.children.map((item) => (
                            <MenuHeaderMobile
                                setIsOpen={CloseModal}
                                locale={category.locale}
                                key={item.id}
                                {...item}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    )
})
MenuHeaderMobile.displayName = 'MenuHeaderMobile';