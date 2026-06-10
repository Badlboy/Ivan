import React from 'react'

const StarBox = React.memo(({ number }: { number: number }) => {
    return (
        <div className="stars-box">
            <div
                className="fill"
                style={{
                    width: Math.round((number / 5) * 100) + '%',
                }}
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#FFD028"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#FFD028"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#FFD028"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#FFD028"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#FFD028"
                    />
                </svg>
            </div>
            <div className="placeholder">
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#e5e5e5"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#e5e5e5"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#e5e5e5"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#e5e5e5"
                    />
                </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                        fill="#e5e5e5"
                    />
                </svg>
            </div>
        </div>
    )
})

StarBox.displayName = 'StarBox';

export default StarBox
