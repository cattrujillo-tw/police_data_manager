import { createMuiTheme } from "@material-ui/core/styles";

const gray = "#f0f0f0";
const blue = "#216da1";
const gold = "#c5ad51";

const colors = {
  primary: {
    main: blue,
    contrastText: gray
  }
};

const standards = {
  fontLarge: "1.3rem",
  fontExtraLarge: "3rem"
};

const styles = {
  colors,
  title: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  },
  subheading: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  },
  body1: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  },
  caption: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  },
  button: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  },
  display1: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  },
  section: {
    color: colors.primary.main,
    fontSize: standards.fontExtraLarge,
    fontWeight: 400
  }
};

const muiTheme = createMuiTheme({
  palette: styles.colors,
  typography: {
    h6: styles.title,
    subtitle1: styles.subheading,
    body2: styles.body1,
    caption: styles.caption,
    button: styles.button,
    h4: styles.display1,
    subtitle2: styles.section
  }
});

export default muiTheme;
