import axios from 'axios'
import { authResponse } from '../models/response/authResponse'
import { getCsrfToken, getSession, signOut } from 'next-auth/react'

export const WEBSITE_HOST_URL = process.env.SITE_URL || 'http://localhost:3000'
export const API_URL_API = process.env.NEXT_PUBLIC_API_URL_API
export const API_URL_IMAGE = process.env.NEXT_PUBLIC_API_URL_IMAGE

export const SITE_URL = process.env.SITE_URL

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

$api.interceptors.request.use(async (config) => {
    const session = await getSession()
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
})

$api.interceptors.response.use(
    (config) => {
        return config
    },
    async (error) => {
        const originalRequest = error.config
        if (
            error.response?.status == 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true
            try {
                const session = await getSession()
                const response = await axios.get<authResponse>(
                    `${API_URL_API}/auth/refresh`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                        },
                    }
                )

                const csrf = await getCsrfToken()
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            user: response.data.data,
                            access_token: response?.data.access_token,
                        },
                        csrfToken: csrf,
                    }),
                })

                return $api.request(originalRequest)
            } catch (refreshError) {
                console.error('User not authorized', refreshError)
                if (
                    error.response.request.path != '/api/v1/auth/login' &&
                    error.response.request.path != '/api/v1/auth/register'
                ) {
                    await signOut({
                        redirect: true,
                        callbackUrl: '/',
                    })
                }
            }
        }
        throw error
    }
)
export default $api
