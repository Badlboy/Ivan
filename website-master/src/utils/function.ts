import { AllowedLangs } from '@/constants/lang'
import {
    IVariation,
    PropertiesList,
    PropertiesListFilter,
} from '@/models/IProduct'
import pagesService from '@/services/pagesService'

export function formatNumber(value: string) {
    const formatted = parseFloat(value).toFixed(2)
    return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted
}

export function calculatePercentageChange(
    oldPrice: string,
    newPrice: string
): number {
    const oldPriceNumber = parseFloat(oldPrice)
    const newPriceNumber = parseFloat(newPrice)

    if (
        isNaN(oldPriceNumber) ||
        isNaN(newPriceNumber) ||
        oldPriceNumber === 0
    ) {
        return 0
    }

    const percentageChange =
        ((oldPriceNumber - newPriceNumber) / oldPriceNumber) * 100
    return Math.round(percentageChange)
}

// -----------
export function getPropertyProduct(variations: IVariation[]): PropertiesList[] {
    const groupedProperties: { [key: number]: PropertiesList } = {}

    variations.forEach((variation) => {
        variation.properties.forEach((property: PropertiesList) => {
            const propertyId = property.property.id
            if (!groupedProperties[propertyId]) {
                groupedProperties[propertyId] = {
                    property: property.property,
                    values: [],
                }
            }

            property.values.forEach((value) => {
                let existingValue = groupedProperties[propertyId].values.find(
                    (v) => v.id === value.id
                )

                if (!existingValue) {
                    existingValue = {
                        id: value.id,
                        variation: [variation.id],
                        dop: value.dop,
                        name: value.name,
                        textUrl: value.textUrl,
                        isDisabled: variation.quantity > 0 ? true : false,
                    }
                    groupedProperties[propertyId].values.push(existingValue)
                } else {
                    if (!existingValue?.variation?.includes(variation.id)) {
                        existingValue?.variation?.push(variation.id)
                    }
                }
            })
        })
    })
    return Object.values(groupedProperties)
}

export function getLangSlug(lang: AllowedLangs) {
    if (lang == 'uk') {
        return ''
    }
    return '/' + lang
}
export function getNoPhotoLangs(lang: AllowedLangs) {
    if (lang == 'uk') {
        return `/image/no-photo.png`
    }
    return `/image/no-photo${lang}.png`
}

export const updateLastUrlSegment = (url: string, newSegment: string) => {
    const urlParts = url.split('/')
    urlParts[urlParts.length - 1] = newSegment

    return urlParts.join('/')
}

export const generateQueryString = (selectedProperties: {
    color: string | undefined
    size: string | undefined
}) => {
    const params = new URLSearchParams()

    if (selectedProperties.color) {
        params.set('color', selectedProperties.color)
    }
    if (selectedProperties.size) {
        params.set('size', selectedProperties.size)
    }

    return params.toString() ? `?${params.toString()}` : ''
}

export const findVariation = (
    variations: IVariation[],
    code: string
): IVariation => {
    // Попытка найти вариацию, которая соответствует и цвету, и размеру
    const matchingVariation = variations.find((variation) => {
        if (variation.code == code) {
            return true
        }

        return false
    })

    // Если нашли подходящую вариацию, возвращаем её, иначе первую
    return matchingVariation || variations[0]
}

export function hasText(input: string): boolean {
    const text = input.replace(/<\/?[^>]+(>|$)/g, '').trim()
    return text.length > 0
}

export const stringifyFilters = (
    filterObject: Record<string, string[]>
): string => {
    const pairs: string[] = []

    for (const [key, values] of Object.entries(filterObject)) {
        const valueString = values.join(',')
        pairs.push(`${key}=${valueString}`)
    }
    return pairs.join(';')
}
export const parseFilters = (str: string) => {
    const filterObject: Record<string, string[]> = {}
    const pairs = str.split(';')
    pairs.forEach((pair) => {
        const [key, valueString] = pair.split('=')
        if (key && valueString) {
            const valueArray = valueString.split(',')
            filterObject[key] = valueArray
        }
    })

    return filterObject
}

export function validateObject(
    obj: Record<number, number[]>,
    ids: {
        id: number
        name: string
        textUrl: string
    }[]
): boolean {
    const totalItems = Object.keys(obj).length + (ids.length > 0 ? 1 : 0)
    if (totalItems > 2) {
        return false
    }
    if (ids.length > 1) {
        return false
    }
    for (let values of Object.values(obj)) {
        if (values.length > 1) {
            return false
        }
    }

    return true
}

export const getIdMappings = (
    data: PropertiesListFilter[],
    filters: Record<string, string[]>
) => {
    const result: Record<number, number[]> = {}

    const cleanValue = (value: string) => {
        return value
            .replace(/ /g, '-')
            .replace(/,/g, '')
            .replace(/;/g, '')
            .replace(/\//g, '')
            .replace(/\\/g, '')
    }
    for (const [filterKey, filterValues] of Object.entries(filters)) {
        const property = data?.find((p) => p.textUrl === filterKey)
        if (property) {
            const valueIds = property.values
                .filter((value) =>
                    filterValues.map(cleanValue).includes(value.textUrl)
                )
                .map((value) => value.id)

            if (valueIds.length) {
                result[property.id] = valueIds
            }
        }
    }

    return result
}

export const reverseGetIdMappings = (
    data: PropertiesListFilter[],
    result: Record<number, number[]>
): Record<string, string[]> => {
    const reversed: Record<string, string[]> = {}

    // Создаем карту, чтобы быстро находить текстовые URL для значений по их ID
    const valueMap: Record<number, string> = {}
    data.forEach((property) => {
        property.values.forEach((value) => {
            valueMap[value.id] = value.textUrl // Замените на нужное свойство, если требуется
        })
    })

    for (const [propertyId, valueIds] of Object.entries(result)) {
        const property = data.find((p) => p.id === Number(propertyId))
        if (property) {
            // Для каждого ID значения ищем соответствующий текстовый URL
            const filteredValues = valueIds
                .map((valueId) => valueMap[valueId]) // Получаем текстовые URL для каждого ID значения
                .filter(Boolean) // Убираем неопределенные значения

            if (filteredValues.length) {
                // Добавляем в результирующий объект
                reversed[property.textUrl] = filteredValues // Используем textUrl как ключ
            }
        }
    }

    return reversed
}

function replacePlaceholders(
    template: string,
    title: string,
    category: string,
    price: string
) {
    return template
        .replace('{title}', title)
        .replace('{category}', category)
        .replace('{price}', price)
}
export const fetchSEOTitleOrDescription = async ({
    category = '',
    title = '',
    price = '',
    lang = AllowedLangs.UK,
    type = 'page',
}: {
    category?: string
    price?: string
    lang?: AllowedLangs
    title?: string
    type?: 'page' | 'product' | 'catalog'
}) => {
    const template = (await pagesService.fetchSEOTagsTemplate(lang)).data.data
    let title_seo = ''
    let description_seo = ''

    if (type == 'product') {
        title_seo = replacePlaceholders(
            template.meta_title_template_1,
            title,
            category,
            price
        )
        description_seo = replacePlaceholders(
            template.meta_description_template_1,
            title,
            category,
            price
        )
    } else if (type == 'catalog') {
        title_seo = replacePlaceholders(
            template.meta_title_template_3,
            title,
            category,
            price
        )
        description_seo = replacePlaceholders(
            template.meta_description_template_3,
            title,
            category,
            price
        )
    } else {
        title_seo = replacePlaceholders(
            template.meta_title_template_2,
            title,
            category,
            price
        )
        description_seo = replacePlaceholders(
            template.meta_description_template_2,
            title,
            category,
            price
        )
    }

    return {
        title_seo,
        description_seo,
    }
}
