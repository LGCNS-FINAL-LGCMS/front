// categoryApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";

interface Category {
  name: string;
  id: number;
}

interface CategoryApiResponse {
  status: string;
  message: string;
  data: Category[];
}

export const getCategorys = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<CategoryApiResponse>(
      API_ENDPOINTS.CATEGORY.GET
    );
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "카테고리 불러오기 실패";
    console.error("Category API error:", message);
    throw new Error(message);
  }
};
