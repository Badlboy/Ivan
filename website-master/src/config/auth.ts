import axios, { AxiosError } from 'axios'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import authService from '@/services/authService'
import { API_URL_API } from '@/http/axiosConfig'
import { AllowedLangs } from '@/constants/lang'

export enum ProvidersEnum {
    SingIn = 'SingIn',
    SingOut = 'SingOut',
}

export const authConfig = {
    providers: [
        CredentialsProvider({
            id: ProvidersEnum.SingIn,
            name: ProvidersEnum.SingIn,
            credentials: {
                email: {
                    label: 'Електронна пошта',
                    type: 'text',
                    placeholder: 'Електронна пошта',
                },
                password: { label: 'Пароль', type: 'password' },
                lang: { label: 'Мова', type: 'text' },
            },
            async authorize(credentials, req) {
                const { email, password, lang } = credentials as {
                    email: string
                    password: string
                    lang: AllowedLangs
                }
                try {
                    const res = await authService.auth(email, password, lang)
                    if (res.data.data) {
                        return {
                            ...res.data.data,
                            access_token: res.data.access_token,
                        }
                    }
                } catch (error) {
                    if (error instanceof AxiosError && error.response) {
                        const errorMessage =
                            error.response.data?.message ||
                            error.response.data?.error ||
                            'Unknown error occurred'
                        console.error('Error message:', errorMessage)
                        throw new Error(errorMessage)
                    }
                    throw error
                }
                return null
            },
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/auth',
        signOut: '/auth',
        error: '/auth',
        verifyRequest: '/auth',
        newUser: '/auth',
    },
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account?.provider === 'google') {
                try {
                    const response = await axios.post(
                        API_URL_API + '/auth/google/callback',
                        {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            scope: account.scope,
                            token_type: account.token_type,
                            id_token: account.id_token,
                        }
                    )

                    account.backendData = {
                        ...response.data.data,
                        access_token: response?.data.access_token,
                    }
                    return true
                } catch (error) {
                    console.error('Error sending data to backend:', error)
                    return false
                }
            }
            if (account?.provider === 'facebook') {
                try {
                    const response = await axios.post(
                        API_URL_API + '/auth/facebook/callback',
                        {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                        }
                    )

                    account.backendData = {
                        ...response.data.data,
                        access_token: response?.data.access_token,
                    }
                    return true
                } catch (error) {
                    console.error('Error sending data to backend:', error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, data, account, session, trigger }: any) {
            if (trigger == 'update') {
                if (session && session?.user?.id) {
                    token.id = session.user.id
                    token.name = session.user.name
                    token.last_name = session.user.last_name
                    token.email = session.user.email
                    token.phone = session.user.phone
                    token.avatar = session.user.avatar
                    token.access_token = session.access_token
                    token.favorites = session.user?.favorites ?? []
                }
            }
            if (session) {
                token.id = session.user?.id ?? 0
                token.name = session.user?.name ?? ''
                token.last_name = session.user?.last_name ?? ''
                token.email = session.user?.email ?? ''
                token.phone = session.user?.phone ?? ''
                token.avatar = session.user?.avatar ?? ''
                token.access_token = session.access_token ?? ''
                token.favorites = session.user?.favorites ?? []
            }

            if (user) {
                token.id = user.id
                token.name = user.name
                token.last_name = user.last_name
                token.email = user.email
                token.phone = user.phone
                token.avatar = user.avatar
                token.access_token = user.access_token
                token.favorites = user?.favorites ?? []
            }
            if (account?.provider === 'google') {
                token.id = account.backendData.id
                token.name = account.backendData.name
                token.last_name = account.backendData.last_name
                token.email = account.backendData.email
                token.phone = account.backendData.phone
                token.avatar = account.backendData.avatar
                token.favorites = account.backendData?.favorites ?? []
                token.access_token = account.backendData.access_token
            }
            if (account?.provider === 'facebook') {
                token.id = account.backendData.id
                token.name = account.backendData.name
                token.last_name = account.backendData.last_name
                token.email = account.backendData.email
                token.phone = account.backendData.phone
                token.avatar = account.backendData.avatar
                token.favorites = account.backendData?.favorites ?? []
                token.access_token = account.backendData.access_token
            }
            return token
        },
        async session({ session, token, trigger }: any) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.last_name = token.last_name
            session.user.email = token.email
            session.user.avatar = token.avatar
            session.user.phone = token.phone
            session.access_token = token.access_token
            session.user.favorites = token?.favorites ?? []
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 60 * 60 * 24,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true,
        maxAge: 60 * 60 * 24,
    },
}

export default authConfig
