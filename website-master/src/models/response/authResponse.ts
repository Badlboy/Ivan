import { IUser } from '../IUser'

export interface authResponse {
    access_token: string
    data: IUser
}
