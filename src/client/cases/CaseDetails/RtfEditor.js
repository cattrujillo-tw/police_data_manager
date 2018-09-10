import React, { Component } from "react";
import PropTypes from "prop-types";
import RichTextEditor from "react-rte";

const ToolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: [
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    "BLOCK_TYPE_DROPDOWN"
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" }
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: "Normal", style: "unstyled" },
    { label: "Heading Large", style: "header-one" },
    { label: "Heading Medium", style: "header-two" },
    { label: "Heading Small", style: "header-three" }
  ]
};

class RtfEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    if (!this.isInitialized) {
      if (props.initialValue) {
        this.state = {
          value: RichTextEditor.createValueFromString(
            props.initialValue,
            "html"
          )
        };
      } else {
        this.state = {
          value: RichTextEditor.createEmptyValue()
        };
      }
      this.isInitialized = true;
    }
  }

  onChange = value => {
    this.setState({ value });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(value.toString("html"));
    }
  };

  render() {
    return (
      <RichTextEditor
        value={this.state.value}
        onChange={this.onChange}
        toolbarConfig={ToolbarConfig}
      />
    );
  }
}

export default RtfEditor;
