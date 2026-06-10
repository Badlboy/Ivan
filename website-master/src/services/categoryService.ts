import { AxiosResponse } from 'axios'
import $api from '@/http/axiosConfig'
import {
    ICategoriesDetail,
    ICategoriesList,
    ICategoriesLittleList,
    ICategorySEO,
} from '@/models/ICategories'
import { AllowedLangs } from '@/constants/lang'

export default class categoryService {
    static fetchCategories(
        category: string | undefined | null = '',
        type: string = '',
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ICategoriesList>> {
        return $api.get<ICategoriesList>(
            `/categories?category=${category}&type=${type}&lang=${locale}`
        )
    }

    static fetchCategoriesLittle(
        type: string = '',
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ICategoriesLittleList>> {
        return $api.get<ICategoriesLittleList>(
            `/categories?type=${type}&lang=${locale}`
        )
    }

    static fetchCategoryOne(
        id: string | undefined | null,
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<ICategoriesDetail>> {
        return $api.get<ICategoriesDetail>(
            '/categories/' + id + '?lang=' + locale + '&seo=' + seo
        )
    }

    static fetchCategorySEO(
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ICategorySEO>> {
        return $api.get<ICategorySEO>(`/pages/catalog?lang=${locale}`)
    }
}
