import React, { useMemo } from 'react'
import { Field } from 'formik'
import { v4 as uuidv4 } from 'uuid'

const Checkbox = ({
    label,
    name,
    value = '',
}: {
    label: string
    name: string
    value?: string
}) => {
    const uniqueId = useMemo(() => uuidv4(), [])

    return (
        <div className="input-checkbox">
            <input
                name={name}
                type="checkbox"
                value={value ?? ''}
                id={uniqueId}
            />
            <label htmlFor={uniqueId}>{label}</label>
        </div>
    )
}

export default Checkbox
