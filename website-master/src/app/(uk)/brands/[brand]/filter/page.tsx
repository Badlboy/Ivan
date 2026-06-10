import { redirect } from 'next/navigation'

const ShopPage = async ({
    params,
}: {
    params: { brand: string | undefined | null }
}) => {
    redirect('/brands/' + params.brand)
}

export default ShopPage
