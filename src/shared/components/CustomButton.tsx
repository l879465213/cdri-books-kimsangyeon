import React, { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type ButtonParams = {
  title: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  pClassName?: string;
  type?: "primary" | "secondary" | "soft" | "outline";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  maxWidth?: string;
  throttleMs?: number; // throttle 시간 (밀리초)
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const CustomButton = ({
  title,
  disabled,
  className,
  pClassName,
  onClick,
  onMouseDown,
  type,
  prefix,
  suffix,
  ref,
  maxWidth,
  throttleMs = 300, // 기본값 300ms
  onMouseEnter,
  onMouseLeave,
}: ButtonParams) => {
  const lastClickTime = useRef<number>(0);
  const [isThrottling, setIsThrottling] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const now = Date.now();

      // throttle 시간 내에 클릭된 경우 무시
      if (now - lastClickTime.current < throttleMs) {
        return;
      }

      lastClickTime.current = now;
      setIsThrottling(true);

      // throttle 시간 후에 상태 해제
      setTimeout(() => {
        setIsThrottling(false);
      }, throttleMs);

      onClick?.(e);
    },
    [onClick, throttleMs]
  );

  // disabled 상태: 원래 disabled이거나 throttle 중일 때
  const isDisabled = disabled || isThrottling;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={twMerge(
        `box-border flex h-[48px] w-auto cursor-pointer items-center justify-center rounded-[4px] text-[16px] font-semibold focus-visible:outline-none  ${
          maxWidth ? ` lg:max-w-[${maxWidth}]` : ""
        } `,
        type === "primary"
          ? "bg-[#0B6EF2] disabled:bg-[#9BA8C5] hover:bg-[#0B6EF2] text-white"
          : "",
        type === "secondary"
          ? "bg-[#9BA8C5] disabled:bg-[#9BA8C5] hover:bg-[#9BA8C5] text-white"
          : "",
        type === "soft"
          ? "bg-[#9BA8C5] text-[#010101] hover:bg-[#9BA8C5] disabled:bg-[#9BA8C5] disabled:text-[#010101]"
          : "",
        type === "outline"
          ? "active:bg-[#9BA8C5] active:border-[#9BA8C5] active:text-[#010101] border-[1px solid] border-[#D9D9D9] bg-white text-[#010101] hover:border-[#9BA8C5] hover:bg-[#9BA8C5] disabled:bg-[#9BA8C5] disabled:text-[#010101]"
          : "",
        className ? className : ""
      )}
    >
      {prefix && prefix}
      <p className={pClassName ? pClassName : ""}>{title}</p>
      {suffix && suffix}
    </button>
  );
};
