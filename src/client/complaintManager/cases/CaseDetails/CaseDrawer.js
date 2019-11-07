import React from "react";
import formatDate from "../../utilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import { Drawer, Typography } from "@material-ui/core";
import CaseNotes from "./CaseNotes/CaseNotes";
import CaseTags from "./CaseTags/CaseTags";
import ArchiveCaseButton from "./ArchiveCaseButton/ArchiveCaseButton";
import RestoreArchivedCaseButton from "./RestoreArchivedCaseButton/RestoreArchivedCaseButton";

const renderArchiveOrRestoreButton = isArchived =>
  isArchived ? <RestoreArchivedCaseButton /> : <ArchiveCaseButton />;

const CaseDrawer = ({ classes, caseDetails, caseTaggingFeature = false }) => {
  let lastDrawerRowClassName;
  if (caseTaggingFeature) {
    lastDrawerRowClassName = classes.drawerRowEnd;
  } else {
    lastDrawerRowClassName = classes.drawerRow;
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div>
        <LinkButton
          data-test="all-cases-link"
          component={Link}
          to={"/"}
          style={{ margin: "4% 0% 5% 2%" }}
        >
          Back to all Cases
        </LinkButton>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              data-test="case-reference"
              variant="title"
              style={{
                marginTop: "4px",
                flex: 1
              }}
              gutterBottom
            >
              {`Case #${caseDetails.caseReference}`}
            </Typography>
            {renderArchiveOrRestoreButton(caseDetails.isArchived)}
          </div>
          <div className={classes.drawerRow}>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Created By</Typography>
              <Typography data-test="created-by" variant="body1">
                {caseDetails.createdBy}
              </Typography>
            </div>
          </div>
          <div className={lastDrawerRowClassName}>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Created On</Typography>
              <Typography data-test="created-on" variant="body1">
                {formatDate(caseDetails.createdAt)}
              </Typography>
            </div>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Complaint Type</Typography>
              <Typography data-test="complaint-type" variant="body1">
                {caseDetails.complaintType}
              </Typography>
            </div>
          </div>
          {!caseTaggingFeature && (
            <div className={classes.drawerRowEnd}>
              <div className={classes.drawerRowItem}>
                <Typography variant="caption">Assigned To</Typography>
                <Typography data-test="assigned-to" variant="body1">
                  {caseDetails.assignedTo}
                </Typography>
              </div>
              <div className={classes.drawerRowItem} />
              <div className={classes.drawerRowItem} />
            </div>
          )}
        </div>
        {caseTaggingFeature && <CaseTags />}
        <CaseNotes />
      </div>
    </Drawer>
  );
};

export default CaseDrawer;