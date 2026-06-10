import { ICareer } from '@/models/IPage'
import CareerForm from './CareerForm'
import { AllowedLangs } from '@/constants/lang'

const Career = ({
    pageData,
    locale,
}: {
    pageData: ICareer
    locale: AllowedLangs
}) => {
    return (
        <article className="section-сareer">
            <CareerForm locale={locale} vacancies={pageData.vacancies} />
            <section className="section-сareer__text box-content">
                <h2>{pageData.title2}</h2>
                <div
                    dangerouslySetInnerHTML={{
                        __html: pageData.description,
                    }}
                ></div>
                {pageData.advantages?.length ? (
                    <div className="steps-block-list">
                        {pageData.advantages.map((item, index) => (
                            <div key={index} className="steps-block-item">
                                <span className="title">
                                    <span>{index + 1}</span>
                                    <span>{item.name}</span>
                                </span>
                                <span className="text">{item.description}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    ''
                )}
            </section>
        </article>
    )
}

export default Career
