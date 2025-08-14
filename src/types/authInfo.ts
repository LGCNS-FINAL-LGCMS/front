// 카테고리 타입
export interface UserCategoriesList {
  id: number;
  name: string;
}

//로그인 시 백에서 주는 데이터
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    alreadyMember: boolean;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    memberInfo: {
      memberId: number;
      nickname: string;
      role: "ADMIN" | "LECTURER" | "STUDENT";
      getDesireLecturer: boolean;
      categories: UserCategoriesList[];
    };
  };
}

// 회원가입및 수정 시 백에서 주는 데이터
export interface SignupResponse {
  status: string;
  message: string;
  data: {
    memberInfo: {
      memberId: number;
      nickname: string;
      role: "ADMIN" | "LECTURER" | "STUDENT";
      getDesireLecturer: boolean;
      categories: UserCategoriesList[];
    };
  };
}

export interface UserInfo {
  memberId: number;
  nickname: string;
  role: "ADMIN" | "LECTURER" | "STUDENT";
  getDesireLecturer: boolean;
  categories: UserCategoriesList[];
}
