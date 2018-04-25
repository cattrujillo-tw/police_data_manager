const moment = require("moment")

const models = require('../../models')

async function upsertAddress(caseId, incidentLocationId, incidentLocation, transaction) {

    if (!incidentLocationId) {
        const createdAddress = await models.address.create(
            {
                ...incidentLocation,
            }, {
                transaction
            })

        await models.cases.update({
            incidentLocationId: createdAddress.id
        }, {
            where: {id: caseId},
            transaction
        })
    } else {
        await models.address.update(
            incidentLocation,
            {
                where: {id: incidentLocationId},
                transaction
            })
    }
}

const editCase = async (request, response, next) => {
    try {
        if(!request.body.firstContactDate || !moment(request.body.firstContactDate).isValid()) {
            response.status(400).json({ error: "firstContactDate is required"});
        }

        else {
            const updatedCase = await models.sequelize.transaction(async (transaction) => {

                const {incidentLocationId, incidentLocation, ...caseValues} = request.body

                if (incidentLocation) {
                    await upsertAddress(request.params.id, incidentLocationId, incidentLocation, transaction);
                }

                await models.cases.update(
                    caseValues,
                    {
                        where: {id: request.params.id},
                        individualHooks: true,
                        transaction,
                    })

                await models.audit_log.create({
                    action: 'Incident details updated',
                    caseId: request.params.id,
                    user: request.nickname
                },
                {
                    transaction
                })

                return await models.cases.findById(
                    request.params.id,
                    {
                        include: [
                            {
                                model: models.civilian,
                                include: [models.address]
                            },
                            {
                                model: models.attachment
                            },
                            {
                                model: models.address,
                                as: 'incidentLocation'
                            },
                            {
                                model: models.case_officer,
                                as: "accusedOfficers",
                                include: [models.officer]
                            }

                        ],
                        transaction: transaction
                    }
                )
            })
            response.status(200).send(updatedCase)
        }
    } catch(error) {
        next(error);
    }
}

module.exports = editCase;