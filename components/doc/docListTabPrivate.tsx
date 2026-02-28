import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {useEffect, useState} from "react";
import {GenericSearchTextInterface} from "@/types/user";
import {usePost} from "@/hooks/usePost";
import {DocListResult} from "@/components/doc/docListResult";
import {DocInfoInterface, DocInfoListInterface, DocInfoListInterfaceResp} from "@/types/doc";

export const DocListTabPrivate = ({searchQuery, onCreate}: {searchQuery: string, onCreate: () => void}) => {
    const post = usePost();
    
    // Main List Pagination state
    const [pageIndex, setPageIndex] = useState(0)
    const [allDocs, setAllDocs] = useState<DocInfoInterface[]>([])
    const [hasMore, setHasMore] = useState(true)
    const pageSize = 20

    // Search Pagination state
    const [searchPageIndex, setSearchPageIndex] = useState(0)
    const [searchAllDocs, setSearchAllDocs] = useState<DocInfoInterface[]>([])
    const [searchHasMore, setSearchHasMore] = useState(true)
    const [isSearchLoading, setIsSearchLoading] = useState(false)

    // Fetch data for the main list
    const endpoint = `${GetEndpointUrl.GetUserPrivateDocList}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const { data: pageData, isLoading } = useFetch<DocInfoListInterfaceResp>(searchQuery.trim().length === 0 ? endpoint : "")

    // Function to fetch search results
    const fetchSearchResults = async (query: string, page: number) => {
        setIsSearchLoading(true)
        const resp = await post.makeRequest<GenericSearchTextInterface, DocInfoListInterface >({
            apiEndpoint: PostEndpointUrl.SearchPrivateDocList,
            payload: {
                search_text: query,
                page_index: page,
                page_size: pageSize
            }
        })
        setIsSearchLoading(false)
        if (resp && resp.docs) {
            // Note: usePost unwraps .data, so resp is DocInfoListInterface
            const docs = resp.docs || []
            
            if (page === 0) {
                setSearchAllDocs(docs)
            } else {
                setSearchAllDocs(prev => [...prev, ...docs])
            }
            if (docs.length < pageSize) {
                setSearchHasMore(false)
            } else {
                setSearchHasMore(true)
            }
            setSearchPageIndex(page)
        }
    }

    // Effect for Search Query Change
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setSearchPageIndex(0)
            setSearchHasMore(true)
            setSearchAllDocs([])
            fetchSearchResults(searchQuery, 0)
        } else {
            setSearchAllDocs([])
        }
    }, [searchQuery])

    // Append data for main list
    useEffect(() => {
        if (pageData?.data?.docs && searchQuery.trim().length === 0) {
            const docs = pageData.data.docs || []
            if (pageIndex === 0) {
                setAllDocs(docs)
            } else {
                setAllDocs(prev => [...prev, ...docs])
            }
            
            if (docs.length < pageSize) {
                setHasMore(false)
            } else {
                setHasMore(true) 
            }
        }
    }, [pageData, pageIndex, searchQuery])
    
    const onLoadMore = () => {
        if (searchQuery.trim().length > 0) {
            // Search Mode Load More
            if (!isSearchLoading && searchHasMore) {
                fetchSearchResults(searchQuery, searchPageIndex + 1)
            }
        } else {
            // Main List Load More
            if (!isLoading && hasMore) {
               setPageIndex(prev => prev + 1)
            }
        }
    }

    const renderDocList = (searchQuery.trim().length > 0) ? searchAllDocs : allDocs
    const currentIsLoading = (searchQuery.trim().length > 0) ? isSearchLoading : isLoading
    const currentHasMore = (searchQuery.trim().length > 0) ? searchHasMore : hasMore

    return (
        <DocListResult 
            docList={renderDocList || []} 
            onLoadMore={onLoadMore}
            hasMore={currentHasMore}
            isLoading={currentIsLoading}
            onCreate={searchQuery.trim().length > 0 ? undefined : onCreate}
        />
    )
}