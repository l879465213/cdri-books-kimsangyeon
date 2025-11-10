import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { useReplaceQuery } from "@/shared/hooks/useReplaceQuery";
import { useSearchParams } from "react-router-dom";

type SearchInputProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
  maxRecentSearches?: number;
  searchValue?: string;
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchInput = ({
  placeholder = "검색어를 입력하세요",
  onSearch,
  className,
  maxRecentSearches = 10,
  searchValue,
}: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchValue || "");
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("recent-searches", []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { handleReplaceQuery } = useReplaceQuery(searchParams, setSearchParams);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    // 빈 값이거나 최소 길이 미만이면 저장하지 않음
    if (!trimmedValue) {
      return;
    }

    // 최근 검색 기록 필터링
    const filteredSearches = recentSearches.filter((item) => {
      return item !== trimmedValue;
    });

    const updatedSearches = [trimmedValue, ...filteredSearches].slice(0, maxRecentSearches);
    setRecentSearches(updatedSearches);

    // 검색 실행
    onSearch?.(trimmedValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // setInputValue("");
      handleSearch(inputValue);
    }
  };

  const handleDeleteSearch = (e: React.MouseEvent, search: string) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter((item) => item !== search);
    setRecentSearches(updatedSearches);
  };

  const handleSelectSearch = (search: string) => {
    onSearch?.(search);
    setInputValue(search);
    setIsOpen(false);
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    setIsOpen(true);
    handleReplaceQuery([{ key: "keyword", value: "" }]);
  };

  return (
    <div ref={containerRef} className={twMerge("relative w-[480px]", className)}>
      {/* 검색 인풋 */}
      <div className="relative">
        {/* 검색 아이콘 (선택사항) */}
        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-subtitle"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-subtitle"
            />
          </svg>
        </div>
        {/* 검색 입력 필드 */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={twMerge(
            `w-full h-[50px] px-[50px] py-[12px] border border-gray bg-gray-light rounded-[25px] text-[16px] text-text-primary placeholder:text-text-subtitle focus:outline-none`,
            isOpen && recentSearches.length > 0 ? "rounded-b-none border-b-white" : ""
          )}
        />
        {/* 검색 초기화 */}
        {inputValue && (
          <div
            className="absolute z-50 top-1/3 rounded-[25px] right-[22px]"
            onClick={handleClearSearch}
          >
            <button className=" ">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 최근 검색 기록 드롭다운 */}
      {isOpen && recentSearches.length > 0 && (
        <div
          className={twMerge(
            `absolute top-full left-0 right-0 bg-white border border-t-0 border-gray z-50 overflow-y-auto`,
            isOpen ? "rounded-b-[25px]" : ""
          )}
        >
          {/* 검색 기록 리스트 */}
          <ul className="">
            {recentSearches.map((search, index) => (
              <li
                key={index}
                onClick={() => handleSelectSearch(search)}
                className="flex items-center justify-between px-[16px] py-[12px] hover:bg-light-gray cursor-pointer group"
              >
                <span className="text-[14px] text-text-primary flex-1">{search}</span>
                <button
                  onClick={(e) => handleDeleteSearch(e, search)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-[4px] hover:bg-gray 
                  "
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-text-secondary"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
