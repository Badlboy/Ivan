import { IUser } from '@/models/IUser'
import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: IUser
        access_token: string
    }
}
