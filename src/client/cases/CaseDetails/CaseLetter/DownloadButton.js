const React = require("react");
const saveAs = require("./save-as");

export default class DownloadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, fileData: null };
  }

  _onGenerate = async () => {
    this.setState({ loading: true, fileData: null });
    const fileData = await this.props.genFile();
    var blob = new Blob([fileData.contents], { type: fileData.mime });

    const url = URL.createObjectURL(blob);
    console.log("File url", url);
    saveAs(url, fileData.filename);
  };

  _donePreparing = fileData => {
    this.setState({
      loading: false,
      fileData: fileData
    });
  };

  _onDownload = async () => {
    var fileData =
      this.props.fileData ||
      (this.props.async ? this.state.fileData : await this.props.genFile());
    if (!fileData) {
      return false;
    }
    var blob = new Blob([fileData.contents], { type: fileData.mime });

    const url = URL.createObjectURL(blob);
    saveAs(url, fileData.filename);
    this.props.onDownloaded && this.props.onDownloaded();
  };

  render() {
    if (!this.props.genFile && !this.props.fileData) {
      return <em>Invalid configuration for download button</em>;
    }
    var style = this.props.style,
      cls = "DownloadButton " + (this.props.className || "");

    return (
      <button style={style} onClick={this._onGenerate} className={cls}>
        {this.props.generateTitle}
      </button>
    );
  }
}
