import Link from 'next/link'
import Image from 'next/image'
import { ICategories } from '@/models/ICategories'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug, getNoPhotoLangs } from '@/utils/function'
import { useLang } from '@/hooks/useLang'

const CatalogCategories = ({
    categories,
    locale,
}: {
    categories: ICategories[]
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    if (categories.length == 0) {
        return ''
    }
    return (
        <section className="category-list">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={getLangSlug(locale) + '/shop/' + category.slug}
                >
                    <span className="title">{category.title}</span>
                    <Image
                        src={
                            category.image
                                ? API_URL_IMAGE + category.image
                                : getNoPhotoLangs(locale)
                        }
                        title={category.title}
                        alt={category.title + ' - #1'}
                        width={200}
                        height={126}
                        quality={100}
                    />
                </Link>
            ))}
            <Link href={getLangSlug(locale) + '/shop/sales'}>
                <span className="title">{translations[locale].menu.sales}</span>
                <Image
                    src={'/image/sales.png'}
                    title={translations[locale].menu.sales}
                    alt={translations[locale].menu.sales + ' - #1'}
                    width={200}
                    height={126}
                    quality={100}
                />
            </Link>
        </section>
    )
}

export default CatalogCategories
