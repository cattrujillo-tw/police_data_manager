import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseButton from "./CreateCaseButton";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import {
  resetWorkingCasesLoaded,
  updateSort
} from "../actionCreators/casesActionCreators";
import { complaintManagerMenuOptions } from "../shared/components/NavBar/complaintManagerMenuOptions";
import showMyNewNotification from "./thunks/showMyNewNotification";
// import {showNotification} from "complaint_manager/public/notifications-sw.js";

class CaseDashboard extends Component {
  componentWillUnmount() {
    this.props.resetWorkingCasesLoaded();
  }

  showNotification = event => {
    this.props.showMyNewNotification(event.data.body);
  };

  componentDidMount() {
    navigator.serviceWorker.addEventListener(
      "message",
      this.showNotification.bind(this)
    );
  }

  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>View All Cases</NavBar>
        <CreateCaseButton />
        <CasesTable currentPage={this.props.currentPage} archived={false} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSort,
  resetWorkingCasesLoaded,
  showMyNewNotification
};

const mapStateToProps = (state, ownProps) => ({
  currentPage: state.cases.working.currentPage
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseDashboard);
