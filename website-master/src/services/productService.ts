import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import $api from '@/http/axiosConfig'
import {
    IFilterCountData,
    IProdustBasketData,
    IProdustDetail,
    IProdustsList,
    ISearch,
    ISizeTableData,
    PropertiesCount,
    PropertiesListFilterData,
} from '../models/IProduct'
import { AllowedLangs } from '@/constants/lang'
import { ResponseSolo } from '@/models/response/soloResponse'

type CartItem = {
    product_id: number
    variationId: number
    quantity: number
}

interface ProductQuantity {
    quantity: any
    data: {
        quantity: number
    }
}

export default class productsService {
    private static cancelTokenSource: CancelTokenSource | null = null

    static fetchProducts(
        page: string = '',
        category: string | null | undefined = '',
        activeFilters: {
            [key: number]: number[]
        } = {},
        priceRange: [number, number] | [],
        brand?: number,
        options?: { signal?: AbortSignal },
        locale: AllowedLangs = AllowedLangs.UK,
        sort: string = '',
        rating: number = 0,
        onlySales: boolean = false,
        brands: number[] = []
    ): Promise<AxiosResponse<IProdustsList>> {
        const { signal } = options || {}
        return $api.get<IProdustsList>(
            `/products?category=${category}&page=${page}&brand_id=${brand ?? ''}&filter=${JSON.stringify(activeFilters)}&min_price=${priceRange[0] ?? ''}&max_price=${priceRange[1] ?? ''}&lang=${locale}&sort=${sort}&rating=${rating}&onlySales=${onlySales}&brands=${JSON.stringify(brands)}`,
            { signal }
        )
    }
    static fetchProductOne(
        slug: string | undefined | null,
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<IProdustDetail>> {
        return $api.get<IProdustDetail>(
            '/products/' + slug + '?lang=' + locale + '&seo=' + seo
        )
    }

    static async fetchProductSearch(
        name: string,
        locale: AllowedLangs = AllowedLangs.UK,
        print: number = 8,
        page:number = 1,
    ): Promise<AxiosResponse<ISearch>> {
        // if (this.cancelTokenSource) {
        //     this.cancelTokenSource.cancel('Отменено новым запросом')
        // }
        // this.cancelTokenSource = axios.CancelToken.source()

        try {
            const response = await $api.get<ISearch>(
                `/products/search/${name}?lang=${locale}&limit=${print}&page=${page}`,
                { cancelToken: this.cancelTokenSource?.token }
            )
            return response
        } finally {
            this.cancelTokenSource = null
        }
    }

    static fetchProductQuantity(
        id: number,
        variation_id: number
    ): Promise<AxiosResponse<ProductQuantity>> {
        return $api.get<ProductQuantity>(
            '/products/' + id + '/quantity?variation=' + variation_id
        )
    }

    static fetchProductBasket(
        items: CartItem[],
        locale: AllowedLangs
    ): Promise<AxiosResponse<IProdustBasketData>> {
        return $api.post<IProdustBasketData>(
            '/products/basket?lang=' + locale,
            { items }
        )
    }

    static fetchPropertyFilter(
        category: string | null | undefined,
        locale: AllowedLangs = AllowedLangs.UK,
        onlySales: boolean = false,
        brand: number = 0
    ): Promise<AxiosResponse<PropertiesListFilterData>> {
        return $api.get<PropertiesListFilterData>(
            '/properties?category=' +
                category +
                '&lang=' +
                locale +
                '&onlySales=' +
                onlySales +
                '&brand=' +
                brand
        )
    }

    static fetchGetCountProductPropertyFilter(
        property_id = 0,
        filterCountData = {} as IFilterCountData,
        isBrand = false
    ): Promise<AxiosResponse<PropertiesCount>> {
        const brandIds = filterCountData.brandsIds?.map((brand) => brand.id)
        return $api.get<PropertiesCount>(
            `/properties/count/${property_id}?category=${filterCountData.category}&brand_id=${filterCountData.brand ?? ''}&filter=${JSON.stringify(filterCountData.filterList)}&min_price=${filterCountData.minprice ?? ''}&max_price=${filterCountData.maxprice ?? ''}&rating=${filterCountData.rating}&onlySales=${filterCountData.onlySales}&brands=${JSON.stringify(brandIds)}&is_brand=${isBrand}`
        )
    }

    static fetchCreateReview(
        product_id: number,
        text: string,
        email: string,
        name: string,
        rating: number
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>('/products/review', {
            product_id,
            email,
            name,
            text,
            rating,
        })
    }

    static fetchSizeTable(
        locale: AllowedLangs,
        categoryId: number
    ): Promise<AxiosResponse<ISizeTableData>> {
        return $api.get<ISizeTableData>(
            `/size-table/get?lang=${locale}&category_id=${categoryId}`
        )
    }
}
