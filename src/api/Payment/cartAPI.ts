import axios from "axios";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";
import apiClient from "../index";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";


export interface cartResponse {
  cartResponses: cartData[]
}
export interface CartApiResponse {
  status: string;
  message: string;
  data: cartResponse;
}

export interface cartData {
  id: number,
  lectureId: string,
  title: string,
  price: number,
  thumbnailUrl: string,
}

export interface postCartInputdto {
  lectureId: string,
  title: string,
  price: number,
  thumbnailUrl: string,
}

export const postCartInput = async (query: postCartInputdto): Promise<CartApiResponse> => {
  try {
    const response = await apiClient.post<CartApiResponse>(
      API_ENDPOINTS.CART.POST,
      { query }
    );
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "장바구니등록 실패");
    console.error("PostCartInput API error:", message);
    throw new Error(message);
  }
}

export const getCart = async (): Promise<cartResponse> => {
  try {
    const response = await apiClient.get<CartApiResponse>(
      API_ENDPOINTS.CART.GET,

      // // 테스트 용
      // "http://localhost:38111/cart",
      // {
      //   headers: {
      //     'X-USER-ID': 5,
      //   },
      // }
    );
    console.log(response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "장바구니불러오기 실패");
    console.error("GETCART API error:", message);
    throw new Error(message);
  }
}

export const deleteCart = async (itemId: number): Promise<CartApiResponse> => {
  try {
    const response = await apiClient.delete<CartApiResponse>(
      `${API_ENDPOINTS.CART.DELETE}/${itemId}`
      // `http://localhost:38111/cart/${itemId}`,
    );
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "장바구니 아이템 삭제 실패");
    console.error("GETCART API error:", message);
    throw new Error(message);
  }
}