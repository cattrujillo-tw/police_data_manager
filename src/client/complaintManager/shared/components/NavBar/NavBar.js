import React, { Component } from "react";
import HomeIcon from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/MenuSharp";
import {
  AppBar,
  IconButton,
  Menu,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ExportConfirmationDialog from "../../../export/ExportConfirmationDialog";
import MenuNavigator from "./MenuNavigator";
import standards from "../../../../common/globalStyling/standards";
import styles from "../../../../common/globalStyling/styles";
import NotificationDrawer from "../Notification/NotificationDrawer";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import NotificationsIcon from "@material-ui/icons/Notifications";
import getNotifications from "../../thunks/getNotifications";
import getAccessToken from "../../../../common/auth/getAccessToken";

class NavBar extends Component {
  state = {
    menuOpen: false,
    anchorEl: null,
    exportDialogOpen: false,
    notificationDrawer: false,
    notifications: []
  };

  componentDidMount() {
    // how to make this url dynamic based upon environment ??
    const token = getAccessToken();
    const events = new EventSource(
      `https://localhost:1234/api/notifications?token=${token}`
    );
    console.log("Mounted new event @ /notifications");
    events.onmessage = event => {
      const parsedData = JSON.parse(event.data);
      console.log("Got an event from server: ", parsedData);
    };
    events.onerror = event => {
      console.log("Errorr", event);
    };
  }

  handleMenuOpen = event => {
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null
    });
  };

  handleNotificationClick = () => {
    const open = this.state.notificationDrawer;
    if (!open) {
      this.props.getNotifications(this.props.nickname);
    }
    this.setState({
      notificationDrawer: !open
    });
  };

  render() {
    const { showHome, nickname, children, menuType, dataTest } = this.props;
    const appBarStyle = showHome ? styles.appBarStyle : this.props.customStyle;
    const dataTestTitle = dataTest ? dataTest : "pageTitle";
    const theme = createMuiTheme();
    return (
      <AppBar
        position="static"
        style={{ ...appBarStyle, ...{ zIndex: theme.zIndex.drawer + 1000 } }}
        data-testid="header"
      >
        <Toolbar>
          {showHome ? (
            <IconButton
              component={Link}
              to="/"
              data-testid="homeButton"
              style={{
                color: !this.state.notificationDrawer ? "inherit" : "white"
              }}
              disabled={this.state.notificationDrawer}
            >
              <HomeIcon />
            </IconButton>
          ) : (
            ""
          )}
          <Typography data-testid={dataTestTitle} variant="h6" color="inherit">
            {children}
          </Typography>

          <div style={{ flex: 1, flexDirection: "row-reverse" }} />

          <Typography
            data-testid="userNickName"
            variant="h6"
            color="inherit"
          >{`${nickname}`}</Typography>
          {this.props.notificationFeature ? (
            <IconButton
              color="inherit"
              className="notificationBell"
              data-testid="notificationBell"
              style={{ marginLeft: standards.small }}
              onClick={() => this.handleNotificationClick()}
            >
              <NotificationsIcon />
            </IconButton>
          ) : null}
          <NotificationDrawer
            open={this.state.notificationDrawer}
            onClose={() => this.handleNotificationClick()}
          />
          <IconButton
            data-testid="hamburgerButton"
            onClick={this.handleMenuOpen}
            style={{
              color: !this.state.notificationDrawer ? "inherit" : "white"
            }}
            disabled={this.state.notificationDrawer}
          >
            <Settings />
          </IconButton>
          <Menu
            open={this.state.menuOpen}
            data-testid="menu"
            style={{ zIndex: theme.zIndex.drawer + 10000 }}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            anchorEl={this.state.anchorEl}
            onClose={this.handleMenuClose}
          >
            <MenuNavigator
              menuType={menuType}
              handleMenuClose={this.handleMenuClose}
              featureToggles={this.props.featureToggles}
            />
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

NavBar.defaultProps = {
  showHome: true,
  matrixManager: false
};

const mapStateToProps = state => ({
  nickname: state.users.current.userInfo.nickname,
  permissions: state.users.current.userInfo.permissions,
  notificationFeature: state.featureToggles.notificationFeature,
  featureToggles: state.featureToggles
});

const mapDispatchToProps = {
  getNotifications
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
