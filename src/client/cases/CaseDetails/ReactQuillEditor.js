import React from "react";
import ReactQuill from "react-quill";

class ReactQuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: props.initialValue }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
    this.props.onChange(value);
  }

  render() {
    const modules = {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: ["", "center"] }]
      ]
    };

    const formats = ["bold", "italic", "underline", "list", "bullet", "align"];

    return (
      <ReactQuill
        theme={"snow"}
        value={this.state.text}
        onChange={this.handleChange}
        modules={modules}
        formats={formats}
      />
    );
  }
}

export default ReactQuillEditor;
