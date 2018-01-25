import React, { Component } from 'react';
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";
import CaseCreationSnackbar from "./CaseCreationSnackbar/CaseCreationSnackbar";
import NavBar from '../sharedComponents/NavBar'
import {Typography} from "material-ui";
import {connect} from "react-redux";
import {closeCaseSnackbar} from "./actionCreators";

class CaseDashboard extends Component {

    componentWillUnmount(){
        this.props.dispatch(closeCaseSnackbar())
    }

    render(){
        return (
            <div>
                <NavBar>
                    <Typography
                        data-test="pageTitle"
                        type="title"
                        color="inherit"
                    >
                        View All Cases
                    </Typography>
                </NavBar>
                <CreateCaseDialog/>
                <CasesTable/>
                <CaseCreationSnackbar/>
            </div>
        );
    }
}

export default connect()(CaseDashboard)