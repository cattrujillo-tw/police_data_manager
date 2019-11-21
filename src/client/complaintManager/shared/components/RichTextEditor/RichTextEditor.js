import React from "react";
import ReactQuill, { Quill } from "react-quill";
import { connect } from "react-redux";
import { Delta } from "quill";

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.initialValue,
      formInitializedToQuillFormat: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  initializeFormToQuillFormat(
    initializeForm,
    value,
    formInitializedToQuillGeneratedValue
  ) {
    if (!formInitializedToQuillGeneratedValue) {
      initializeForm(this.props.dispatch, value);
      this.setState({ formInitializedToQuillFormat: true });
    }
  }

  handleChange(value, formInitializedToQuillFormat) {
    // let Embed = Quill.import("blots/embed");
    //
    // class CustomBR extends Embed {}
    // CustomBR.blotName = "custombr";
    // CustomBR.tagName = "br";
    // CustomBR.className = "custombr";
    // Quill.register(CustomBR, true);
    //
    // let CustomBr = Quill.import('attributors/style/custombr');
    // Quill.register(CustomBr, true);

    if (this.props.initializeForm) {
      this.initializeFormToQuillFormat(
        this.props.initializeForm,
        value,
        formInitializedToQuillFormat
      );
    }

    this.setState({ text: value });
    this.props.onChange(value);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ text: nextProps.initialValue });
    this.props.onChange(nextProps.initialValue);
  }

  render() {
    // let Embed = Quill.import("blots/embed");
    //
    // class CustomBR extends Embed {}
    // CustomBR.blotName = "custombr";
    // CustomBR.tagName = "br";
    // CustomBR.className = "custombr";
    // Quill.register(CustomBR, true);

    // let CustomBr = Quill.import('attributors/style/custombr');
    // Quill.register(CustomBr, true);

    let modules = {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: ["", "center"] }]
      ],
      clipboard: {
        matchVisual: false
      }
    };

    console.log("Here be some text to mark where we be\n", this.state.text);

    const formats = ["bold", "italic", "underline", "list", "bullet", "align"];

    //TODO Change the onChange to not be an arrow function anymore
    return (
      <ReactQuill
        theme={"snow"}
        value={this.state.text}
        onChange={value =>
          this.handleChange(value, this.state.formInitializedToQuillFormat)
        }
        modules={modules}
        formats={formats}
        data-test={"editLetterQuill"}
      />
    );
  }
}

export default connect()(RichTextEditor);
