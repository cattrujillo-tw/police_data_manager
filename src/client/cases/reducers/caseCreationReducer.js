const initialState = {
    success: false,
    message:''
}

const caseCreationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CASE_CREATION_REQUESTED':
            return {
                success: false,
                message: ''
            }
        case 'CASE_CREATED_SUCCESS':
            return {
                success: true,
                message: `Case ${action.caseDetails.id} was successfully created.`
            }
        case 'CASE_CREATION_FAILED':
            return {
                success: false,
                message: 'Something went wrong on our end and your case was not created. Please try again.'
            }
        default:
            return state
    }
}

export default caseCreationReducer