// cartAPI
import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

interface PostCartProp {
  lectureId: string;
  title: string;
  price: number;
  thumbnailUrl: string | null | undefined;
}

export const postCartItem = async (
  item: PostCartProp
): Promise<PostCartProp> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.PAYMENT.CART.POST,
      item
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "장바구니 담기 실패");
    console.error("Post Cart API error:", message);

    throw new Error(message);
  }
};
