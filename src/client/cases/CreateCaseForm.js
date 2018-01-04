import React from 'react';
import { Field, reduxForm } from 'redux-form'
import TextFieldWrapper from '../formFields/TextFieldWrapper'
import createCase from "./thunks/createCase";

const CreateCaseForm = () => {
    return (
        <form data-test="createCaseForm">
            <Field
                name="firstName"
                label="First Name"
                InputProps={{
                    "data-test": "firstNameInput"
                }}
                component={TextFieldWrapper}
            />
            <Field
                InputProps={{
                    "data-test": "lastNameInput"
                }}
                name="lastName"
                label="Last Name"
                component={TextFieldWrapper}
            />
        </form>
    )
};

const dispatchCreateCase = (values, dispatch) => {
    dispatch(createCase(values))
}

export default reduxForm({
    form: 'CreateCase',
    onSubmit: dispatchCreateCase
})(CreateCaseForm);