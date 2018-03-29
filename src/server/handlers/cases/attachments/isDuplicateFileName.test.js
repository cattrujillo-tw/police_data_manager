import Case from "../../../../client/testUtilities/case"
const models = require("../../../models")
const isDuplicateFileName = require("./isDuplicateFileName")

describe('generateFileName', () => {
    let newCase
    beforeEach(async () => {
        const someCase = new Case.Builder().defaultCase()
            .withId(undefined)
            .withCivilians([])
            .withAttachments([])

        newCase = await models.cases.create(someCase)
    })

    test('should return true when file with requested name has been added to case', async () => {
        const requestedFileName = 'dog_nose.jpeg'
        await models.attachment.create({
            caseId: newCase.id,
            description: "test description",
            fileName: requestedFileName
        })

        const result = await isDuplicateFileName(newCase.id, requestedFileName)

        expect(result).toEqual(true)
    })

    test('should return false when file name does not exactly match an existing attachment for this case', async () => {
        const requestedFileName = 'dog_nose.jpeg'

        await models.attachment.create({
            caseId: newCase.id,
            description: "test description",
            fileName: `1-${requestedFileName}`
        })

        const result = await isDuplicateFileName(newCase.id, requestedFileName)

        expect(result).toEqual(false)
    })

    test('should return false when file with requested name has not been added to case', async () => {
        const requestedFileName = 'dog_nose.jpeg'

        const result = await isDuplicateFileName(newCase.id, requestedFileName)

        expect(result).toEqual(false)
    })
})