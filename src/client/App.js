import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import history from "./history";
import { MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./common/globalStyling/muiTheme";
import { Paper } from "@material-ui/core";
import ScrollToTop from "./ScrollToTop";
import SharedSnackbarContainer from "./complaintManager/shared/components/SharedSnackbarContainer";
import AppRouter from "./AppRouter";
import getAccessToken from "./common/auth/getAccessToken";
import Auth from "./common/auth/Auth";
import { connect } from "react-redux";
import { userAuthSuccess } from "./common/auth/actionCreators";
import getFeatureToggles from "./complaintManager/featureToggles/thunks/getFeatureToggles";

class App extends Component {
  eventSource = undefined;

  componentDidMount() {
    console.log("Mount: Event Source: ", this.eventSource);
    const accessToken = getAccessToken();
    if (accessToken) {
      const auth = new Auth();
      auth.setUserInfoInStore(accessToken, this.props.userAuthSuccess);
      this.props.getFeatureToggles();
    }
  }

  componentWillUnmount() {
    console.log("Unmount: Event Source: ", this.eventSource);
    console.log("App componentWillUnmount!");
  }

  render() {
    console.log("UserInfo: ", this.props.currentUser);
    const token = getAccessToken();
    if (this.props.currentUser.nickname && token && !this.eventSource) {
      console.log(
        "Create event source here for ",
        this.props.currentUser.nickname
      );

      // how to make this url dynamic based upon environment ??
      // TODO: Use hostname config for all envs
      // TODO: Cache this eventsource so we dont create it with every render
      this.eventSource = new EventSource(
        `https://localhost:1234/api/notifications?token=${token}`
      );
      console.log("Mounted new event @ /notifications");
      this.eventSource.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        console.log("Got an event from server: ", parsedData);
      };
      this.eventSource.onerror = event => {
        console.log("Errorr", event);
      };

      console.log("Render: Event Source: ", this.eventSource);
    }
    return (
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={customTheme}>
          <Paper
            elevation={0}
            style={{ height: "100%", overflowY: "scroll", borderRadius: "0px" }}
          >
            <ScrollToTop>
              <AppRouter featureToggles={this.props.featureToggles} />
              <SharedSnackbarContainer />
            </ScrollToTop>
          </Paper>
        </MuiThemeProvider>
      </ConnectedRouter>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.current.userInfo,
  featureToggles: state.featureToggles
});

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
