import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
    palette: {
        primary: {
            main: '#202037',
            background: '#F0F2F5'
        }
    }
})

export default function CustomTheme (props) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    );
}