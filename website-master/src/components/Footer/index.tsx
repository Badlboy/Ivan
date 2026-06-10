import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import SubscriptionsBox from './Subscriptions'
import Link from 'next/link'
import { IContact } from '@/models/IPage'
import { ICategoriesLittle } from '@/models/ICategories'
import { useLang } from '@/hooks/useLang'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'

const Footer = React.memo(({
    contact,
    sessionUser,
    categories,
    locale,
}: {
    contact: IContact
    sessionUser: any
    categories: ICategoriesLittle[]
    locale: AllowedLangs
}) => {
    const currentYear = new Date().getFullYear()
    const { translations } = useLang()
    const [isOpen1, setIsOpen1] = useState(true)
    const [isOpen2, setIsOpen2] = useState(true)
    const [isOpen3, setIsOpen3] = useState(true)
    const [isOpen4, setIsOpen4] = useState(true)
    const [loader, setLoader] = useState(true)

    useEffect(() => {


        setIsOpen1(window.innerWidth > 600)
        setIsOpen2(window.innerWidth > 600)
        setIsOpen3(window.innerWidth > 600)
        setIsOpen4(window.innerWidth > 600)

        const handleResize = () => {
            setIsOpen1(window.innerWidth > 600)
            setIsOpen2(window.innerWidth > 600)
            setIsOpen3(window.innerWidth > 600)
            setIsOpen4(window.innerWidth > 600)
        }

        setLoader(false)

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleTabs = useCallback((isOpen: boolean, setIsOpen: any) => {
        if (window.innerWidth <= 600) {
            setIsOpen(() => {
                return !isOpen;
            });
        }
    }, []);
    return (
        <footer className="footer">
            <div className="top">
                <div className="box-content">
                    <div className="left">
                        <svg
                            className="footer__logo"
                            width="200"
                            height="15"
                            viewBox="0 0 200 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M185.143 14.2575C185.016 14.2575 184.953 14.1908 184.953 14.0573V1.00397C184.953 0.870464 185.016 0.803711 185.143 0.803711H194.449C196.242 0.803711 197.615 1.21637 198.569 2.04168C199.522 2.867 199.999 3.98967 199.999 5.40969C199.999 6.86613 199.522 8.01307 198.569 8.85052C197.626 9.67584 196.253 10.0885 194.449 10.0885H187.969V14.0573C187.969 14.1908 187.906 14.2575 187.78 14.2575H185.143ZM187.969 7.33947H194.346C196.07 7.33947 196.931 6.69621 196.931 5.40969C196.931 4.17172 196.07 3.55274 194.346 3.55274H187.969V7.33947Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M176.017 14.5317H175.051C172.799 14.5317 170.984 13.8885 169.605 12.602C168.227 11.3033 167.537 9.6102 167.537 7.52264C167.537 5.43508 168.227 3.74804 169.605 2.46152C170.996 1.175 172.811 0.531738 175.051 0.531738H176.017C178.269 0.531738 180.078 1.175 181.446 2.46152C182.813 3.7359 183.496 5.42294 183.496 7.52264C183.485 9.59806 182.79 11.2851 181.411 12.5838C180.032 13.8824 178.234 14.5317 176.017 14.5317ZM175.879 11.5096C177.257 11.5096 178.349 11.1516 179.153 10.4355C179.958 9.70729 180.354 8.73633 180.343 7.52264C180.343 6.30894 179.94 5.34405 179.136 4.62797C178.343 3.89975 177.257 3.53564 175.879 3.53564H175.172C173.782 3.53564 172.685 3.89975 171.88 4.62797C171.087 5.34405 170.691 6.30894 170.691 7.52264C170.691 8.73633 171.087 9.70729 171.88 10.4355C172.685 11.1516 173.782 11.5096 175.172 11.5096H175.879Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M151.514 14.2575C151.387 14.2575 151.324 14.1908 151.324 14.0573V1.00397C151.324 0.870464 151.387 0.803711 151.514 0.803711H154.151C154.277 0.803711 154.34 0.870464 154.34 1.00397V6.06509H163.061V1.00397C163.061 0.870464 163.124 0.803711 163.251 0.803711H165.888C166.014 0.803711 166.077 0.870464 166.077 1.00397V14.0573C166.077 14.1908 166.014 14.2575 165.888 14.2575H163.251C163.124 14.2575 163.061 14.1908 163.061 14.0573V8.81411H154.34V14.0573C154.34 14.1908 154.277 14.2575 154.151 14.2575H151.514Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M141.647 14.5139C139.073 14.5139 137.24 14.2105 136.149 13.6036C135.057 12.9846 134.42 11.8316 134.236 10.1446C134.224 9.95038 134.287 9.85328 134.425 9.85328H137.683C137.832 9.85328 137.912 9.94431 137.924 10.1264C137.981 10.6847 138.286 11.0791 138.837 11.3097C139.4 11.5403 140.325 11.6556 141.612 11.6556H142.319C143.433 11.6556 144.289 11.6071 144.887 11.51C145.496 11.4129 145.909 11.2733 146.128 11.0913C146.357 10.9092 146.472 10.6483 146.472 10.3084C146.472 10.0535 146.421 9.85328 146.317 9.70764C146.225 9.562 145.99 9.43456 145.611 9.32533C145.243 9.20396 144.766 9.119 144.18 9.07045C143.606 9.00976 142.767 8.94301 141.664 8.87019C139.757 8.74882 138.303 8.54249 137.303 8.2512C136.304 7.95992 135.592 7.54726 135.166 7.01323C134.753 6.46707 134.546 5.70851 134.546 4.73755C134.546 1.94604 136.919 0.550293 141.664 0.550293H142.302C143.945 0.550293 145.283 0.726279 146.317 1.07825C147.351 1.43022 148.11 1.92784 148.592 2.5711C149.075 3.20222 149.391 4.0154 149.54 5.01063C149.563 5.15627 149.5 5.2291 149.351 5.2291H146.317C146.202 5.2291 146.133 5.15627 146.11 5.01063C146.018 4.41592 145.68 3.99113 145.094 3.73625C144.519 3.46924 143.6 3.33573 142.336 3.33573H141.629C140.124 3.33573 139.102 3.44496 138.562 3.66343C138.033 3.86976 137.769 4.21566 137.769 4.70114C137.769 5.0167 137.866 5.25337 138.062 5.41115C138.269 5.56893 138.682 5.70244 139.303 5.81167C139.935 5.90877 140.917 5.99979 142.25 6.08475C144.996 6.25467 146.909 6.62485 147.989 7.19529C149.081 7.75359 149.626 8.7913 149.626 10.3084C149.626 11.8984 149.046 12.9968 147.886 13.6036C146.725 14.2105 144.864 14.5139 142.302 14.5139H141.647Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M117.973 14.2575C117.846 14.2575 117.783 14.1908 117.783 14.0573V1.00397C117.783 0.870464 117.846 0.803711 117.973 0.803711H120.61C120.736 0.803711 120.799 0.870464 120.799 1.00397V11.5085H132.708C132.835 11.5085 132.898 11.5753 132.898 11.7088V14.0573C132.898 14.1908 132.835 14.2575 132.708 14.2575H117.973Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M101.16 14.2575C101.034 14.2575 100.971 14.1908 100.971 14.0573V1.00397C100.971 0.870464 101.034 0.803711 101.16 0.803711H103.797C103.924 0.803711 103.987 0.870464 103.987 1.00397V11.5085H115.896C116.022 11.5085 116.086 11.5753 116.086 11.7088V14.0573C116.086 14.1908 116.022 14.2575 115.896 14.2575H101.16Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M99.5288 14.0209C99.6092 14.1787 99.5632 14.2575 99.3909 14.2575H96.168C96.0531 14.2575 95.9727 14.2029 95.9267 14.0937L95.1167 12.1639H87.723L86.913 14.1119C86.8555 14.209 86.7808 14.2575 86.6889 14.2575H83.5005C83.3281 14.2575 83.2822 14.1787 83.3626 14.0209L89.2913 0.949355C89.3258 0.852259 89.3948 0.803711 89.4982 0.803711H93.5139C93.5943 0.803711 93.6632 0.852259 93.7207 0.949355L99.5288 14.0209ZM88.8949 9.39669H93.962L91.4802 3.46171H91.3767L88.8949 9.39669Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M80.5771 7.4305C81.7031 7.91598 82.2661 8.92941 82.2661 10.4708C82.2661 11.6117 81.8353 12.528 80.9735 13.2198C80.1233 13.9116 78.9628 14.2575 77.4921 14.2575H67.5822C67.4558 14.2575 67.3926 14.1908 67.3926 14.0573V1.00397C67.3926 0.870464 67.4558 0.803711 67.5822 0.803711H77.3542C78.9973 0.803711 80.2095 1.15568 80.9908 1.85963C81.7721 2.56357 82.1627 3.46778 82.1627 4.57224C82.1627 5.19123 82.0248 5.7556 81.7491 6.26535C81.4848 6.76297 81.0942 7.15135 80.5771 7.4305ZM70.4086 3.55274V6.15612H77.3715C77.877 6.15612 78.2734 6.04082 78.5607 5.81021C78.8479 5.56747 78.9915 5.23371 78.9915 4.80891C78.9915 4.42053 78.8537 4.11711 78.5779 3.89864C78.3021 3.66804 77.9 3.55274 77.3715 3.55274H70.4086ZM77.4749 11.5085C77.9919 11.5085 78.3941 11.3932 78.6813 11.1626C78.9686 10.932 79.1122 10.6043 79.1122 10.1795C79.1122 9.79114 78.9686 9.47558 78.6813 9.23284C78.4056 8.9901 78.0034 8.86873 77.4749 8.86873H70.4086V11.5085H77.4749Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M56.5077 14.2575C56.3813 14.2575 56.3181 14.1908 56.3181 14.0573V3.55274H50.0275C49.9011 3.55274 49.8379 3.48598 49.8379 3.35247V1.00397C49.8379 0.870464 49.9011 0.803711 50.0275 0.803711H65.6077C65.734 0.803711 65.7972 0.870464 65.7972 1.00397V3.35247C65.7972 3.48598 65.734 3.55274 65.6077 3.55274H59.3342V14.0573C59.3342 14.1908 59.271 14.2575 59.1446 14.2575H56.5077Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M41.5049 14.5317H40.5397C38.2877 14.5317 36.4723 13.8885 35.0936 12.602C33.7148 11.3033 33.0254 9.6102 33.0254 7.52264C33.0254 5.43508 33.7148 3.74804 35.0936 2.46152C36.4838 1.175 38.2992 0.531738 40.5397 0.531738H41.5049C43.7569 0.531738 45.5665 1.175 46.9338 2.46152C48.3011 3.7359 48.9847 5.42294 48.9847 7.52264C48.9732 9.59806 48.2781 11.2851 46.8993 12.5838C45.5206 13.8824 43.7224 14.5317 41.5049 14.5317ZM41.367 11.5096C42.7458 11.5096 43.8373 11.1516 44.6416 10.4355C45.4459 9.70729 45.8423 8.73633 45.8308 7.52264C45.8308 6.30894 45.4286 5.34405 44.6244 4.62797C43.8316 3.89975 42.7458 3.53564 41.367 3.53564H40.6604C39.2701 3.53564 38.1728 3.89975 37.3685 4.62797C36.5757 5.34405 36.1793 6.30894 36.1793 7.52264C36.1793 8.73633 36.5757 9.70729 37.3685 10.4355C38.1728 11.1516 39.2701 11.5096 40.6604 11.5096H41.367Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M24.6904 14.5317H23.7253C21.4733 14.5317 19.6579 13.8885 18.2791 12.602C16.9003 11.3033 16.2109 9.6102 16.2109 7.52264C16.2109 5.43508 16.9003 3.74804 18.2791 2.46152C19.6694 1.175 21.4848 0.531738 23.7253 0.531738H24.6904C26.9424 0.531738 28.7521 1.175 30.1194 2.46152C31.4866 3.7359 32.1703 5.42294 32.1703 7.52264C32.1588 9.59806 31.4637 11.2851 30.0849 12.5838C28.7061 13.8824 26.9079 14.5317 24.6904 14.5317ZM24.5525 11.5096C25.9313 11.5096 27.0228 11.1516 27.8271 10.4355C28.6314 9.70729 29.0278 8.73633 29.0163 7.52264C29.0163 6.30894 28.6142 5.34405 27.8099 4.62797C27.0171 3.89975 25.9313 3.53564 24.5525 3.53564H23.8459C22.4556 3.53564 21.3584 3.89975 20.5541 4.62797C19.7613 5.34405 19.3649 6.30894 19.3649 7.52264C19.3649 8.73633 19.7613 9.70729 20.5541 10.4355C21.3584 11.1516 22.4556 11.5096 23.8459 11.5096H24.5525Z"
                                fill="#F6F6F6"
                            />
                            <path
                                d="M0.189582 14.2575C0.0631939 14.2575 0 14.1908 0 14.0573V1.00397C0 0.870464 0.0631939 0.803711 0.189582 0.803711H14.8218C14.9482 0.803711 15.0114 0.870464 15.0114 1.00397V3.35247C15.0114 3.48598 14.9482 3.55274 14.8218 3.55274H3.01607V6.39279H13.0122C13.1386 6.39279 13.2018 6.46561 13.2018 6.61125V8.94155C13.2018 9.07506 13.1386 9.14181 13.0122 9.14181H3.01607V14.0573C3.01607 14.1908 2.95288 14.2575 2.82649 14.2575H0.189582Z"
                                fill="#F6F6F6"
                            />
                        </svg>
                        <div className="payments-list">
                            <Image
                                src="/image/visa.png"
                                alt="Visa"
                                width={40}
                                height={22}
                                quality={100}
                            />
                            <Image
                                src="/image/mastercard.png"
                                alt="Mastercard"
                                width={40}
                                height={22}
                                quality={100}
                            />
                            <Image
                                src="/image/googlepay.png"
                                alt="Google Pay"
                                width={40}
                                height={22}
                                quality={100}
                            />
                            <Image
                                src="/image/applepay.png"
                                alt="Apple Pay"
                                width={40}
                                height={22}
                                quality={100}
                            />
                        </div>
                        <div className="contact">
                            <span className="footer-title">
                                {translations[locale].menu.contact}
                            </span>
                            {contact?.address ? contact?.address_link ? (
                                <a className='footer-address' href={contact?.address_link}>{contact?.address}</a>
                            ) : <span className='footer-address'>{contact?.address}</span> : ''}
                            {contact?.phone1 && (
                                <Link
                                    href={'tel:+' + contact.phone1.replace(/\D/g, '')}
                                    className="footer-link"
                                >
                                    {contact.phone1}
                                </Link>
                            )}
                            {contact?.phone2 && (
                                <Link
                                    href={'tel:+' + contact.phone2.replace(/\D/g, '')}
                                    className="footer-link"
                                >
                                    {contact.phone2}
                                </Link>
                            )}
                            {contact?.email && (
                                <Link
                                    href={'mailto:' + contact.email}
                                    className="footer-link"
                                >
                                    {contact.email}
                                </Link>
                            )}
                        </div>
                    </div>
                    <nav className="center footer__menu">
                        <div className="footer__menu--box">
                            <span
                                className={`footer-title ${isOpen1 ? 'active' : ''}`}
                                onClick={() => toggleTabs(isOpen1, setIsOpen1)}
                            >
                                {translations[locale].menu.info}
                            </span>
                            <ul
                                className={loader ? 'loader-footer' : ''}
                                style={
                                    isOpen1
                                        ? { display: 'block' }
                                        : { display: 'none' }
                                }
                            >
                                <li>
                                    <Link
                                        className="footer__menu--link footer-link"
                                        href={getLangSlug(locale) + '/about-us'}
                                    >
                                        {translations[locale].menu.aboutUs}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="footer__menu--link footer-link"
                                        href={
                                            getLangSlug(locale) +
                                            '/delivery-payment'
                                        }
                                    >
                                        {
                                            translations[locale].menu
                                                .deliveryPayment
                                        }
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="footer__menu--link footer-link"
                                        href={
                                            getLangSlug(locale) +
                                            '/dropshippings'
                                        }
                                    >
                                        {
                                            translations[locale].menu
                                                .dropshippings
                                        }
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="footer__menu--link footer-link"
                                        href={getLangSlug(locale) + '/brands'}
                                    >
                                        {translations[locale].menu.brands}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="footer__menu--link footer-link"
                                        href={getLangSlug(locale) + '/blogs'}
                                    >
                                        {translations[locale].menu.blogs}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="footer__menu--link footer-link"
                                        href={getLangSlug(locale) + '/career'}
                                    >
                                        {translations[locale].menu.career}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={
                                            getLangSlug(locale) +
                                            '/contact'
                                        }
                                        className="footer__menu--link footer-link"
                                    >
                                        {
                                            translations[locale].menu
                                                .contact
                                        }
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer__menu--box">
                            {categories.length ? (
                                <>
                                    <span
                                        className={`footer-title ${isOpen2 ? 'active' : ''}`}
                                        onClick={() =>
                                            toggleTabs(isOpen2, setIsOpen2)
                                        }
                                    >
                                        {translations[locale].menu.catalog}
                                    </span>
                                    <ul
                                        className={
                                            loader ? 'loader-footer' : ''
                                        }
                                        style={
                                            isOpen2
                                                ? { display: 'block' }
                                                : { display: 'none' }
                                        }
                                    >
                                        {categories.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={
                                                        getLangSlug(locale) +
                                                        '/shop/' +
                                                        item.slug
                                                    }
                                                    className="footer__menu--link footer-link"
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>

                                        ))}
                                    </ul>
                                </>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="footer__menu--box">
                            <span
                                className={`footer-title ${isOpen3 ? 'active' : ''}`}
                                onClick={() => toggleTabs(isOpen3, setIsOpen3)}
                            >
                                {translations[locale].menu.lk}
                            </span>
                            <ul
                                className={loader ? 'loader-footer' : ''}
                                style={
                                    isOpen3
                                        ? { display: 'block' }
                                        : { display: 'none' }
                                }
                            >
                                {sessionUser?.user.id ? (
                                    <>
                                        <li>
                                            <Link
                                                href={
                                                    getLangSlug(locale) +
                                                    '/profile'
                                                }
                                                className="footer__menu--link footer-link"
                                            >
                                                {
                                                    translations[locale].menu
                                                        .profile
                                                }
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={
                                                    getLangSlug(locale) +
                                                    '/profile/history'
                                                }
                                                className="footer__menu--link footer-link"
                                            >
                                                {
                                                    translations[locale].menu
                                                        .history
                                                }
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={
                                                    getLangSlug(locale) +
                                                    '/profile/wish-list'
                                                }
                                                className="footer__menu--link footer-link"
                                            >
                                                {
                                                    translations[locale].menu
                                                        .wishList
                                                }
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                href={
                                                    getLangSlug(locale) +
                                                    '/auth'
                                                }
                                                className="footer__menu--link footer-link"
                                            >
                                                {translations[locale].menu.auth}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={
                                                    getLangSlug(locale) +
                                                    '/auth/register'
                                                }
                                                className="footer__menu--link footer-link"
                                            >
                                                {
                                                    translations[locale].menu
                                                        .register
                                                }
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div className="footer__menu--box">
                            <span
                                className={`footer-title ${isOpen4 ? 'active' : ''}`}
                                onClick={() => toggleTabs(isOpen4, setIsOpen4)}
                            >
                                {translations[locale].menu.social}
                            </span>
                            <ul
                                className={loader ? 'loader-footer' : ''}
                                style={
                                    isOpen4
                                        ? { display: 'block' }
                                        : { display: 'none' }
                                }
                            >
                                {contact?.link_facebook && (
                                    <li>
                                        <Link
                                            rel="noindex, nofollow"
                                            href={contact.link_facebook}
                                            className="footer__menu--link footer-link"
                                        >
                                            Facebook
                                        </Link>
                                    </li>
                                )}
                                {contact?.link_youtube && (
                                    <li>
                                        <Link
                                            rel="noindex, nofollow"
                                            href={contact.link_youtube}
                                            className="footer__menu--link footer-link"
                                        >
                                            YouTube
                                        </Link>
                                    </li>
                                )}
                                {contact?.link_instagram && (
                                    <li>
                                        <Link
                                            rel="noindex, nofollow"
                                            href={contact.link_instagram}
                                            className="footer__menu--link footer-link"
                                        >
                                            Instagram
                                        </Link>
                                    </li>
                                )}
                                {contact?.link_telegram && (
                                    <li>
                                        <Link
                                            rel="noindex, nofollow"
                                            href={contact.link_telegram}
                                            className="footer__menu--link footer-link"
                                        >
                                            Telegram
                                        </Link>
                                    </li>
                                )}
                                {contact?.link_viber && (
                                    <li>
                                        <Link
                                            rel="noindex, nofollow"
                                            href={contact.link_viber}
                                            className="footer__menu--link footer-link"
                                        >
                                            Viber
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                    <SubscriptionsBox locale={locale} />
                </div>
            </div>
            <div className="bottom">
                <div className="box-content">
                    <div>
                        <Link href={getLangSlug(locale) + '/offer-contract'}>
                            {translations[locale].menu.offerContract}
                        </Link>
                        <Link href={getLangSlug(locale) + '/privacy-policy'}>
                            {translations[locale].menu.privacyPolicy}
                        </Link>
                    </div>
                    <span>
                        ©2020-{currentYear}{' '}
                        {translations[locale].system.footerInfo}
                    </span>
                </div>
            </div>
        </footer>
    )
})

Footer.displayName = 'Footer';

export default Footer
