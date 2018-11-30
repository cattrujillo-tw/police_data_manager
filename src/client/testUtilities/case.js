import Civilian from "./civilian";
import Attachment from "./attachment";
import Address from "./Address";
import CaseOfficer from "./caseOfficer";
import Officer from "./Officer";
import {
  ACCUSED,
  CASE_STATUS,
  COMPLAINANT,
  WITNESS,
  CIVILIAN_INITIATED,
  ADDRESSABLE_TYPE
} from "../../sharedUtilities/constants";

class Case {
  constructor(build) {
    this.id = build.id;
    this.complainantCivilians = build.complainantCivilians;
    this.witnessCivilians = build.witnessCivilians;
    this.complaintType = build.complaintType;
    this.status = build.status;
    this.createdAt = build.createdAt;
    this.firstContactDate = build.firstContactDate;
    this.createdBy = build.createdBy;
    this.assignedTo = build.assignedTo;
    this.narrativeDetails = build.narrativeDetails;
    this.narrativeSummary = build.narrativeSummary;
    this.attachments = build.attachments;
    this.incidentDate = build.incidentDate;
    this.incidentTime = build.incidentTime;
    this.incidentLocation = build.incidentLocation;
    this.district = build.district;
    this.classificationId = build.classificationId;
    this.accusedOfficers = build.accusedOfficers;
    this.complainantOfficers = build.complainantOfficers;
    this.witnessOfficers = build.witnessOfficers;
    this.caseNumber = build.caseNumber;
  }

  static get Builder() {
    class Builder {
      defaultCase() {
        const id = 17;
        const complainantCivilian = new Civilian.Builder()
          .defaultCivilian()
          .withId(23)
          .withRoleOnCase(COMPLAINANT)
          .build();
        const witnessCivilian = new Civilian.Builder()
          .defaultCivilian()
          .withId(32)
          .withNoAddress()
          .withRoleOnCase(WITNESS)
          .build();
        const accusedOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(456)
          .withOfficerAttributes(
            new Officer.Builder()
              .defaultOfficer()
              .withOfficerNumber(456)
              .withId(456)
              .build()
          )
          .withCaseId(id)
          .withRoleOnCase(ACCUSED)
          .build();
        const complainantOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(654)
          .withOfficerAttributes(
            new Officer.Builder()
              .defaultOfficer()
              .withOfficerNumber(654)
              .withId(654)
              .build()
          )
          .withCaseId(id)
          .withRoleOnCase(COMPLAINANT)
          .build();
        const witnessOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(565)
          .withOfficerAttributes(
            new Officer.Builder()
              .defaultOfficer()
              .withOfficerNumber(565)
              .withId(565)
              .build()
          )
          .withCaseId(id)
          .withRoleOnCase(WITNESS)
          .build();
        const attachment = new Attachment.Builder()
          .defaultAttachment()
          .withCaseId(id)
          .build();
        const incidentLocation = new Address.Builder()
          .defaultAddress()
          .withAddressableType(ADDRESSABLE_TYPE.CASES)
          .withAddressableId(id)
          .build();

        this.id = id;
        this.complainantCivilians = [complainantCivilian];
        this.witnessCivilians = [witnessCivilian];
        this.status = CASE_STATUS.INITIAL;
        this.createdAt = "2015-09-13T05:00:00.000Z";
        this.firstContactDate = "2017-12-24";
        this.incidentDate = "2017-01-01";
        this.incidentTime = "16:00:00";
        this.incidentLocation = incidentLocation;
        this.district = "First District";
        this.classificationId = null;
        this.complaintType = CIVILIAN_INITIATED;
        this.createdBy = "tuser";
        this.assignedTo = "tuser";
        this.narrativeDetails = null;
        this.narrativeSummary = null;
        this.attachments = [attachment];
        this.accusedOfficers = [accusedOfficer];
        this.complainantOfficers = [complainantOfficer];
        this.witnessOfficers = [witnessOfficer];
        this.caseNumber = "CC-2002-0055";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withComplainantCivilians(complainantCivilians) {
        this.complainantCivilians = complainantCivilians;
        return this;
      }

      withWitnessCivilians(witnessCivilians) {
        this.witnessCivilians = witnessCivilians;
        return this;
      }

      withDistrict(district) {
        this.district = district;
        return this;
      }

      withClassificationId(classificationId) {
        this.classificationId = classificationId;
        return this;
      }

      withComplaintType(complaintType) {
        this.complaintType = complaintType;
        return this;
      }

      withStatus(status) {
        this.status = status;
        return this;
      }

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      withIncidentDate(incidentDate) {
        this.incidentDate = incidentDate;
        return this;
      }
      withIncidentTime(incidentTime) {
        this.incidentTime = incidentTime;
        return this;
      }

      withIncidentLocation(incidentLocation) {
        this.incidentLocation = incidentLocation;
        return this;
      }

      withCreatedBy(createdBy) {
        this.createdBy = createdBy;
        return this;
      }

      withAssignedTo(assignedTo) {
        this.assignedTo = assignedTo;
        return this;
      }

      withFirstContactDate(firstContactDate) {
        this.firstContactDate = firstContactDate;
        return this;
      }

      withNarrativeDetails(narrativeDetails) {
        this.narrativeDetails = narrativeDetails;
        return this;
      }

      withNarrativeSummary(narrativeSummary) {
        this.narrativeSummary = narrativeSummary;
        return this;
      }

      withAttachments(attachments) {
        this.attachments = attachments;
        return this;
      }

      withAccusedOfficers(accusedOfficers) {
        this.accusedOfficers = accusedOfficers;
        return this;
      }

      withComplainantOfficers(complainantOfficers) {
        this.complainantOfficers = complainantOfficers;
        return this;
      }

      withWitnessOfficers(witnessOfficers) {
        this.witnessOfficers = witnessOfficers;
        return this;
      }

      build() {
        return new Case(this);
      }
    }

    return Builder;
  }
}

export default Case;
