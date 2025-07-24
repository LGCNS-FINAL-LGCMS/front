import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primary: "#005d9fff",
    secondary: "#828282",
    caution: "#ff9c46ff",
    danger: "#dc3545",
    background_D: "#212529",
    background_B: "rgba(240, 240, 240, 1)",
    header: "rgba(0, 0, 0, 0.66)",
    text_D: "#212529", // 어두운 텍스트_Dark
    text_B: "#f2f2f2", // 밝은 텍스트_Bright
    disable: "rgba(85, 85, 85, 0.45)",
  },
  size: {
    maxWidth: "1200px",
  },
  font: { primary: "GTL", logo: "BlackHanSans" },
};
