/* eslint-disable @typescript-eslint/no-empty-object-type */

import "styled-components";
import { defatulTheme } from "../styles/themes/default";

type ThemeType = typeof defatulTheme;

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
