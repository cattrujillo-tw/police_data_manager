import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getPublicData from "./getPublicData";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import * as httpMocks from "node-mocks-http";
import * as countComplaintTotals from "./queries/countComplaintTotals";

const MOCK_INTAKE_SOURCE_DATA_VALUES = [
  { cases: "2", name: "Email" },
  { cases: "5", name: "Facebook" },
  { cases: "3", name: "Other" }
];

const MOCK_TOTAL_DATA_VALUES = [{ ytd: 10, previousYear: 20 }];

const MOCK_COMPLAINANT_TYPE_DATA_VALUES = [
  { complainantType: "Civilian (CC)" },
  { complainantType: "Police Officer (PO)" },
  { complainantType: "Anonymous (AC)" },
  { complainantType: "Civilian Within NOPD (CN)" }
];

const MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_DATA_VALUES = {
  CC: [
    {
      date: "Jun 19",
      count: 1
    }
  ],
  PO: [
    {
      date: "Jun 19",
      count: 8
    }
  ],
  CN: [
    {
      date: "Jun 19",
      count: 3
    }
  ],
  AC: [
    {
      date: "Jun 19",
      count: 0
    }
  ]
};

const MOCK_TOP_10_TAGS = [
  {
    name: "Chicago hot dogs",
    count: "3"
  },
  {
    name: "Tofu",
    count: "2"
  },
  {
    name: "karancitoooooo",
    count: "1"
  },
  {
    name: "sabs",
    count: "1"
  }
];

jest.mock("../../handlers/data/queries/countComplaintsByIntakeSource", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_INTAKE_SOURCE_DATA_VALUES;
  })
}));

jest.mock("../../handlers/data/queries/countComplaintTotals", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_TOTAL_DATA_VALUES;
  })
}));

jest.mock(
  "../../handlers/data/queries/countComplaintsByComplainantType",
  () => ({
    executeQuery: jest.fn(() => {
      return MOCK_COMPLAINANT_TYPE_DATA_VALUES;
    })
  })
);

jest.mock("../../handlers/data/queries/countTop10Tags", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_TOP_10_TAGS;
  })
}));

jest.mock(
  "../../handlers/data/queries/countComplaintsByComplainantTypePast12Months",
  () => ({
    executeQuery: jest.fn(() => {
      return MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_DATA_VALUES;
    })
  })
);

describe("getPublicData", () => {
  let next, response;
  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(() => {
    next = jest.fn();
    response = httpMocks.createResponse();
  });

  test("should call getPublicData when countComplaintsByIntakeSource query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByIntakeSource"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(response._getData()).toEqual(MOCK_INTAKE_SOURCE_DATA_VALUES);
  });

  test("should call getPublicData when countComplaintTotals query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintTotals"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(response._getData()).toEqual(MOCK_TOTAL_DATA_VALUES);
  });

  test("should call getPublicData when countComplaintsByComplainantType query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByComplainantType"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(response._getData()).toEqual(MOCK_COMPLAINANT_TYPE_DATA_VALUES);
  });

  test("should call getPublicData when countComplaintsByComplainantTypePast12Months query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByComplainantTypePast12Months"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(response._getData()).toEqual(
      MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_DATA_VALUES
    );
  });

  test("should call getPublicData when countTop10Tags query called", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countTop10Tags"
      }
    });
  });

  test("throws an error when query param is not supported", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "unknown"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badData(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED)
    );
  });
});