import { createGlobalStyle } from "styled-components";

// ======폰트=======
import BlackHanSans from "../fonts/BlackHanSans-Regular.ttf";
import NotoSans_B from "../fonts/NotoSansKR-Bold.ttf";
import NotoSans_R from "../fonts/NotoSansKR-Regular.ttf";
import NotoSans_T from "../fonts/NotoSansKR-Thin.ttf";

const GlobalStyle = createGlobalStyle`

 /* 폰트 등록 */
 @font-face {
    font-family: 'BlackHanSans';
    src: url(${BlackHanSans}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSans_T}) format('truetype');
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSans_R}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSans_B}) format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  /* 기본 스타일 */
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    background-color: ${(props) => props.theme.colors.background_B}; 
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
