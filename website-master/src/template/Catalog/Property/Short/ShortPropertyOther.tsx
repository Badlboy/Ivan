import {
    PropertiesList,
    PropertiesListValues,
    Property,
} from '@/models/IProduct'
import React from 'react'

const ShortPropertyOther = ({
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
            className={`${isActive ? 'active' : ''} ${!val.isDisabled ? 'disable' : ''}`}
        >
            {val.name}
        </span>
    )
}

export default ShortPropertyOther
