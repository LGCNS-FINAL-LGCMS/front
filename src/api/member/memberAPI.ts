import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

// get요청
export interface desirerResponseData{
    memberId: number;
    nickname: string;
    role: string;
    desireLecturer: boolean;
    desireLecturerDate: number[];
    categories: {
        id: number
        name: string
    }[];
}
export interface desirerResponse{
    status: string;
    message: string;
    data: desirerResponseData[];
}


export const getDesirers = async (): Promise<desirerResponse> => {
    try {
        const response = await apiClient.get<desirerResponse>(
            API_ENDPOINTS.MEMBER.DESIRER
        );
        // console.log("강사 승인대기자 목록 API 응답 성공!", response?.data);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = getErrorMessage(
            error,
            "강사승인대기자 목록 불러오기 실패"
        );

        // console.error("Member API error : ", errorMessage);
        throw new Error(errorMessage);
    }
};

// approve요청
export const postConfirmDesirer = async (
    memberIds: number[]
): Promise<desirerResponse> => {
    try {
        const response = await apiClient.post<desirerResponse>(
            API_ENDPOINTS.MEMBER.CONFIRM,
            { memberIds }
        );
        // console.log("강사 승인 API 응답 성공!", response?.data);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = getErrorMessage(
            error,
            "승인완료 요청 보내기 실패"
        );
        // console.error("Member API error : ", errorMessage);
        throw new Error(errorMessage);
    }
}
