// styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      caution: string;
      success: string;
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
      card: string;
    };

    size: {
      layout: {
        L: string;
        M: string;
      };
      modal: {
        width: string;
      };
      header: {
        height: string;
      };
      container_S: string;
      containerMax: string;
      bottomLine: string;
    };

    fontSize: {
      display: {
        min: string;
        max: string;
      };
      title: {
        min: string;
        max: string;
      };
      subtitle: string;
      body: {
        min: string;
        max: string;
      };
      button: {
        min: string;
        max: string;
      };
      modal: {
        min: string;
        max: string;
      };
      small: {
        min: string;
        max: string;
      };
      contents: {
        small: string;
        medium: string;
        large: string;
      };
    };

    font: {
      primary: string;
      logo: string;
    };

    shadow: {
      none: string;
      sm: string;
      md: string;
      lg: string;
    };

    transition: {
      default: string;
      fast: string;
      slow: string;
    };

    zIndex: {
      base: number;
      dropdown: number;
      header: number;
      overlay: number;
      modal: number;
      tooltip: number;
    };
  }
}
