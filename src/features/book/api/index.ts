import type { BookResponse } from "@/features/book/types";
import { axiosClient } from "@/shared/api/axios";
import { BOOK_URL, KAKAO_REST_API_KEY } from "@/shared/api/routes";
import type { ApiResponse } from "@/shared/types";

const getBookListFn = async ({
  keyword,
  page,
  size,
  target,
}: {
  keyword: string;
  page?: string;
  size?: string;
  target?: "title" | "publisher" | "author";
}): Promise<ApiResponse<BookResponse[]>> => {
  const url = `${BOOK_URL}`;

  const res = await axiosClient.get(url, {
    params: {
      query: keyword,
      ...(page && { page }),
      ...(size && { size }),
      ...(target && { target }),
    },
    headers: {
      Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
    },
  });
  return res.data;
};

export { getBookListFn };
