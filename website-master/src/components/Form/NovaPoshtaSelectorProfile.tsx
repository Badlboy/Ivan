import { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'
import React from 'react'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const API_KEY = '3886802c4ecff6a65429cbb2b7508bed'

interface City {
    Ref: string
    Description: string
}

interface Branch {
    Ref: string
    Description: string
}

const NovaPoshtaSelectorProfile = ({
    locale,
    setInitialUserDeliver,
    selectedBranch,
    valueCity,
    setInitialUserCity,
}: {
    locale: AllowedLangs
    selectedBranch: string
    valueCity: string
    setInitialUserDeliver: any
    setInitialUserCity: any
}) => {
    const { translations } = useLang()
    const [city, setCity] = useState<string>('')
    const [cities, setCities] = useState<City[]>([])
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [branches, setBranches] = useState<Branch[]>([])

    useEffect(() => {
        if (city.length > 2 && city != selectedCity?.Description) {
            const fetchCities = async () => {
                try {
                    const response = await axios.post(
                        'https://api.novaposhta.ua/v2.0/json/',
                        {
                            apiKey: API_KEY,
                            modelName: 'Address',
                            calledMethod: 'getCities',
                            methodProperties: {
                                FindByString: city,
                                Language:
                                    locale === 'ru'
                                        ? 'ru'
                                        : locale === 'en'
                                          ? 'en'
                                          : 'ua',
                            },
                        }
                    )
                    setCities(response.data.data)
                } catch (error) {
                    console.error('Ошибка при получении списка городов:', error)
                }
            }
            setInitialUserDeliver('')
            fetchCities()
        } else {
            setCities([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city, locale, selectedCity?.Description])

    useEffect(() => {
        if (selectedCity) {
            const fetchBranches = async () => {
                try {
                    const response = await axios.post(
                        'https://api.novaposhta.ua/v2.0/json/',
                        {
                            apiKey: API_KEY,
                            modelName: 'Address',
                            calledMethod: 'getWarehouses',
                            methodProperties: {
                                CityRef: selectedCity.Ref,
                                Language:
                                    locale === 'ru'
                                        ? 'ru'
                                        : locale === 'en'
                                          ? 'en'
                                          : 'ua',
                            },
                        }
                    )
                    setBranches(response.data.data)
                } catch (error) {
                    console.error(
                        'Ошибка при получении списка отделений:',
                        error
                    )
                }
            }

            fetchBranches()
        } else {
            setBranches([])
        }
    }, [locale, selectedCity])

    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value)
        setInitialUserCity(event.target.value)
        setSelectedCity(null)
    }

    const handleCitySelect = (city: City) => {
        setSelectedCity(city)
        setCity(city.Description)
        setInitialUserCity(city.Description)
        setCities([])
    }

    return (
        <div>
            <div className="input-list-box input-text ">
                <div
                    className={`input-text${city || valueCity ? ' show' : ''}`}
                >
                    <input
                        type="text"
                        value={city ? city : valueCity}
                        id="city-input"
                        onChange={handleCityChange}
                    />
                    <span>
                        {
                            translations[locale].order.basket.deliver
                                .nova_pochta.city
                        }
                    </span>
                </div>
                {cities.length > 0 && (
                    <div className="list">
                        <ul>
                            {cities.map((city) => (
                                <li
                                    key={city.Ref}
                                    onClick={() => handleCitySelect(city)}
                                >
                                    {city.Description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <ListBranch
                locale={locale}
                selectedCity={selectedCity}
                selectedBranch={selectedBranch}
                setInitialUserDeliver={setInitialUserDeliver}
                branches={branches}
            />
        </div>
    )
}

export default NovaPoshtaSelectorProfile

const ListBranch = ({
    locale,
    selectedCity,
    selectedBranch,
    setInitialUserDeliver,
    branches,
}: {
    locale: AllowedLangs
    selectedCity: City | null
    selectedBranch: any
    setInitialUserDeliver: any
    branches: Branch[]
}) => {
    const { translations } = useLang()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleBranchChange = (value: string) => {
        setInitialUserDeliver(value)
        setIsOpen(false)
    }
    return (
        <>
            <div
                style={{ marginTop: 15 }}
                className={
                    'list-value np-list ' +
                    (selectedBranch || selectedCity ? ' active' : '')
                }
            >
                <div className="input-list-drop">
                    <span
                        className={`title ${isOpen ? 'active' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className={selectedBranch ? 'active' : ''}>
                            {selectedBranch !== ''
                                ? selectedBranch
                                : translations[locale].order.basket.deliver
                                      .nova_pochta.poshotomat}
                        </span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 7L10 13L16 7"
                                stroke="#111111"
                                strokeWidth="1.5"
                            ></path>
                        </svg>
                    </span>
                    <div
                        className="list"
                        style={isOpen ? {} : { display: 'none' }}
                    >
                        {branches.map((branch) => (
                            <React.Fragment key={branch.Ref}>
                                <input
                                    type="radio"
                                    name="branch-selector"
                                    id={branch.Ref}
                                    value={branch.Description}
                                    checked={
                                        selectedBranch === branch.Description
                                    }
                                    onChange={() =>
                                        handleBranchChange(branch.Description)
                                    }
                                />
                                <label htmlFor={branch.Ref}>
                                    {branch.Description}
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
