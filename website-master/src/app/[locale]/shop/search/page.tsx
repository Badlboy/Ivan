import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { ISearch } from '@/models/IProduct'
import productsService from '@/services/productService'
import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../../../public/translations/translations.json'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import SearchPage from '@/template/Search'

interface IPage {
    page: string
    q: string
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: IPage
}) {
    const page = searchParams.page || '1'
    const q = searchParams.q
    const locale = AllowedLangs.UK
    return {
        title:
            translationsJson[locale].page.search.title +
            ' ' +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].page.search.title +
            ' ' +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop?q=' + q,
            languages: {
                uk: SITE_URL + '/shop/search?q=' + q,
                ru: SITE_URL + '/ru/shop/search?q=' + q,
                en: SITE_URL + '/en/shop/search?q=' + q,
            },
        },
        robots: {
            index: false,
            follow: false,
        },
    }
}
const elementPerPage = 12;
const ShopPage = async ({
    searchParams,
    params,
}: {
    searchParams: IPage
    params: { locale: AllowedLangs }
}) => {
    const session = await getServerSession(authConfig);
    const locale = params.locale
    const {page = '1'} = searchParams;
    const data = await fetchDataSearch(searchParams.q ?? '', locale,page);
    
    return <SearchPage 
        data={data}
        elementPerPage={elementPerPage}
        locale={locale}
        page={Number(page)}
        session={session}
        q={searchParams.q}
    />
}

const fetchDataSearch = async (
    name: string,
    locale: AllowedLangs,
    page:string
): Promise<ISearch> => {
    try {
        const response = await productsService.fetchProductSearch(name, locale,elementPerPage,Number(page))
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {data:[],count:1}
}

export default ShopPage
