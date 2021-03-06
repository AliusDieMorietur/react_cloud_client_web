import React from "react";
import Header from "./Header";
import { copyToClipboard, downloadFile } from "../additional/utils";

export default class Temporary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      tab: "upload",
      chosen: ["None"],
      token: "",
      availableFiles: [],
      input: "",
      error: "",
    };
    this.timer = null;
    this.buffers = [];
    this.transport = this.props.transport;

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (!["constructor", "render"].includes(key)) {
        this[key] = this[key].bind(this);
      }
    }
  }

  showError(err) {
    this.setState({ error: err.message });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({ error: "" }), 5000);
  }

  fileUploadChange(event) {
    const chosen = [];

    for (const file of event.target.files) {
      chosen.push(file.name);
    }
    this.setState({ files: event.target.files, chosen });
  }

  tokenInputChange(event) {
    this.setState({ input: event.target.value, availableFiles: [] });
  }

  async upload() {
    if (this.state.chosen.length === 1 && this.state.chosen[0] === "None") {
      this.showError(new Error("Nothing selected. Select, then upload"));
      return;
    }

    this.setState({ token: "loading..." });

    const fileList = [];

    for (const file of this.state.files) fileList.push(file.name);
    this.transport
      .socketCall("tmpUpload", { fileList })
      .then((token) => {
        for (const file of this.state.files) this.transport.bufferCall(file);

        this.setState({
          token,
          files: [],
          chosen: ["None"],
          availableFiles: [],
        });
      })
      .catch(this.showError);
  }

  getFilenames() {
    if (this.state.input.length === 0) {
      this.showError(new Error("Enter valid token please"));
      return;
    }
    this.transport
      .socketCall("availableFiles", { token: this.state.input })
      .then((availableFiles) => this.setState({ availableFiles }))
      .catch(this.showError);
  }

  download(event) {
    const fileList =
      event.target.innerText === "Download All"
        ? this.state.availableFiles
        : [event.target.innerText];

    this.transport.names = fileList;
    this.transport
      .socketCall("tmpDownload", {
        token: this.state.input.trim(),
        fileList,
      })
      .catch(this.showError);
  }

  render() {
    let downloadButton =
      this.state.availableFiles.length === 0 ? (
        <button className="form-btn" onClick={this.getFilenames}>
          Check Available
        </button>
      ) : (
        <div className="available">
          <h1 className="form-title">Available:</h1>
          <ul id="file-list">
            {this.state.availableFiles.map((el) => (
              <li>
                <a download={el} onClick={this.download}>
                  {el}
                </a>
              </li>
            ))}
          </ul>
          <button className="form-btn" onClick={this.download}>
            Download All
          </button>
        </div>
      );

    let uploadTab = (
      <div className="upload tab">
        <input
          id="files"
          type="file"
          value={this.state.value}
          onChange={this.fileUploadChange}
          multiple
        />
        {this.state.token !== "" ? (
          <h1 className="form-token ">
            Your token: {this.state.token}
            <button
              className="active control-button"
              onClick={() => {
                copyToClipboard(this.state.token);
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/icons/copy.svg`}
                alt="copy"
              />
            </button>
          </h1>
        ) : (
          ""
        )}
        <h1 className="form-title">Chosen:</h1>
        <ul id="file-list">
          {this.state.chosen.map((el, index) => (
            <li key={index}>{el}</li>
          ))}
        </ul>
        <div className="buttons">
          <label className="input-btn form-btn" htmlFor="files">
            Choose files
          </label>
          <button className="form-btn" onClick={this.upload}>
            Upload
          </button>
        </div>
      </div>
    );

    let downloadTab = (
      <div className="download tab">
        <h1 className="form-title">Enter Token</h1>
        <input
          id="token"
          type="text"
          value={this.state.input}
          onChange={this.tokenInputChange}
        />
        {downloadButton}
      </div>
    );

    return (
      <div>
        <Header />
        <div className="temporary">
          <div className="tabs">
            <button
              className={
                "tab-btn " + (this.state.tab === "upload" ? "active" : "")
              }
              onClick={() => this.setState({ tab: "upload" })}
            >
              Upload
            </button>
            <button
              className={
                "tab-btn " + (this.state.tab === "download" ? "active" : "")
              }
              onClick={() => this.setState({ tab: "download" })}
            >
              Download
            </button>
          </div>
          <div className="tabulator">
            {this.state.tab === "upload" ? uploadTab : downloadTab}
          </div>
          <h1 className="error-box">{this.state.error}</h1>
        </div>
      </div>
    );
  }
}
