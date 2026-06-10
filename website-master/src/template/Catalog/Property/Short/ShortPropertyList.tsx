import { PropertiesList, Property } from '@/models/IProduct'
import React from 'react'
import PropertyColor from './ShortPropertyColor'
import PropertyOther from './ShortPropertyOther'

const ShortPropertyList = ({
    groupedProperties,
    handleUpdateProperty,
    propertyActive,
}: {
    groupedProperties: PropertiesList[]
    handleUpdateProperty: any
    propertyActive: Property[]
}) => {
    return (
        <>
            {groupedProperties?.map((prop) => {
                if (prop.values[0].dop) {
                    return (
                        <div key={prop.property.id} className="color">
                            {prop.values.map((val, index) => (
                                <PropertyColor
                                    key={val.id}
                                    val={val}
                                    prop={prop}
                                    handleUpdateProperty={handleUpdateProperty}
                                    propertyActive={propertyActive}
                                />
                            ))}
                        </div>
                    )
                } else {
                    return (
                        <div key={prop.property.id} className="size">
                            {prop.values.map((val, key) => (
                                <PropertyOther
                                    key={val.id}
                                    val={val}
                                    prop={prop}
                                    handleUpdateProperty={handleUpdateProperty}
                                    propertyActive={propertyActive}
                                />
                            ))}
                        </div>
                    )
                }
            })}
        </>
    )
}

export default ShortPropertyList
