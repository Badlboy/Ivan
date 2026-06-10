'use client'
import ProductCard from '@/components/Card/ProductCard'
import Loader from '@/components/Loader'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IProdust } from '@/models/IProduct'
import authService from '@/services/authService'
import React, { useEffect, useState } from 'react'

const ProfileWishList = ({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState<IProdust[]>([])

    async function fetchData() {
        try {
            const response = await authService.getFavorite()
            setFavorites(response.data.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="section-personal-area__order-history">
                <Loader />
            </div>
        )
    }

    if (favorites.length) {
        return (
            <div className="section-personal-area__wish-list">
                {favorites?.map((product) => (
                    <ProductCard
                        locale={locale}
                        favorites={[product.id]}
                        key={product.id}
                        {...product}
                        fetchFavorites={fetchData}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="section-personal-area__order-history">
            <span className="title-section text-h1 center">
                {translations[locale].profile.empty_favorite}
            </span>
        </div>
    )
}

export default ProfileWishList
