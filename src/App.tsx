import Button from "./components/Button/Button";
import { ThemeProvider } from "styled-components";
import { defatulTheme } from "./styles/themes/default";

export function App() {

  return (
    <>
      <ThemeProvider theme={defatulTheme}>
        <Button variant="danger" />
        <Button variant="primary" />
        <Button variant="secondary" />
        <Button variant="success" />
        <Button />
      </ThemeProvider>
    </>
  )
}

