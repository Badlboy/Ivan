import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBrand } from '@/models/IBrand'
import { ICategoriesLittle } from '@/models/ICategories'
import { getLangSlug } from '@/utils/function'
import Image from 'next/image'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import Link from 'next/link'

const HeaderModal = ({
    menus,
    locale,
    brands,
}: {
    menus: ICategoriesLittle
    locale: AllowedLangs
    brands: IBrand[]
}) => {
    const { translations } = useLang()

    const renderMenuLinks = (menu: ICategoriesLittle) => (
        <ul key={menu.id}>
            <li className="menu-title" itemProp="name">
                <Link itemProp="url" href={`${getLangSlug(locale)}/shop/${menu.slug}`}>
                    {menu.title}
                </Link>
            </li>
            {menu.children?.map((submenu) => (
                <li key={submenu.id} itemProp="name">
                    <Link itemProp="url" href={`${getLangSlug(locale)}/shop/${submenu.slug}`}>
                        {submenu.title}
                    </Link>
                </li>
            ))}
        </ul>
    )

    const renderBrandLinks = () => (
        <div className="info brands">
            <span className="menu-title">{translations[locale].menu.brands}</span>
            <ul>
                {brands.map((item, index) => (
                    <li key={item.id}>
                        <Link href={`${getLangSlug(locale)}/brands/${item.slug}`}>
                            <Image
                                src={API_URL_IMAGE + item.image}
                                title={item.title}
                                alt={`${item.title} - #${index}`}
                                width={55}
                                quality={100}
                                height={21}
                                layout="responsive"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div className="header-modal-menu noactive">
            <div className="top box-content">
                <nav className="menu">
                    <ul>
                        <li itemProp="name" className="menu-title">
                            <Link itemProp="url" href={`${getLangSlug(locale)}/shop/${menus.slug}`}>
                                {translations[locale].menu.recommend}
                            </Link>
                        </li>
                        <li itemProp="name">
                            <a itemProp="url" href={`${getLangSlug(locale)}/shop/${menus.slug}?sort=newest`}>
                                {translations[locale].menu.news}
                            </a>
                        </li>
                        <li itemProp="name">
                            <a itemProp="url" href={`${getLangSlug(locale)}/shop/${menus.slug}?sort=hits`}>
                                {translations[locale].main.title_hit}
                            </a>
                        </li>
                        <li itemProp="name" className="red">
                            <Link itemProp="url" href={`${getLangSlug(locale)}/shop/${menus.slug}?sales=sales`}>
                                {translations[locale].menu.sales}
                            </Link>
                        </li>
                    </ul>
                    {menus?.children?.map(renderMenuLinks)}
                </nav>
                {brands.length > 0 && renderBrandLinks()}
            </div>
            <div className="bottom"></div>
        </div>
    )
}

export default HeaderModal
