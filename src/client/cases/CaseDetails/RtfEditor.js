import React from "react";
import ReactDOM from "react-dom";
import {
  ContentState,
  convertFromHTML,
  Editor,
  EditorState,
  RichUtils
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import "../../../../node_modules/draft-js/dist/Draft.css";

class RtfEditor extends React.Component {
  constructor(props) {
    super(props);
    this.setField = props.setField;
    if (!this.stateIsInitialized) {
      if (props.initialValue && props.initialValue !== "") {
        const content = convertFromHTML(props.initialValue);
        const state = ContentState.createFromBlockArray(
          content.contentBlocks,
          content.entityMap
        );
        this.state = { editorState: EditorState.createWithContent(state) };
      } else {
        this.state = { editorState: EditorState.createEmpty() };
      }
      this.stateIsInitialized = true;
    }

    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  onChange(editorState) {
    this.setState({ editorState });
    const contentState = editorState.getCurrentContent();
    this.setField(stateToHTML(contentState));
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this._onBoldClick.bind(this)}>
          Bold
        </button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

// ReactDOM.render(<RtfEditor />, document.getElementById("root"));

export default RtfEditor;
