import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {MenuItem, Paper, TextField} from 'material-ui';
import {change, clearSubmitErrors} from "redux-form";
import {connect} from "react-redux";
import {withStyles} from "material-ui/styles/index";
import poweredByGoogle from '../../../../assets/powered_by_google_on_white_hdpi.png'
import {CIVILIAN_FORM_NAME} from "../../../../sharedUtilities/constants";
import {updateAddressAutoSuggest} from "../../../actionCreators/casesActionCreators";
import formatAddress from "../../../utilities/formatAddress";

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
        width: '80%',
        marginBottom: '16px'
    },
    suggestionsContainerOpen: {
        position: 'relative',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
});


class AddressAutoSuggest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.defaultText || '',
            suggestionServiceAvailable: true,
            suggestions: []
        }
    }

    async componentDidMount() {
        await this.props.suggestionEngine.healthCheck(({googleAddressServiceIsAvailable}) => {
            this.setState({suggestionServiceAvailable: googleAddressServiceIsAvailable})
        })

    }

    renderInput = (inputProps) => {
        const {label, classes, ref, dataTest, reduxFormMeta, ...other} = inputProps;
        const shouldRenderError = Boolean(reduxFormMeta.error)

        if (!this.state.suggestionServiceAvailable) {
            return (
                <TextField
                    disabled={true}
                    label={label}
                    fullWidth
                    InputProps={{
                        classes: {
                            input: classes.input,
                        },
                        'data-test': dataTest,
                        inputProps: {value: 'Address lookup is down, please try again later'}
                    }}
                />
            );
        }
        return (
            <TextField
                label={label}
                fullWidth
                inputRef={ref}
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                    'data-test': dataTest,
                    ...other,
                }}
                error={shouldRenderError}
                helperText={reduxFormMeta.error}
                FormHelperTextProps={{
                    error: shouldRenderError
                }}

            />
        );


    }

    renderSuggestionsContainer = (options) => {
        const {containerProps, children} = options;
        return (
            <Paper {...containerProps} data-test='suggestion-container' square>
                {children}
                {
                    children
                        ? <div align="right"><img alt="Powered by Google" src={poweredByGoogle} height='20px'/></div>
                        : null
                }

            </Paper>
        );
    }

    renderSuggestion = (suggestion, {query, isHighlighted}) => {
        const suggestionValue = this.props.suggestionEngine.getSuggestionValue(suggestion)
        const matches = match(suggestionValue, query);
        const parts = parse(suggestionValue, matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight
                            ? (
                                <span key={String(index)} style={{fontWeight: 300}}>
                                {part.text}
                            </span>
                            )
                            : (
                                <strong key={String(index)} style={{fontWeight: 500}}>
                                    {part.text}
                                </strong>
                            );
                    })}
                </div>
            </MenuItem>
        );
    }

    getSuggestionValue = (suggestion) => {
        return this.props.suggestionEngine.getSuggestionValue(suggestion)
    }

    onSuggestionSelected = (event, {suggestion}) => {
        this.props.suggestionEngine.onSuggestionSelected(suggestion, (address) => {
            this.props.updateAddressAutoSuggest(formatAddress(address))

            this.props.change(CIVILIAN_FORM_NAME, 'address.streetAddress', address.streetAddress)
            this.props.change(CIVILIAN_FORM_NAME, 'address.city', address.city)
            this.props.change(CIVILIAN_FORM_NAME, 'address.state', address.state)
            this.props.change(CIVILIAN_FORM_NAME, 'address.zipCode', address.zipCode)
            this.props.change(CIVILIAN_FORM_NAME, 'address.country', address.country)

        })
    }


    handleSuggestionsFetchRequested = ({value, reason}) => {
        if (value && reason === 'input-changed') {
            this.props.suggestionEngine.onFetchSuggestions(value, (values) => {
                this.setState({
                    suggestions: values || []
                })
            })
        }
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    };

    handleChange = (event, {newValue}) => {
        this.props.updateAddressAutoSuggest(newValue)
        this.setState({value: newValue})

        this.props.change(CIVILIAN_FORM_NAME, 'address.streetAddress', '')
        this.props.change(CIVILIAN_FORM_NAME, 'address.city', '')
        this.props.change(CIVILIAN_FORM_NAME, 'address.state', '')
        this.props.change(CIVILIAN_FORM_NAME, 'address.zipCode', '')
        this.props.change(CIVILIAN_FORM_NAME, 'address.country', '')

        this.props.clearSubmitErrors(CIVILIAN_FORM_NAME)
    };

    render() {
        const {label, classes = {}, meta, inputProps, 'data-test': dataTest} = this.props;

        const theme =
            {
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
            }

        return (
            <Autosuggest
                theme={theme}
                renderInputComponent={this.renderInput}
                suggestions={this.state.suggestions}
                onSuggestionSelected={this.onSuggestionSelected}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                data-test={'base-auto-suggest'}
                inputProps={{
                    label,
                    dataTest,
                    ...inputProps,
                    classes,
                    reduxFormMeta: meta,
                    value: this.state.value,
                    onChange: this.handleChange,
                }}
            />
        );
    }
}

const mapDispatchToProps = {
    change,
    updateAddressAutoSuggest,
    clearSubmitErrors
}

const ConnectedComponent = connect(undefined, mapDispatchToProps)(AddressAutoSuggest)
export default withStyles(styles)(ConnectedComponent);




