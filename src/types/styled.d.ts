// styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      caution: string;
      danger: string;
      gray_L: string;
      gray_M: string;
      gray_D: string;
      background_Overlay: string;
      background_D: string;
      background_B: string;
      border_Light: string;
      border_Dark: string;
      header: string;
      text_D: string;
      text_B: string;
      disable: string;
    };

    size: {
      maxWidth: string;
      header_Height: string;
    };
    font: {
      primary: string;
      logo: string;
    };
  }
}
