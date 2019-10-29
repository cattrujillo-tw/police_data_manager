import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withStyles
} from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import React from "react";
import { CREATE_MATRIX_FORM_NAME } from "../../../../sharedUtilities/constants";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import PIBControlField from "../../sharedFormComponents/PIBControlField";
import DropdownSelect from "../../../cases/CaseDetails/CivilianDialog/DropdownSelect";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import getUsers from "../thunks/getUsers";

const styles = theme => ({
  dialogPaper: {
    minWidth: "40%",
    maxWidth: "400px"
  },
  dialogAction: {
    justifyContent: "space-between",
    margin: `${theme.spacing.unit * 2}px`
  }
});

class CreateMatrixDialog extends React.Component {
  componentDidMount() {
    this.props.getUsers();
  }

  closeDialog = () => {
    this.props.closeCreateDialog(DialogTypes.MATRIX);
    this.props.reset(CREATE_MATRIX_FORM_NAME);
  };

  render() {
    const mappedUsers = this.props.allUsers.map(user => {
      return [user.name, user.email];
    });
    return (
      <Dialog
        data-test="create-matrix-dialog"
        classes={{ paper: this.props.classes.dialogPaper }}
        open={this.props.open}
        fullWidth
      >
        <DialogTitle
          data-test="create-matrix-dialog-title"
          style={{ paddingBottom: "1%" }}
        >
          Create New Matrix
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form data-test="create-matrix-form">
            <PIBControlField />
            <br />
            <Field
              inputProps={{
                "data-test": "first-reviewer-dropdown-input"
              }}
              data-test="first-reviewer-dropdown"
              component={DropdownSelect}
              name="firstReviewer"
              label="First Reviewer"
              isCreatable={false}
              style={{ width: "12rem" }}
              required
            >
              {generateMenuOptions(mappedUsers)}
            </Field>
            <br />
            <Field
              inputProps={{
                "data-test": "second-reviewer-dropdown-input"
              }}
              data-test="second-reviewer-dropdown"
              component={DropdownSelect}
              name="secondReviewer"
              label="Second Reviewer"
              isCreatable={false}
              style={{ width: "12rem" }}
              required
            >
              {generateMenuOptions(mappedUsers)}
            </Field>
          </form>
        </DialogContent>
        <DialogActions classes={{ root: this.props.classes.dialogAction }}>
          <SecondaryButton data-test="cancel-matrix" onClick={this.closeDialog}>
            Cancel
          </SecondaryButton>
          <PrimaryButton>Create and Search</PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.ui.createDialog.matrix.open,
  allUsers: state.users.all
});

const mapDispatchToProps = {
  closeCreateDialog: closeCreateDialog,
  getUsers: getUsers
};

const connectedForm = reduxForm({
  form: CREATE_MATRIX_FORM_NAME
})(CreateMatrixDialog);

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(connectedForm)
);