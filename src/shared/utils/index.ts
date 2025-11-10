import { AxiosError } from "axios";
import { has, isNil, isString } from "lodash";
import { addYears, format, isValid, subDays, subMonths } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 비밀번호 유효성을 검사합니다.
 * - 최소 8자리 이상
 * - 영문 대소문자, 숫자, 특수문자를 각각 1개 이상 포함
 */
const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

const getItem = (key: any) => {
  const data = typeof window !== "undefined" ? localStorage.getItem(key) : "";
  try {
    return JSON?.parse(data || "");
  } catch (err) {
    return data;
  }
};
const setItem = (key: string, value: any) => {
  const stringify = typeof value !== "string" ? JSON.stringify(value) : value;
  return localStorage.setItem(key, stringify);
};
const removeItem = (key: string) => {
  return localStorage.removeItem(key);
};
const clearLocalStorage = () => {
  removeItem("token");
  removeItem("user");
};
// 서버 에러 메시지 처리
const getErrorMessage = (error: unknown, defaultMessage: string = "Error"): string => {
  // 1. Axios 에러인 경우
  if (error instanceof AxiosError) {
    // response.data.error.message 형식
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    // response.data.message 형식
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // response.data 형식이 문자열인 경우
    if (typeof error.response?.data === "string") {
      return error.response.data;
    }
  }
  // 2. 일반 Error 객체인 경우
  if (error instanceof Error) {
    return error.message;
  }
  // 3. 문자열인 경우
  if (typeof error === "string") {
    return error;
  }
  // 4. 기타 경우 기본 메시지 반환
  return defaultMessage;
};

// 숫자에 콤마 찍기
const formatNumberWithCommas = (number: number | string | string[]): string => {
  // 빈 값들 체크
  if (isNil(number) || number === "") return "";

  // 문자열인 경우 공백 제거 후 체크
  if (typeof number === "string") {
    const trimmed = number.trim();
    if (trimmed === "") return "";
  }

  // 숫자로 변환 시도
  const num = Number(number);

  // 유효한 숫자인지 확인
  if (isNaN(num)) {
    return number?.toString()?.trim() || "";
  }

  return num?.toLocaleString("ko-KR") || "";
};

// 통화 표시 (USD/KRW/JPY)
type SupportedCurrency = "USD" | "KRW" | "JPY";

const formatCurrency = (
  amount: number | string,
  currency: SupportedCurrency,
  options?: Intl.NumberFormatOptions
): string => {
  const num = Number(amount);
  if (isNaN(num)) return "";

  // 기본 소수 자릿수: USD=2, KRW=0, JPY=0
  const defaultFraction: Record<SupportedCurrency, number> = {
    USD: 2,
    KRW: 0,
    JPY: 0,
  };

  const symbols: Record<SupportedCurrency, string> = {
    USD: "$",
    KRW: "₩",
    JPY: "¥",
  };

  const formattedNumber = num.toLocaleString("ko-KR", {
    minimumFractionDigits: options?.minimumFractionDigits ?? defaultFraction[currency],
    maximumFractionDigits: options?.maximumFractionDigits ?? defaultFraction[currency],
  });

  return `${symbols[currency]} ${formattedNumber}`;
};

// 시간 프리셋 매핑
const TIME_PRESETS: Record<string, () => Date> = {
  today: () => new Date(),
  agoDay1: () => subDays(new Date(), 1),
  agoDay3: () => subDays(new Date(), 3),
  agoDay7: () => subDays(new Date(), 7),
  agoMonth1: () => subMonths(new Date(), 1),
  agoMonth3: () => subMonths(new Date(), 3),
  agoMonth6: () => subMonths(new Date(), 6),
  all: () => new Date("2020-01-01"),
  afterYear3: () => addYears(new Date(), 3),
};

// 시간 포맷팅
const formatDate = (
  time: Date | string | number,
  formatString: string = "yyyy-MM-dd HH:mm:ss"
): string => {
  // lodash isEmpty: null, undefined, '' 모두 체크

  if (isNil(time) || !formatString) return "";

  // lodash isString과 has로 프리셋 체크
  if (isString(time) && has(TIME_PRESETS, time)) {
    const date = TIME_PRESETS[time]();
    return format(date, formatString, { locale: ko });
  }

  // Date 객체 또는 변환 가능한 값 처리
  // isEmpty 체크 후이므로 time은 null이 아님
  const parsedDate = new Date(time as Date | string | number);

  // date-fns isValid로 날짜 유효성 체크
  if (!isValid(parsedDate)) {
    // Date 형식이 아니면 원본 문자열 반환
    return time?.toString() || "";
  }

  return format(parsedDate, formatString, { locale: ko });
};

export {
  getItem,
  setItem,
  removeItem,
  clearLocalStorage,
  getErrorMessage,
  validatePassword,
  formatNumberWithCommas,
  formatCurrency,
  formatDate,
};
