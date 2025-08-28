// categoryApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

interface CategoryApiResponse {
  status: string;
  message: string;
  data: Member;
}

interface Member {
  memberId: number;
  email: string;
  nickname: string;
  role: string;
  getDesireLecturer: boolean;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}

export const getCategorys = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<CategoryApiResponse>(
      API_ENDPOINTS.CATEGORY.GET
    );
    console.log(response);
    return response.data.data.categories;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "카테고리 불러오기 실패");
    console.error("Category API error:", message);
    throw new Error(message);
  }
};
