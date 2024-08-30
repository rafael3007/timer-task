import { ThemeProvider } from "styled-components";
import Button from "./components/Button/Button";

import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";

export function App() {

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Button variant="danger" />
        <Button variant="primary" />
        <Button variant="secondary" />
        <Button variant="success" />
        <Button />
        <GlobalStyle />
      </ThemeProvider>
    </>
  )
}

