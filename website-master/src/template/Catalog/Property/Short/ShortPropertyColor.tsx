import {
    PropertiesList,
    PropertiesListValues,
    Property,
} from '@/models/IProduct'
import React from 'react'

const ShortPropertyColor = ({
    val,
    prop,
    handleUpdateProperty,
    propertyActive,
}: {
    val: PropertiesListValues
    prop: PropertiesList
    handleUpdateProperty: any
    propertyActive: Property[]
}) => {
    const result: string[] = val.dop?.split(',') ?? ['']
    const isActive =
        Array.isArray(propertyActive) &&
        propertyActive.some(
            (item) => item.key === prop.property.id && item.value === val.id
        )

    return (
        <span
            key={val.id}
            onClick={() =>
                handleUpdateProperty(prop.property.id, val.id, val.variation)
            }
            className={`properties-box__item--color ${isActive ? 'active' : ''} ${result.length > 1 ? 'two' : ''}`}
        >
            {result.map((color, index) => (
                <span
                    key={index}
                    style={{
                        background: color,
                    }}
                ></span>
            ))}
        </span>
    )
}

export default ShortPropertyColor
