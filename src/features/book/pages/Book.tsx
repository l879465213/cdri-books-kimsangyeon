import { CustomButton } from "@/shared/components/CustomButton";
import { SearchInput } from "@/shared/components/SearchInput";
import { AdvancedSearchModal } from "@/shared/components/AdvancedSearchModal";
import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookListFn } from "@/features/book/api";
import { useSearchParams } from "react-router-dom";
import { useReplaceQuery } from "@/shared/hooks/useReplaceQuery";
import { formatNumberWithCommas } from "@/shared/utils";
import upPng from "@/assets/up.png";
import downPng from "@/assets/down.png";
import { twMerge } from "tailwind-merge";
import { useSavedBooks } from "@/features/book/hooks/useSavedBooks";
import { HeartIcon } from "@/features/book/components/HeartIcon";

export const Book = () => {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("keyword") || "");
  const [expandedBookIsbn, setExpandedBookIsbn] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { isBookSaved, toggleSaveBook } = useSavedBooks();

  const { handleReplaceQuery } = useReplaceQuery(searchParams, setSearchParams);

  const {
    data: bookListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["book", searchParams?.toString()],
    queryFn: ({ pageParam = 1 }) =>
      getBookListFn({
        keyword: searchParams.get("keyword")!,
        page: String(pageParam),
        size: "10",
        target: searchParams.get("target") as "title" | "publisher" | "author" | undefined,
      }),
    enabled: !!searchParams.get("keyword"),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.meta?.is_end) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  // 무한스크롤 감지
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("keyword", value);
    newParams.delete("page"); // 검색 시 페이지 초기화
    setSearchParams(newParams);
  };

  const handleAdvancedSearch = (filters: { target: string; keyword: string }) => {
    setSearchValue(filters.keyword);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("target", filters.target);
    newParams.set("keyword", filters.keyword);
    newParams.delete("page"); // 검색 시 페이지 초기화
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title & Description */}
      <div className="flex flex-col">
        <h1 className="text-[22px] font-bold text-text-primary">도서 검색</h1>
      </div>

      {/* 검색 인풋 */}
      <div className="mt-[16px] flex flex-row gap-[16px] items-center relative">
        <SearchInput
          className="w-[480px]"
          placeholder="검색어를 입력하세요"
          onSearch={handleSearch}
          maxRecentSearches={8}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <div className="relative">
          <CustomButton
            title="상세검색"
            onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            type="outline"
            className="w-[100px] h-[35px] border-gray border rounded-[16px] hover:bg-light-gray "
            pClassName="text-[14px] text-text-subtitle font-medium "
          />
          <AdvancedSearchModal
            isOpen={isAdvancedSearchOpen}
            onClose={() => setIsAdvancedSearchOpen(false)}
            onSearch={handleAdvancedSearch}
            onChange={handleReplaceQuery}
            itemList={[
              { value: "title", label: "제목" },
              { value: "publisher", label: "출판사" },
              { value: "author", label: "저자" },
            ]}
          />
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="my-[24px] grow flex flex-col overflow-y-auto">
        {/* 검색 결과 헤더 */}
        {bookListData && bookListData.pages[0] && (
          <div className="flex flex-row gap-[8px]">
            <p className="text-[16px] font-bold text-text-primary">도서 검색 결과</p>
            <p className="text-[14px] text-text-subtitle">
              총 {bookListData.pages[0]?.meta?.total_count || "0"}건
            </p>
          </div>
        )}
        {/* 검색 결과 리스트 */}
        {!bookListData || !searchParams.get("keyword") ? (
          <div className="flex grow flex-col gap-[16px] items-center justify-center">
            <p className="text-[16px] font-bold text-text-primary">검색어를 입력해 주세요.</p>
          </div>
        ) : isLoading ? (
          <div className="flex grow flex-col gap-[16px] items-center justify-center">
            <p className="text-[16px] font-bold text-text-primary">로딩 중...</p>
          </div>
        ) : (
          (() => {
            const allBooks = bookListData.pages.flatMap((page) => page.documents || []);
            return allBooks.length > 0 ? (
              <>
                {allBooks.map((book) => (
                  <div key={book.isbn} className="flex flex-col border-b border-b-gray">
                    {expandedBookIsbn !== book.isbn && (
                      <div className="flex flex-row gap-[16px] py-[15px] items-center">
                        <div className="relative">
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="h-[68px] object-contain"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveBook(book);
                            }}
                            className="absolute top-0 right-0 p-[2px] bg-white/50 rounded-full hover:opacity-70 transition-opacity"
                          >
                            <HeartIcon
                              isFilled={isBookSaved(book.isbn)}
                              className={twMerge(
                                "w-[16px] h-[16px]",
                                isBookSaved(book.isbn) ? "text-red-500" : "text-gray-400"
                              )}
                            />
                          </button>
                        </div>
                        <p className="text-[16px] font-bold text-text-primary ">{book.title}</p>
                        <p className="text-[14px] text-text-subtitle flex-1">
                          {book.authors.join(", ")}
                        </p>
                        <p className="text-[14px] text-text-primary">
                          {book.sale_price ? formatNumberWithCommas(book.sale_price) : "0"}원
                        </p>
                        <div className="flex flex-row gap-[8px] ml-[16px]">
                          <CustomButton
                            suffix={
                              expandedBookIsbn === book.isbn ? (
                                <img src={upPng} alt="up" className="w-[8px] " />
                              ) : (
                                <img src={downPng} alt="down" className="w-[8px] " />
                              )
                            }
                            title="상세보기"
                            onClick={() =>
                              setExpandedBookIsbn(expandedBookIsbn === book.isbn ? null : book.isbn)
                            }
                            type="outline"
                            className="w-[80px] h-[35px] border-gray border rounded-[8px] hover:bg-light-gray gap-[5px]"
                            pClassName="text-[14px] text-text-subtitle font-medium"
                          />
                          <a
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[80px] h-[35px] flex items-center justify-center border border-gray rounded-[8px] hover:bg-light-gray text-[14px] text-text-subtitle font-medium"
                          >
                            구매하기
                          </a>
                        </div>
                      </div>
                    )}
                    {/* 상세 정보 펼치기 */}
                    <div
                      className={`overflow-hidden ${
                        expandedBookIsbn === book.isbn
                          ? "max-h-[2000px] opacity-100 transition-all duration-300 ease-in-out"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pb-[20px] pt-[20px]">
                        <div className="flex flex-row gap-[24px]">
                          {/* 왼쪽: 큰 이미지 */}
                          <div className="shrink-0 relative">
                            <img
                              src={book.thumbnail}
                              alt={book.title}
                              className="w-[150px] h-[200px] object-contain"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveBook(book);
                              }}
                              className="absolute top-[8px] right-[8px] p-[2px] bg-white/50 rounded-full hover:opacity-70 transition-opacity"
                            >
                              <HeartIcon
                                isFilled={isBookSaved(book.isbn)}
                                className={twMerge(
                                  "w-[16px] h-[16px]",
                                  isBookSaved(book.isbn) ? "text-red-500" : "text-gray-400"
                                )}
                              />
                            </button>
                          </div>

                          {/* 중간: 타이틀, 저자, 책소개 내용 */}
                          <div className="flex flex-col gap-[12px] flex-1">
                            <div className="flex flex-row gap-[8px] items-center">
                              <p className="text-[18px] font-bold text-text-primary">
                                {book.title}
                              </p>
                              <p className="text-[14px] text-text-subtitle">
                                {book.authors.join(", ")}
                              </p>
                            </div>
                            {book.contents && (
                              <div className="flex flex-col gap-[14px]">
                                <p className="text-[14px] font-bold text-text-primary">책소개</p>
                                <p className="text-[14px] text-text-subtitle line-clamp-3">
                                  {book.contents}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* 오른쪽: 상세보기, 원가, 할인가, 구매하기 */}
                          <div className="flex flex-col gap-[12px] items-end shrink-0 justify-between">
                            <CustomButton
                              suffix={
                                expandedBookIsbn === book.isbn ? (
                                  <img src={upPng} alt="up" className="w-[8px] " />
                                ) : (
                                  <img src={downPng} alt="down" className="w-[8px] " />
                                )
                              }
                              title="상세보기"
                              onClick={() =>
                                setExpandedBookIsbn(
                                  expandedBookIsbn === book.isbn ? null : book.isbn
                                )
                              }
                              type="outline"
                              className="w-[80px] h-[35px] border-gray border rounded-[8px] hover:bg-light-gray gap-[5px]"
                              pClassName="text-[14px] text-text-subtitle font-medium"
                            />
                            <div className="flex flex-col gap-[4px] items-end">
                              {book.price && (
                                <p className="text-[14px] text-text-primary flex flex-row gap-[4px] items-center">
                                  <span className="text-text-subtitle text-[10px]">원가</span>
                                  <span
                                    className={twMerge(``, book.sale_price ? "line-through" : "")}
                                  >
                                    {formatNumberWithCommas(book.price)}원
                                  </span>
                                </p>
                              )}
                              {book.sale_price && (
                                <p className="text-[16px] font-bold text-text-primary flex flex-row gap-[4px] items-center">
                                  <span className="text-text-subtitle text-[10px]">할인가</span>
                                  <span className="text-text-primary">
                                    {book.sale_price
                                      ? formatNumberWithCommas(book.sale_price)
                                      : "0"}
                                    원
                                  </span>
                                </p>
                              )}
                            </div>
                            <a
                              href={book.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-[80px] h-[35px] flex items-center justify-center border border-primary rounded-[8px]  text-[14px] font-medium text-white bg-primary"
                            >
                              구매하기
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={observerTarget} className="h-[20px] flex items-center justify-center">
                  {isFetchingNextPage && (
                    <p className="text-[14px] text-text-subtitle">더 많은 결과를 불러오는 중...</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex grow flex-col gap-[16px] items-center justify-center">
                <p className="text-[16px] font-bold text-text-primary">검색 결과가 없습니다.</p>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default Book;
