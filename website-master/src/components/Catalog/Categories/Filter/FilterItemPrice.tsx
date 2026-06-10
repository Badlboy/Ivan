'use client'
import React, { useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const FilterItemPrice = ({
    minPrice,
    maxPrice,
    handlePriceRange,
    sendFilterPrice,
    filterPrice
}: {
    minPrice: number
    maxPrice: number
    handlePriceRange: (range: [number, number]) => void
    sendFilterPrice: () => void
    filterPrice: [number, number]
}) => {
    const [range, setRange] = useState<[number, number]>([filterPrice[0], filterPrice[1]])
    const [inputMin, setInputMin] = useState(filterPrice[0])
    const [inputMax, setInputMax] = useState(filterPrice[1])

    const handleSliderChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            const newRange: [number, number] = [value[0], value[1]]
            setRange(newRange)
            setInputMin(newRange[0])
            setInputMax(newRange[1])
            handlePriceRange(newRange)
        }
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'min' | 'max'
    ) => {
        const value = parseInt(event.target.value, 10)
        if (!isNaN(value)) {
            if (type === 'min') {
                setInputMin(value)
                setRange([value, range[1]])
                handlePriceRange([value, range[1]])
            } else {
                setInputMax(value)
                setRange([range[0], value])
                handlePriceRange([range[0], value])
            }
        }
    }

    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="filter-list__item price">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`title ${isOpen ? 'active' : ''}`}
            >
                <span>Ціна</span>
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
                    />
                </svg>
            </div>
            <div
                className="list-box"
                style={!isOpen ? { display: 'none' } : {}}
            >
                <div className="price-box">
                    <div className="top">
                        <input
                            type="text"
                            value={inputMin}
                            placeholder="Від"
                            onChange={(e) => handleInputChange(e, 'min')}
                        />
                        <svg
                            width="8"
                            height="2"
                            viewBox="0 0 8 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect y="0.5" width="8" height="1" fill="#111111" />
                        </svg>
                        <input
                            type="text"
                            value={inputMax}
                            placeholder="До"
                            onChange={(e) => handleInputChange(e, 'max')}
                        />
                        <button
                            className="btn-black"
                            onClick={() => sendFilterPrice()}
                        >
                            Ок
                        </button>
                    </div>
                    <Slider
                        range
                        min={minPrice}
                        max={maxPrice}
                        value={range}
                        onChange={handleSliderChange}
                        trackStyle={[{ backgroundColor: '#111111' }]}
                        railStyle={{ backgroundColor: '#F6F6F6' }}
                        handleStyle={[
                            {
                                borderColor: '#111111',
                                backgroundColor: '#111111',
                                boxShadow: '0 0 5px #F6F6F6',
                            },
                            {
                                borderColor: '#111111',
                                backgroundColor: '#111111',
                                boxShadow: '0 0 5px #F6F6F6',
                            },
                        ]}
                        activeDotStyle={{
                            borderColor: '#F6F6F6', // Цвет при нажатии
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default FilterItemPrice
