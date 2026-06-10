import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

interface EmptyBasketProps {
    className?: string
    locale: AllowedLangs
}

export const EmptyBasket = (props: EmptyBasketProps) => {
    const { className, locale } = props
    const { translations } = useLang()
    return (
        <span className="title-section text-h1 center empty-title">
            {translations[locale].order.other.empty}
        </span>
    )
}
