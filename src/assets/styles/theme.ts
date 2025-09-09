import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primary: "#005d9fff",
    secondary: "#828282",
    caution: "#ff9c46ff",
    success: "#28a745",
    danger: "#dc3545",
    gray_L: "#e0e0e0",
    gray_M: "#bdbdbd",
    gray_D: "#4f4f4f",
    background_Overlay: "rgba(0,0,0,0.5)",
    background_D: "#212529",
    background_B: "rgba(240, 240, 240, 1)",
    border_Light: "#dee2e6",
    border_Dark: "#343a40",
    header: "rgba(0, 0, 0, 0.66)",
    text_D: "#212529", // 어두운 텍스트
    text_B: "#f2f2f2", // 밝은 텍스트
    disable: "rgba(85, 85, 85, 0.45)",
    card: "#f8f9fa",
  },

  size: {
    layout: {
      L: "1440px",
      M: "1280px",
    },
    modal: {
      width: "400px",
    },
    header: {
      height: "70px",
    },
    container_S: "600px",
    containerMax: "1200px",
    bottomLine: "1080px", // 요청에 따라 추가
  },

  fontSize: {
    display: {
      min: "48px",
      max: "64px",
    },
    title: {
      min: "24px",
      max: "28px",
    },
    subtitle: "20px",
    body: {
      min: "14px",
      max: "16px",
    },
    button: {
      min: "14px",
      max: "16px",
    },
    modal: {
      min: "12px",
      max: "14px",
    },
    small: {
      min: "12px",
      max: "13px",
    },
    contents: {
      small: "",
      medium: "18px",
      large: "",
    },
  },

  font: {
    primary: "NotoSans",
    logo: "BlackHanSans",
  },

  shadow: {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 20px rgba(0,0,0,0.15)",
  },

  transition: {
    default: "all 0.3s ease",
    fast: "all 0.15s ease-in",
    slow: "all 0.5s ease",
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    header: 1050,
    overlay: 1100,
    modal: 1200,
    tooltip: 1300,
  },
};
