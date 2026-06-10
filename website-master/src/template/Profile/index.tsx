'use client'
import { IUser, IUserAddress } from '@/models/IUser'
import FormProfileInfo from '@/components/Form/FormProfileInfo'
import { useEffect, useState } from 'react'
import authService from '@/services/authService'
import Loader from '@/components/Loader'
import FormChangePassword from '@/components/Form/FormChangePassword'
import FormAdrress from '@/components/Form/FormAdrress'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const Profile = ({ locale, isMain = false }: { locale: AllowedLangs, isMain?: boolean }) => {
    const { translations } = useLang()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<IUser>({} as IUser)
    const [address, setAddress] = useState<IUserAddress[]>([])

    async function fetchData() {
        try {
            const response = await authService.fetchUser()
            setUser(response.data.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }
    async function fetchAddressData() {
        try {
            const response = await authService.getUserAddress()
            setAddress(response.data.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchAddressData()
        fetchData()
    }, [])

    return (
        <div className={"section-personal-area__info-user" + (isMain ? ' main' : '')}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="input-box">
                        <span className="title-section">
                            {translations[locale].breadcrumb.contact}
                        </span>
                        <FormProfileInfo
                            locale={locale}
                            user={user}
                            setUser={setUser}
                        />
                    </div>
                    <FormChangePassword locale={locale} />
                    <FormAdrress
                        locale={locale}
                        address={address}
                        fetchAddressData={fetchAddressData}
                    />
                </>
            )}
        </div>
    )
}

export default Profile
