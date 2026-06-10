export interface IPromocodDetail {
    data: IPromocod
}
export interface IPromocod {
    id: number
    code: string
    discount_amount: number
    created_at: string
    updated_at: string
}
