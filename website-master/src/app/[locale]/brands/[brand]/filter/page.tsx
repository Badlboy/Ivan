import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { redirect } from 'next/navigation'

const ShopPage = async ({
    params,
}: {
    params: { locale: AllowedLangs, brand: string | undefined | null }
}) => {
    redirect(getLangSlug(params.locale) + '/brands/' + params.brand)
}

export default ShopPage
