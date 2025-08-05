import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primary: "#005d9fff",
    secondary: "#828282",
    caution: "#ff9c46ff",
    danger: "#dc3545",
    gray_L: "#e0e0e0", // 밝은 회색
    gray_M: "#bdbdbd", // 중간 회색
    gray_D: "#4f4f4f", // 어두운 회색
    background_Overlay: "rgba(0,0,0,0.5)",
    background_D: "#212529",
    background_B: "rgba(240, 240, 240, 1)",
    header: "rgba(0, 0, 0, 0.66)",
    text_D: "#212529", // 어두운 텍스트_Dark
    text_B: "#f2f2f2", // 밝은 텍스트_Bright
    disable: "rgba(85, 85, 85, 0.45)",
  },

  size: {
    maxWidth: "1200px",
    header_Height: "70px",
  },
  font: { primary: "GTL", logo: "BlackHanSans" },
};
