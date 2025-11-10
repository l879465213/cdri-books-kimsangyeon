import type { QueryParam } from "@/shared/types";
import { useRef, useState, useEffect } from "react";

type AdvancedSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: { target: string; keyword: string }) => void;
  onChange?: (params: QueryParam[]) => void;
  itemList: { value: string; label: string }[];
};

export const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onSearch,
  itemList,
  onChange,
}: AdvancedSearchModalProps) => {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelectOption = (value: string) => {
    setTitle(value);
    setIsDropdownOpen(false);
  };

  const selectedOption = itemList?.find((opt) => opt.value === title) || itemList?.[0];

  const handleSearch = () => {
    onSearch({ target: selectedOption?.value || "", keyword });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setTitle("");
    setKeyword("");
    onChange?.([
      { key: "target", value: "" },
      { key: "keyword", value: "" },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-1/2 translate-x-1/2 mt-[18px] z-50">
      <div ref={modalRef} className="bg-white border border-gray rounded-[8px] p-[16px] w-[360px]">
        <div className="flex flex-col gap-[12px]">
          {/* 선택 타입 */}
          <div className="flex items-center gap-[8px] pb-[30px]">
            <div ref={dropdownRef} className="relative w-[100px] ">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-[36px] px-[10px] border-b border-gray text-[14px] text-text-primary bg-white cursor-pointer flex items-center justify-between"
              >
                <span>{selectedOption.label}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-gray rounded-[4px] z-50">
                  {itemList
                    ?.filter((opt) => opt.value !== title)
                    ?.map((option, index) => {
                      if (!title && index === 0) {
                        return null;
                      }
                      return (
                        <div
                          key={option.value}
                          onClick={() => handleSelectOption(option.value)}
                          className={`px-[10px] py-[8px] text-[14px] cursor-pointer hover:bg-light-gray text-text-primary ${
                            title === option.value ? "bg-light-gray" : ""
                          }`}
                        >
                          {option.label}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력하세요"
              className="flex-1 h-[36px] px-[12px] border-b border-gray text-[14px] text-text-primary placeholder:text-text-subtitle focus:outline-none "
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-[8px] pt-[4px]">
            <button
              onClick={handleReset}
              className="px-[12px] py-[6px] text-[13px] text-text-secondary hover:text-text-primary"
            >
              초기화
            </button>
            <button
              onClick={handleSearch}
              className="px-[16px] py-[6px] bg-blue text-white text-[13px] font-medium rounded-[4px]"
            >
              검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
