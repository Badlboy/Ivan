import React, { useEffect, useRef, useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import InputMask from 'react-input-mask'

const Input = React.memo(({
    label,
    name,
    type,
    value = '',
    edit = false,
    id = '',
    password = false,
    className = '',
    mask,
    onChange = null
}: {
    label: string
    name: string
    type: string
    id?: string
    value?: string
    edit?: boolean
    password?: boolean
    className?: string
    mask?: string
    onChange?: any
}) => {
    const [activePassword, setActivePassword] = useState<boolean>(false)

    return (
        <div
            className={`input-text${value ? ' show' : ''} ${className}`}
        >
            <Field name={name}>
                {({ field }: any) =>
                    !!mask ? (
                        <InputMask
                            {...field}
                            mask={mask || ''}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            {...(id ? { id } : {})}
                            type={activePassword ? 'text' : type}
                        />
                    ) : (
                        <input
                            {...(id ? { id } : {})}
                            type={activePassword ? 'text' : type}
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                if (typeof onChange === 'function') {
                                    onChange(e);
                                }
                            }}
                            value={field.value}
                            onBlur={field.onBlur}
                        />
                    )
                }
            </Field>
            <ErrorMessage name={name}>
                {(error) => <span className="error">{error}</span>}
            </ErrorMessage>
            <span>{label}</span>
            {edit ? (
                <svg
                    className="svg edit"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9.5 3.33334H3.66667C3.22464 3.33334 2.80072 3.50894 2.48816 3.8215C2.17559 4.13406 2 4.55798 2 5.00001V16.6667C2 17.1087 2.17559 17.5326 2.48816 17.8452C2.80072 18.1577 3.22464 18.3333 3.66667 18.3333H15.3333C15.7754 18.3333 16.1993 18.1577 16.5118 17.8452C16.8244 17.5326 17 17.1087 17 16.6667V10.8333"
                        stroke="#888888"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M15.75 2.08332C16.0815 1.7518 16.5312 1.56555 17 1.56555C17.4688 1.56555 17.9185 1.7518 18.25 2.08332C18.5815 2.41484 18.7678 2.86448 18.7678 3.33332C18.7678 3.80216 18.5815 4.2518 18.25 4.58332L10.3333 12.5L7 13.3333L7.83333 9.99999L15.75 2.08332Z"
                        stroke="#888888"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : password ? (
                activePassword ? (
                    <svg
                        className="svg pointer"
                        onClick={() => setActivePassword(!activePassword)}
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.3255 4.16666C5.92196 4.16666 3.41796 7.49088 2.45503 9.12045C2.23164 9.4985 2.11994 9.68752 2.13179 9.98237C2.14365 10.2772 2.27391 10.462 2.53443 10.8315C3.67037 12.4428 6.51359 15.8333 10.3255 15.8333C14.1375 15.8333 16.9807 12.4428 18.1166 10.8315C18.3771 10.462 18.5074 10.2772 18.5193 9.98237C18.5311 9.68752 18.4194 9.4985 18.196 9.12045C17.2331 7.49088 14.7291 4.16666 10.3255 4.16666Z"
                            stroke="#888888"
                            strokeWidth="1.5"
                        />
                        <circle
                            cx="10.3281"
                            cy="10"
                            r="2.5"
                            stroke="#888888"
                            strokeWidth="1.5"
                        />
                    </svg>
                ) : (
                    <svg
                        className="svg pointer"
                        onClick={() => setActivePassword(!activePassword)}
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.9756 10.3594C13.9883 10.2414 13.9948 10.1214 13.9948 9.99999C13.9948 8.15904 12.5024 6.66666 10.6615 6.66666C10.54 6.66666 10.4201 6.67315 10.302 6.68581L13.9756 10.3594ZM7.74971 8.37615C7.48118 8.85664 7.32812 9.41044 7.32812 9.99999C7.32812 11.8409 8.82051 13.3333 10.6615 13.3333C11.251 13.3333 11.8048 13.1803 12.2853 12.9117L11.143 11.7694C10.9895 11.8111 10.8281 11.8333 10.6615 11.8333C9.64894 11.8333 8.82812 11.0125 8.82812 9.99999C8.82812 9.83335 8.85036 9.67191 8.89202 9.51846L7.74971 8.37615Z"
                            fill="#888888"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.1456 14.7683L13.0339 13.6565C12.2765 14.0236 11.4784 14.25 10.6653 14.25C9.42015 14.25 8.21025 13.7191 7.12772 12.965C6.04993 12.2142 5.15573 11.2817 4.55799 10.5755C4.34784 10.3272 4.24677 10.2045 4.18656 10.1052C4.14835 10.0422 4.14839 10.0246 4.14843 10.0023L4.14844 10L4.14843 9.99766C4.14839 9.97541 4.14835 9.95783 4.18656 9.89481C4.24677 9.79549 4.34784 9.67282 4.55799 9.42453C5.07765 8.81058 5.82137 8.02561 6.71499 7.33765L5.64646 6.26912C4.70922 7.01328 3.94409 7.82806 3.41306 8.45545L3.3452 8.53515C3.02039 8.91559 2.64844 9.35123 2.64844 10C2.64844 10.6488 3.02039 11.0844 3.3452 11.4648L3.41306 11.5446C4.05757 12.306 5.04693 13.3435 6.27031 14.1958C7.48896 15.0447 8.99784 15.75 10.6653 15.75C11.9372 15.75 13.1167 15.3397 14.1456 14.7683ZM8.32067 4.70069C9.05267 4.42297 9.83955 4.25 10.6653 4.25C12.3328 4.25 13.8417 4.95527 15.0604 5.80423C16.2837 6.65648 17.2731 7.69399 17.9176 8.45545L17.9855 8.53515C18.3103 8.91559 18.6822 9.35123 18.6822 10C18.6822 10.6488 18.3103 11.0844 17.9855 11.4648L17.9176 11.5446C17.5671 11.9587 17.1145 12.4545 16.5778 12.9578L15.5165 11.8965C16.0143 11.433 16.4395 10.9691 16.7727 10.5755C16.9828 10.3272 17.0839 10.2045 17.1441 10.1052C17.1823 10.0422 17.1823 10.0246 17.1822 10.0023L17.1822 10L17.1822 9.99766C17.1823 9.97541 17.1823 9.95783 17.1441 9.89481C17.0839 9.79549 16.9828 9.67282 16.7727 9.42453C16.1749 8.71833 15.2807 7.78585 14.2029 7.03502C13.1204 6.28089 11.9105 5.75 10.6653 5.75C10.2776 5.75 9.89326 5.80148 9.51513 5.89515L8.32067 4.70069Z"
                            fill="#888888"
                        />
                        <path
                            d="M4.82812 1.66666L18.1615 15"
                            stroke="#888888"
                            strokeWidth="1.5"
                        />
                    </svg>
                )
            ) : (
                ''
            )}
        </div>
    )
})

Input.displayName = 'Input';

export default Input
