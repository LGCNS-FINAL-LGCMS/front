interface AxiosErrorData {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getErrorMessage = (
  error: unknown,
  defaultMsg = "알 수 없는 오류"
) => {
  const axiosError = error as AxiosErrorData;
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMsg;
};
