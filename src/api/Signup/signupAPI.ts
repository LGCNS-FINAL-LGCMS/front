// nickname API
export const checkNicknameDuplicate = async (nickname: string) => {
  try {
    const response = await fetch("/api/auth/check/nickname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: nickname.trim() }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("호출 실패 -> 더미데이터", error);
    if (nickname == "test") {
      return { status: "OK", data: { isDuplicate: true } };
    } else {
      return { status: "OK", data: { isDuplicate: false } };
    }
  }
};

//회원가입 api
export const signupResponse = async (
  nickname: string,
  isTeacher: boolean | null
) => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: nickname.trim(),
        isTeacher: isTeacher,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("호출 실패 -> 더미데이터", error);
    return { status: "OK", data: { nickname: nickname } };
    // return { status: "LEC-13", data: null };
  }
};
