import { AxiosResponse } from 'axios'
import $api from '@/http/axiosConfig'
import { IBlogDetail, IBlogList } from '@/models/IBlog'
import { AllowedLangs } from '@/constants/lang'

export default class blogsService {
    static fetchBlogs(
        page: string = '',
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<IBlogList>> {
        return $api.get<IBlogList>(`/blogs?page=${page}&lang=${locale}`)
    }
    static fetchBlog(
        slug: string | undefined | null,
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<IBlogDetail>> {
        return $api.get<IBlogDetail>(
            '/blogs/' + slug + '?lang=' + locale + '&seo=' + seo
        )
    }
}
