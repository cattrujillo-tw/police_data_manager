import React, { Component } from "react";
import {
  Typography,
  Grid,
  Button,
  Icon,
  Container,
  Link
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import styles from "./dashboardStyling/styles";
import { DATA_SECTIONS } from "../../sharedUtilities/constants";
import DashboardNavBar from "./DashboardNavBar";
import DashboardDataSection from "./DashboardDataSection";
import moment from "moment";
import { formatShortDate } from "../../sharedUtilities/formatDate";

const scrollIntoViewById = selector => event => {
  const target = event.target.ownerDocument || document;
  const anchorElement = target.querySelector(selector);
  if (!anchorElement) return;

  anchorElement.scrollIntoView({
    behavior: "smooth"
  });
};

class PublicDataDashboard extends Component {
  render() {
    const currentDate = formatShortDate(moment(Date.now()));

    return (
      <MuiThemeProvider theme={dashboardStyling}>
        <Grid
          container
          spacing={3}
          style={{ padding: "64px", backgroundColor: "white" }}
        >
          <DashboardNavBar />
          <Grid item xs={8}>
            <Typography variant="h3">
              The{" "}
              <Link href="https://nolaipm.gov/" style={styles.link}>
                Office of the Independent Police Monitor
              </Link>{" "}
              (OIPM) is sharing data with the public to increase transparency to
              inform and empower the community the office was designed to serve.
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              The Office of the Independent Police Monitor receives
              commendations and complaints, monitors and reviews misconduct
              complaint investigations and disciplinary proceedings, and keeps
              data on relevant trends and patterns to communicate back to the
              NOPD through policy and practice recommendations.
            </Typography>
            <br />
            <Typography variant="body2">
              This dashboard showcases data visualizations regarding the
              complaint process and complaints the Office of the Independent
              Police Monitor received directly.
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: "116px" }}>
            <Container
              style={{
                padding: 0,
                margin: 0,
                flexDirection: "column",
                alignItems: "center",
                display: "flex",
                maxWidth: "220px"
              }}
            >
              <Button
                variant="contained"
                onClick={scrollIntoViewById("#blue-box")}
                style={{
                  textTransform: "none",
                  padding: "16px 48px",
                  borderRadius: 3,
                  boxShadow: "none",
                  backgroundColor: styles.colors.buttonGray,
                  marginBottom: "4px"
                }}
              >
                <Typography variant="body1">Explore the data</Typography>
              </Button>
              <Icon
                style={{
                  transform: "rotate(90deg)",
                  color: styles.colors.iconGray
                }}
                onClick={scrollIntoViewById("#blue-box")}
              >
                double_arrow
              </Icon>
            </Container>
          </Grid>
          <Grid
            item
            xs={12}
            id="blue-box"
            style={{
              backgroundColor: styles.colors.oipmBlue,
              padding: 0,
              marginBottom: "98px"
            }}
          >
            <Container style={{ padding: "110px 64px 128px" }}>
              <Typography
                variant="h2"
                style={{
                  color: styles.colors.white,
                  paddingLeft: "6px",
                  paddingBottom: "32px"
                }}
              >
                What are we looking for?
              </Typography>
              <Container
                onClick={scrollIntoViewById("#complaints-over-time")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  Who is submitting complaints over time?
                </Typography>
              </Container>
              <Container
                onClick={scrollIntoViewById("#complainants-submit-complaints")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  How do complainants submit complaints?
                </Typography>
              </Container>
              <Container
                onClick={scrollIntoViewById("#who-submits-complaints")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  Who submits complaints?
                </Typography>
              </Container>
              <Container
                onClick={scrollIntoViewById("#emerging-themes")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  What themes are emerging from the data?
                </Typography>
              </Container>
            </Container>
          </Grid>

          {Object.keys(DATA_SECTIONS).map((dataSectionType, index) => {
            return (
              <DashboardDataSection
                key={index}
                dataSectionType={dataSectionType}
              />
            );
          })}

          <Grid
            item
            xs={12}
            style={{
              backgroundColor: styles.colors.softBlack,
              padding: 0,
              marginBottom: "98px"
            }}
          >
            <Container style={{ padding: "110px 64px 128px" }}>
              <Typography
                variant="h2"
                style={{
                  color: styles.colors.white,
                  paddingLeft: "6px",
                  paddingBottom: "36px",
                  maxWidth: "65%"
                }}
              >
                Have you had an encounter with police?
              </Typography>
              <Button
                variant="contained"
                href="https://nolaipm.gov/file-a-complaint/"
                style={{
                  textTransform: "none",
                  padding: "16px 24px",
                  borderRadius: 0,
                  boxShadow: "none",
                  backgroundColor: styles.colors.buttonGray,
                  marginBottom: "4px"
                }}
              >
                <Typography variant="body2">
                  File a complaint or commendation
                </Typography>
              </Button>
            </Container>
          </Grid>
        </Grid>
        <Typography
          style={{
            color: styles.colors.textGray,
            padding: "24px 56px 56px 56px"
          }}
        >
          {`Last updated ${currentDate}`}
        </Typography>
      </MuiThemeProvider>
    );
  }
}

export default PublicDataDashboard;