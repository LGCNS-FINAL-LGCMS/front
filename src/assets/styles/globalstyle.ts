import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

const GlobalStyle = createGlobalStyle`
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
