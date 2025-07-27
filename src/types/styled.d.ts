// styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      caution: string;
      danger: string;
      background_D: string;
      background_B: string;
      header: string;
      text_D: string;
      text_B: string;
      disable: string;
    };
    size: {
      maxWidth: string;
    };
    font: {
      primary: string;
      logo: string;
    };
  }
}
