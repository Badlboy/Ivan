import { SITE_URL } from '@/http/axiosConfig'
import { getLangSlug } from '@/utils/function'
import { redirect } from 'next/navigation'
interface IPage {
    category: string | undefined | null
}
const ShopPage = ({ params }: { params: IPage }) => {
    redirect(`${SITE_URL}/shop${params.category}`)
}

export default ShopPage
