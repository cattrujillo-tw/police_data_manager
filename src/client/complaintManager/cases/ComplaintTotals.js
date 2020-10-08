import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

const DashboardTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.primary.contrastText,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 14
  }
}))(Tooltip);

const ComplaintTotals = () => {
  const [data, setData] = useState({ ytd: null, previousYear: null });
  const previousYear = new Date().getFullYear() - 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/data?queryType=${QUERY_TYPES.COUNT_COMPLAINT_TOTALS}`
        );
        setData(response.data);
      } catch (e) {
        setData({ ytd: null, previousYear: null });
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

  return (
    <div
      data-testid={"complaintTotals"}
      style={{ marginLeft: "5%", marginTop: "1%" }}
    >
      <DashboardTooltip title={longText} placement="bottom-start">
        <Typography variant="h6">Complaints YTD: {data.ytd}</Typography>
      </DashboardTooltip>
      <Typography variant="h6">
        Complaints {previousYear}: {data.previousYear}
      </Typography>
    </div>
  );
};

export default ComplaintTotals;
