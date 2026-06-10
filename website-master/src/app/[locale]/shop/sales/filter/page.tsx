import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { redirect } from 'next/navigation'

const ShopPage = ({
    params,
}: {
    params: { locale: AllowedLangs }
}) => {
    redirect(getLangSlug(params.locale) + '/shop/sales')
}

export default ShopPage
