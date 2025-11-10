import { CustomButton } from "@/shared/components/CustomButton";
import { useState, useEffect, useRef, useCallback } from "react";
import { formatNumberWithCommas } from "@/shared/utils";
import upPng from "@/assets/up.png";
import downPng from "@/assets/down.png";
import { twMerge } from "tailwind-merge";
import { useSavedBooks } from "@/features/book/hooks/useSavedBooks";
import { HeartIcon } from "@/features/book/components/HeartIcon";

export const SavedBook = () => {
  const [expandedBookIsbn, setExpandedBookIsbn] = useState<string | null>(null);
  const { savedBooks, removeSavedBook, isBookSaved, toggleSaveBook } = useSavedBooks();

  return (
    <div className="flex flex-col h-full">
      {/* Title & Description */}
      <div className="flex flex-col">
        <h1 className="text-[22px] font-bold text-text-primary">찜한 도서</h1>
      </div>

      {/* 검색 결과 */}
      <div className="my-[24px] grow flex flex-col overflow-y-auto">
        {/* 검색 결과 헤더 */}
        {savedBooks.length > 0 && (
          <div className="flex flex-row gap-[8px]">
            <p className="text-[16px] font-bold text-text-primary">찜한 도서</p>
            <p className="text-[14px] text-text-subtitle">총 {savedBooks.length}건</p>
          </div>
        )}
        {/* 검색 결과 리스트 */}
        {savedBooks.length === 0 ? (
          <div className="flex grow flex-col gap-[16px] items-center justify-center">
            <p className="text-[16px] font-bold text-text-primary">찜한 도서가 없습니다.</p>
          </div>
        ) : (
          <>
            {savedBooks.map((book) => (
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
                          <p className="text-[18px] font-bold text-text-primary">{book.title}</p>
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
                            setExpandedBookIsbn(expandedBookIsbn === book.isbn ? null : book.isbn)
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
                                {book.sale_price ? formatNumberWithCommas(book.sale_price) : "0"}
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
          </>
        )}
      </div>
    </div>
  );
};

export default SavedBook;
