import React from "react";
import { connect } from "react-redux";
import Auth from "./common/auth/Auth";
import { userAuthSuccess } from "./common/auth/actionCreators";
import getFeatureToggles from "./complaintManager/featureToggles/thunks/getFeatureToggles";
import getAccessToken from "./common/auth/getAccessToken";

class Callback extends React.Component {
  componentDidMount() {
    const { location, userAuthSuccess, getFeatureToggles } = this.props;
    if (/access_token|id_token|error/.test(location.hash))
      new Auth().handleAuthentication(userAuthSuccess, getFeatureToggles);
    if (getAccessToken()) {
      //TODO: do subscription here
    }
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(null, mapDispatchToProps)(Callback);
