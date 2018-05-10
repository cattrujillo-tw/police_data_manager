import Civilian from "./civilian";
import Attachment from "./attachment";
import Address from "./Address";
import CaseOfficer from "./caseOfficer";

class Case {
    constructor(build) {
        this.id = build.id
        this.civilians = build.civilians
        this.complainantType = build.complainantType
        this.status = build.status
        this.createdAt = build.createdAt
        this.firstContactDate = build.firstContactDate
        this.complainantType = build.complainantType
        this.createdBy = build.createdBy
        this.assignedTo = build.assignedTo
        this.narrativeDetails = build.narrativeDetails
        this.narrativeSummary = build.narrativeSummary
        this.attachments = build.attachments
        this.incidentDate = build.incidentDate
        this.incidentTime = build.incidentTime
        this.incidentLocationId = build.incidentLocationId
        this.incidentLocation = build.incidentLocation
        this.district = build.district
        this.accusedOfficers = build.accusedOfficers
        this.complainantWitnessOfficers = build.complainantWitnessOfficers
    }

    static get Builder() {
        class Builder {
            defaultCase() {
                const id = 17
                this.id = id
                this.civilians = [new Civilian.Builder().defaultCivilian().build()]
                this.status = 'Initial'
                this.createdAt = new Date(2015, 8, 13).toISOString()
                this.firstContactDate = "2017-12-25T00:00:00.000Z"
                this.incidentDate = '2017-01-01'
                this.incidentTime = '16:00:00'
                this.incidentLocation = new Address.Builder().defaultAddress().build()
                this.incidentLocationId = this.incidentLocation.id
                this.complainantType = 'Civilian'
                this.createdBy = 'tuser'
                this.assignedTo = 'tuser'
                this.narrativeDetails = null
                this.narrativeSummary = null
                this.attachments = [new Attachment.Builder().defaultAttachment().withCaseId(id).build()]
                this.accusedOfficers = [new CaseOfficer.Builder().defaultCaseOfficer().withCaseId(id).withRoleOnCase("Accused").build()]
                this.complainantWitnessOfficers = [new CaseOfficer.Builder().defaultCaseOfficer().withCaseId(id).withRoleOnCase("Complainant").build()]
                return this;
            }

            withId(id) {
                this.id = id
                return this;
            }


            withCivilians(civilians) {
                this.civilians = civilians
                return this;
            }

            withDistrict(district) {
                this.district = district
                return this
            }

            withComplainantType(complainantType) {
                this.complainantType = complainantType
                return this;
            }

            withStatus(status) {
                this.status = status
                return this;
            }

            withCreatedAt(createdAt) {
                this.createdAt = createdAt
                return this;
            }

            withIncidentDate(incidentDate) {
                this.incidentDate = incidentDate
                return this
            }
            withIncidentTime(incidentTime) {
                this.incidentTime = incidentTime
                return this
            }

            withIncidentLocation(incidentLocation){
                if (incidentLocation){
                    this.incidentLocation = incidentLocation
                    this.incidentLocationId = incidentLocation.id
                }else{
                    this.incidentLocation = undefined
                    this.incidentLocationId = undefined
                }
                return this
            }

            withCreatedBy(createdBy){
                this.createdBy = createdBy
                return this
            }

            withAssignedTo(assignedTo){
                this.assignedTo = assignedTo
                return this
            }

            withFirstContactDate(firstContactDate) {
                this.firstContactDate = firstContactDate
                return this;
            }

            withNarrativeDetails(narrativeDetails) {
                this.narrativeDetails = narrativeDetails
                return this
            }

            withNarrativeSummary(narrativeSummary) {
                this.narrativeSummary = narrativeSummary
                return this
            }

            withAttachments(attachments) {
                this.attachments = attachments
                return this
            }

            withAccusedOfficers(accusedOfficers) {
                this.accusedOfficers = accusedOfficers
                return this
            }

            withComplainantWitnessOfficers(complainantWitnessOfficers) {
                this.complainantWitnessOfficers = complainantWitnessOfficers;
                return this
            }

            build() {
                return new Case(this)
            }
        }

        return Builder;

    }
}

export default Case