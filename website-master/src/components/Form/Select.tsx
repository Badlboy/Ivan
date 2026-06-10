import { ErrorMessage, Field } from 'formik'
import React, { useState } from 'react'

const Select = ({
    label,
    name,
    fields,
    value,
}: {
    label: string
    name: string
    fields: {
        title: string
        value: string
    }[]
    value: string
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const getTitleByValue = (value: string) => {
        const deliveryOption = fields.find((option) => option.value === value)
        return deliveryOption ? deliveryOption.title : label
    }

    return (
        <div className="input-list-drop">
            <span className="title" onClick={() => setIsOpen(!isOpen)}>
                <span
                    className={label != getTitleByValue(value) ? 'active' : ''}
                >
                    {getTitleByValue(value)}
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
                    />
                </svg>
            </span>
            <div className="list" style={isOpen ? {} : { display: 'none' }}>
                {fields.map((item, index) => (
                    <React.Fragment key={index}>
                        <Field
                            onClick={() => setIsOpen(false)}
                            type="radio"
                            name={name}
                            value={item.value}
                            id={name + '_' + index}
                            checked={value === item.value}
                        />
                        <label htmlFor={name + '_' + index}>{item.title}</label>
                    </React.Fragment>
                ))}
            </div>
            <ErrorMessage name={name}>
                {(error) => <span className="error">{error}</span>}
            </ErrorMessage>
        </div>
    )
}

export default Select
