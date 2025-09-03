import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";
import apiClient from "../index";
import type { LectureItem } from "../../pages/PaymentPage/PaymentPage";

export interface paymentData {
  tid: string;
  nextStepUrl: string;
}
export interface lectureData {
  title: string;
  price: number;
  lectureId: string;
}
export interface paymentToken {
  tid: string; // 결제 아이디
  token: string; // 결제 토큰
  cartId: number[]; // 장바구니물품의 아이디 (long)
  lectureId: string[]; // 강의 아이디 (string)
}
export interface PaymentApiResponse {
  status: string;
  message: string;
  data: paymentData;
}

// payment/ready
export const postPaymentReady = async (
  lectureItem: LectureItem
): Promise<paymentData> => {
  try {
    const query: lectureData = {
      title: lectureItem.title,
      price: lectureItem.price,
      lectureId: lectureItem.lectureId,
    };
    console.log(query);

    const response = await apiClient.post<PaymentApiResponse>(
      API_ENDPOINTS.PAYMENT.READY,
      query,
      // "http://localhost:38111/payment/ready",
      // {
      //   headers: {
      //     'X-USER-ID': 5,'Content-Type': 'application/json'
      //   },
      // },
    );
    console.log(response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "결제준비 실패");
    console.error("PaymentReady API error:", message);
    throw new Error(message);
  }
};

// /payment/list/ready
export const postPaymentBundleReady = async (
  lectureItems: LectureItem[]
): Promise<paymentData> => {
  try {
    const lectureDatas: lectureData[] = lectureItems.map((item) => ({
      title: item.title,
      price: item.price,
      lectureId: item.lectureId,
    }));
    const response = await apiClient.post<PaymentApiResponse>(
      API_ENDPOINTS.PAYMENT.BUNDLEREADY,
      lectureDatas
      // "http://localhost:38111/payment/list/ready",
      //   lectureDatas,
      // {
      //   headers: {
      //     'X-USER-ID': 5,'Content-Type': 'application/json'
      //   },
      // },
    );
    console.log(response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "번들결제준비 실패");
    console.error("PaymentBundleReady API error:", message);
    throw new Error(message);
  }
};

// /payment/approve
export const postPaymentApprove = async (query: paymentToken) => {
  try {
    const response = await apiClient.post<PaymentApiResponse>(
      API_ENDPOINTS.PAYMENT.APPROVE,
      query
      // "http://localhost:38111/payment/approve",
      //   query,
      // {
      //   headers: {
      //     'X-USER-ID': 5,'Content-Type': 'application/json'
      //   },
      // },
    );
    console.log(response);
    if (response.status === 200) {
      return "결제가 완료되었습니다.";
    } else {
      return "결제가 실패하였습니다.";
    }
  } catch (error: unknown) {
    const message = getErrorMessage(error, "결제승인 실패");
    console.error("PaymentApprove API error:", message);
    throw new Error(message);
  }
};
