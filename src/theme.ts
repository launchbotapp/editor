import { DefaultTheme } from 'styled-components';

/**
 * Type definitions
 */
export type Colors = {
  white: string;
  black: string;
  blackLight: string;
  greyLight: string;
  grey: string;
  [key: string]: string;
}

export type Fonts = {
  sansSerif: string,
}

export type Spaces = {
  sm: string;
  med: string;
  lg: string;
}

declare module "styled-components" {
  export interface DefaultTheme {
    // colors
    colors: Colors;
    textColor: string;
    backgroundColor: string;
    backgroundAccentColor: string;
    borderColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    iconColor: string;

    // fonts
    fontFamily: string;

    // other
    border: string;
  }
}

/**
 * Variable definitions
 */
export const colors: Colors = {
  white: "#FFFFFF",
  black: "#181A1B",
  blackLight: "#464849",
  grey: "#AAAAAA",
  greyLight: "#CCCCCC",
}

export const fonts: Fonts = {
  sansSerif: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif",
}

export const space: Spaces = {
  sm: "8px",
  med: "16px",
  lg: "24px",
}

/**
 * Themes
 */
const base: DefaultTheme = {
  colors,
  textColor: colors.black,
  backgroundColor: colors.white,
  backgroundAccentColor: colors.red,
  borderColor: colors.greyLight,
  buttonBackgroundColor: colors.black,
  buttonTextColor: colors.white,
  iconColor: colors.grey,
  fontFamily: fonts.sansSerif,
  border: `1px solid ${colors.greyLight}`,
}

export const lightTheme: DefaultTheme = {
  ...base,
}

export const darkTheme: DefaultTheme = {
  ...base,
  textColor: colors.white,
  backgroundColor: colors.black,
  backgroundAccentColor: colors.blackLight,
  border: `1px solid ${colors.blackLight}`,
}