import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Dark theme
const theme = createMuiTheme({
    palette: {
    type: "dark",
    primary: {
        main: "#247BF7",
        mainGradient:"linear-gradient(90deg, rgba(159,20,226,1) 19%, rgba(230,69,235,1) 47%, rgba(216,147,250,1) 91%)",
        light: "rgb(81, 91, 95)",
        dark: "rgb(26, 35, 39)",
        contrastText: "#ffffff",
    },
    secondary: {
        main: "#05B8A0",
        mainGradient:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        light: "rgb(255, 197, 112)",
        dark: "rgb(200, 147, 89)",
        contrastText: "rgba(0, 0, 0, 0.87)",
    },
    titleBar: {
        main: "#555555",
        contrastText: "#ffffff",
    },
    error: {
        main: red.A400,
    },
    background: {
        default: "#16161F"
      }
  },
});

export default theme;
