import {
    PropertiesList,
    PropertiesListValues,
    Property,
} from '@/models/IProduct'
import React from 'react'

const PropertyOther = ({
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
            className={`properties-box__item--size ${isActive ? 'active' : ''} ${!val.isDisabled ? 'disable' : ''}`}
        >
            {val.name}
        </span>
    )
}

export default PropertyOther
