import React from 'react';
import Header from './Header';
import Accordeon from './Accordeon';
import PathList from './PathList';

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



export default class Permanent extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      dataset: [],
      currentPath: "",
      favourites: [{ path: "", name: "home" }],
      selected: [],
      selectState: false,
      creatingNewFolder: false,
      newFolderName: "New Folder"
    };

    this.buffers = [];
    this.transport = this.props.transport;
    this.transport.rebuildStructure = structure => {
      this.setState({ dataset: structure });
    };

    // this.uploadModalContent = 
    //   <div className="upload-modal-content">
    //     <input id="files" type="file" value = { this.state.value } onChange = { this.fileUploadChange  } multiple/>
    //     <div className="chosen">Chosen:</div>
    //     <ul id="file-list">
    //       { this.state.chosen.map((el, index) => <li key={index}>{ el }</li>) }
    //     </ul>
    //     <label id="choose-btn" htmlFor="files">Choose files</label>
    //   </div>;

    // this.uploadModal = React.createRef();

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (!["constructor", "render"].includes(key)) {
        this[key] = this[key].bind(this);
      }
    }

	}

  async componentDidMount() {
    if (this.props.authed) {
      const dataset = await this.transport.socketCall('availableFiles', {});
      this.setState({ dataset });
    }
  }

  async filesSelected(event) {
    console.log(event.target.files);
    const changes = [];
    for (const file of event.target.files) changes.push(file.name);
    for (const file of event.target.files) await this.transport.bufferCall(file);
    this.transport.socketCall('pmtUpload', { 
      currentPath: this.state.currentPath, 
      changes 
    })
    .then()
    .catch(console.log);
  }

  createLink() {
    const onlyFile =
      this.state.selected.length === 1 &&
      this.state.selected[0].childs === null;
    console.log(
      this.state.currentPath, 
      this.state.selected[0].name 
    );
    if (onlyFile) {
      this.transport.socketCall('createLink', { 
        filePath: 
          this.state.selected[0].name 
      })
      .then(console.log)
      .catch(console.log);
    }
  }

  download() {
    const fileList = this.state.selected
      .filter(el => el.childs === null)
      .map(el => el.name);

    console.log(fileList);

    this.transport.socketCall('pmtDownload', { 
      currentPath: this.state.currentPath , 
      fileList 
    })
    .then(files => { 
      for (let i = 0; i < files.length; i++) 
        downloadFile(files[i], this.transport.buffers[i]); 
      this.transport.clearBuffers();
    })
    .catch(console.log);
  }

  delete() {

    const changes = this.state.selected
      .filter(el => el.childs === null)
      .map(el => [el.name, el.childs === null ? 'file' : 'folder']);

    this.transport.socketCall('delete', { 
      currentPath: this.state.currentPath, 
      changes 
    })
    .then()
    .catch(console.log);
  }

	render() {
		return (
      <div>
        {/* <Modal ref={ this.uploadModal } content={ this.uploadModalContent } title="Upload"/> */}
        <Header/>
        <div className="permanent">
          <div className="explorer">
            <div className="list-header">
              <div className="path">{ "/" + this.state.currentPath.slice(0, -1) }</div>
              <input 
                style={ {display: 'none'} } 
                id="files" 
                type="file" 
                onChange={ this.filesSelected }
                multiple
              />
              <div className="control-buttons">
                <button className={"active control-button"} onClick={() => {
                  this.setState({ creatingNewFolder: true, newFolderName: "New Folder" });
                }}>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/newfolder.svg` } alt="New Folder"/>
                </button>
                <label className="active control-button" htmlFor="files">
                  <img src={ `${process.env.PUBLIC_URL}/icons/upload.svg` } alt="Upload"/>
                </label>
                <button className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"} onClick={() => {
                  console.log(this.state.favourites);
                  let favourites = [...this.state.favourites, ...this.state.selected
                    .filter(x => x.childs != null && !this.state.favourites.some(y => x.name == y.name))
                    .map( x => ({ name: x.name, path: x.name }) )];

                  this.setState({ favourites })
                ``}}>
                  <img src={ `${process.env.PUBLIC_URL}/icons/bookmark.svg` } alt="Bookmark"/>
                </button>
                <button className={( this.state.selected.length === 1 ? "active " : "") + "control-button"}
                  onClick={ this.createLink }>        
                  <img src={ `${process.env.PUBLIC_URL}/icons/link.svg` } alt="Link"/>
                </button>
                <button 
                  className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"}>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/edit.svg` } alt="Edit"/>
                </button>
                <button 
                  className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"}
                  onClick={ this.download }>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/download.svg` } alt="Download"/>
                </button>
                <button 
                  className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"}
                  onClick={ this.delete }>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/delete.svg` } alt="Delete"/>
                </button>
              </div>
            </div>
            <div className="main">
              <div className="navbar">
                <div className="favourites">
                  { this.state.favourites.map((item, index) => <div className="favourites-title" key={index} 
                    onClick = { () => this.setState({ currentPath: item.path, selected: [], selectState: false }) }
                  >
                    { item.name }
                  </div>) }
                </div>
                <Accordeon dataset={ this.state.dataset } onItemClick={(item, path) => {
                  if (item.childs !== null)
                    this.setState({ currentPath: `${path}${item.name}/`, selected: [], selectState: false })
                }}/>
              </div>
              <div className="hierarchy">
                <PathList currentPath= { this.state.currentPath } dataset = { this.state.dataset } active={this.state.selected} 
                onItemClick={item => {
                  if (this.state.selectState) {
                    if (!this.state.selected.includes(item)) 
                      this.state.selected.push(item);
                    else {
                      const index = this.state.selected.indexOf(item);

                      this.state.selected.splice(index, 1);
                    }
                    this.forceUpdate();

                    if (this.state.selected.length === 0) this.setState({ selectState: false });
                  } else if (item.childs !== null) this.setState({ currentPath: `${this.state.currentPath}${item.name}/` })
                }} 
                onItemHold={item => {
                  if (!this.state.selectState) {
                    this.setState({ selectState: true });
                  }
                }}/>
                {this.state.creatingNewFolder ? 
                  <div className="new-folder">
                    <img className="el-icon" src={ `${process.env.PUBLIC_URL}/icons/folder.svg` }/>
                    <input className="el-input"
                      value={ this.state.newFolderName }
                      onChange={ event => this.setState({ newFolderName: event.target.value }) }
                      onKeyPress={ event => { if (event.key === 'Enter') { 
                        this.setState({ creatingNewFolder: false}); 
                        this.transport.socketCall("newFolder", { 
                          currentPath: this.state.currentPath, 
                          folderName: this.state.newFolderName
                        })
                      } } }
                    ></input>
                  </div> 
                : ""}
              </div>
            </div>
          </div>
        </div>
      </div>	
    );
	}
}