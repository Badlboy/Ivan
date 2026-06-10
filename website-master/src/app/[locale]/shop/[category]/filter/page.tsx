import { AllowedLangs } from '@/constants/lang'
import { SITE_URL } from '@/http/axiosConfig'
import { getLangSlug } from '@/utils/function'
import { redirect } from 'next/navigation'

interface IPage {
    category: string | undefined | null,
    locale: AllowedLangs
}
const ShopPage = ({ params }: { params: IPage }) => {
    redirect(getLangSlug(params.locale) + '/shop/' + params.category)
}

export default ShopPage
