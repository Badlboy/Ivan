'use client'

import TitleSection from "@/components/TitleSection";
import { useLang } from "@/hooks/useLang";
import { IBreadcrumb } from "@/models/IBreadcrumb";
import { ISearch } from "@/models/IProduct";
import { AllowedLangs } from "@/constants/lang";
import ProductCard from "@/components/Card/ProductCard";
import { useUrlUpdate } from "@/hooks/useUrlUpdate";
import { useEffect, useState, useTransition } from "react";
import Loader from '@/components/Loader'
import { Pagination } from "@/components/business/Pagination";

interface SearchPageProps{ 
    data:ISearch;
    elementPerPage:number;
    session:any;
    locale:AllowedLangs;
    q:string;
    page:number;
}
export default function SearchPage (props:SearchPageProps) { 
    const {data,elementPerPage,locale,session,q,page} = props;
    const {data:productsData,count} = data;
    const { translations } = useLang();
    const pageCount = Math.ceil(count / elementPerPage);
    const {updateUrl} = useUrlUpdate();
    const [isPending,startTransition] = useTransition();
    const [isPressedPagination,setIsPressed] = useState(false);
    const breadcrumbList: IBreadcrumb[] = [];
    console.log(page);
    const pageHandler = (page:number) => { 
        startTransition(() => { 
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            updateUrl('page',page);
            setIsPressed(true);
        })
    }
    useEffect(() => {
        setIsPressed(false);
    },[page])
    if(isPending || isPressedPagination) { 
        return <Loader />;
    }
    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={
                    translations[locale].page.search.title_name +
                    ': ' +
                    q
                }
            />
            <article className="section-catalog-page box-content">
                <div className="products-list">
                    {productsData.length ? (
                        <>
                            <div className="list product-search-list">
                                {productsData.map((product) => (
                                    <ProductCard
                                        locale={locale}
                                        favorites={
                                            session?.user?.favorites ??
                                            ([] as number[])
                                        }
                                        key={product.id}
                                        {...product}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <span className="title-section text-h1 center empty-title">
                            {translations[locale].catalog.empty}
                        </span>
                    )}
                </div>
            </article>
            <div style={{display:'flex',justifyContent:'center',padding:'20px 0'}}>
                <Pagination 
                    activePage={Number(page)} 
                    onPageChange={pageHandler} 
                    pageCount={pageCount}></Pagination>
            </div>
        </>
    )
}