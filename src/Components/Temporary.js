import React from 'react';
import Transport from '../additional/socket'
import Tab from './Tabulator'
import RoutedHeader from './Header';

const downloadFile = (name, dataBlob) => {
  const blobUrl = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export default class Temporary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      tab: 'upload',
      chosen: ['None'],
      token: '',
      filesSelected: [],
      dataList: [],
      input: '',
      error: ''
    };

    this.timer = null;
    this.buffers = [];

    this.transport = new Transport(window.location.host, buffer => {
      this.buffers.push(buffer);
    });

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (!["constructor", "render"].includes(key)) {
        this[key] = this[key].bind(this);
      }
    }
  }

  showError(err) {     
    this.setState({ error: err.message });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({ error: '' }), 5000);
  }

  fileUploadChange(event) {
    const chosen = [];
    for (const file of event.target.files) { chosen.push(file.name); };
    this.setState({ files: event.target.files, chosen });
  }

  tokenInputChange(event) {
    this.setState({ input: event.target.value, fileSelected: [], dataList: [] });
  }

  fileSelect(event) {
    if (event.target.checked) {
      this.state.filesSelected.push(event.target.id);
    } else {
      this.state.filesSelected.splice(this.state.filesSelected.indexOf(event.target.id), 1);
    }
  }

  async upload() {
    if (this.state.chosen.length === 1 && this.state.chosen[0] === 'None') {
      this.showError(new Error('Nothing selected. Select, then upload'));
      return;
    };
    this.setState({ token: 'loading...' });
    const list = [];
    for (const file of this.state.files) list.push(file.name);
    for (const file of this.state.files) await this.transport.bufferCall(file);
    this.transport.socketCall('upload', { list })
      .then(token => this.setState({ token }))
      .catch(this.showError);
  }

  getFilenames() {
    if (this.state.input.length === 0) {
      this.showError(new Error('Enter valid token please'));
      return;
    };
    this.transport.socketCall('available-files', { token: this.state.input  })
      .then(dataList => this.setState({ dataList }))
      .catch(this.showError);
  }

  download(event) {
    const files = event.target.innerText === 'Download All'
      ? this.state.dataList
      : [event.target.innerText]
    this.transport.socketCall('download', { 
      token: this.state.input.trim(), 
      files
    })
    .then(files => { 
      for (let i = 0; i < files.length; i++) 
        downloadFile(files[i], this.buffers[i]); 
      this.buffers = [];
    })
    .catch(this.showError);
  }

  render() {
    return (
      <div>
        <RoutedHeader/>
        <div className="temporary">
          <div className="tabs">
            <button
              className = { "tab-btn " + (this.state.tab === 'upload' ? 'active' : '') }
              onClick = { () => this.setState({ tab: 'upload' }) }>
              Upload
            </button>
            <button
              className = { "tab-btn " + (this.state.tab === 'download' ? 'active' : '') }
              onClick = { () => this.setState({ tab: 'download' }) }>
              Download
            </button>
          </div>
          <Tab
            tab = { this.state.tab }
            value = { this.state.value }
            change = { this.fileUploadChange }
            chosen = { this.state.chosen }
            upload = { this.upload }
            download = { this.download }
            input = { this.state.input }
            tokenInputChange = { this.tokenInputChange }
            fileSelect = { this.fileSelect }
            token = { this.state.token }
            getFilenames = { this.getFilenames }
            fileList = { this.state.dataList }
            error = { this.state.error }
          />
          <h1 className="error-box">{this.state.error}</h1>
        </div>
      </div>
    );
  }
}
