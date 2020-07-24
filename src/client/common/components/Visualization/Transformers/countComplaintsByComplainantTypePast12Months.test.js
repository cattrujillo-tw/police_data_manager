import {
  enableCountHighlight,
  enableDateHighlight,
  transformData
} from "./countComplaintsByComplainantTypePast12Months";

describe("helper functions in Complainant Type Past 12 Months", () => {
  let rawData = {
    CC: [
      {
        date: "Jun 19",
        count: 1
      },
      {
        date: "Jul 19",
        count: 4
      }
    ],
    PO: [
      {
        date: "Jun 19",
        count: 8
      },
      {
        date: "Jul 19",
        count: 10
      }
    ],
    CN: [
      {
        date: "Jun 19",
        count: 3
      },
      {
        date: "Jul 19",
        count: 2
      }
    ],
    AC: [
      {
        date: "Jun 19",
        count: 0
      },
      {
        date: "Jul 19",
        count: 7
      }
    ]
  };

  test("should determine y-maximum as rounded 10% units higher than highest count", () => {
    const maximum = transformData(rawData).layout.yaxis.range[1];

    expect(maximum).toEqual(12);
  });

  test("should highlight within the date range", () => {
    const ccDateHighlight = enableDateHighlight(rawData["CC"]);

    expect(ccDateHighlight).toEqual(["Jun 19", "Jul 19", "Jul 19", "Jun 19"]);
  });

  test("should highlight within the count range", () => {
    const maximum = 12;
    const poCountHighlight = enableCountHighlight(rawData["PO"], maximum);

    expect(poCountHighlight).toEqual([8.6, 10.6, 9.4, 7.4]);
  });
});