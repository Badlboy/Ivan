import React from 'react'
import { v4 as uuidv4 } from 'uuid'

const Radio = ({
    label,
    name,
    checked = false,
    value = '',
    setInitialUserPayments,
}: {
    label: string
    name: string
    checked?: boolean
    value?: string
    setInitialUserPayments: any
}) => {
    const uniqueId = uuidv4()
    return (
        <div className="input-checkbox">
            <input
                type="radio"
                name={name}
                checked={checked}
                id={uniqueId}
                value={value}
                onChange={() => setInitialUserPayments(value)}
            />
            <label htmlFor={uniqueId}>{label}</label>
        </div>
    )
}

export default Radio
