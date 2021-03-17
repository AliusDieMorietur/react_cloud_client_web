import React from 'react';
import Header from './Header';
import Accordeon from './Accordeon';
import PathList from './PathList';
import { findPlace, downloadFile, copyToClipboard, toFlat } from '../additional/utils' 

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
      newFolderName: "New Folder",
      renameIndex: -1
    };

    this.buffers = [];
    this.transport = this.props.transport;
    this.transport.rebuildStructure = structure => {
      this.setState({ 
        dataset: structure, 
        selected: [],
        renameIndex: -1,
        selectState: false,
        creatingNewFolder: false
      });
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
    document.addEventListener('keydown', event => {
      if (
        event.key === 'F2' && 
        this.state.selected.length === 1 &&
        this.state.renameIndex === -1
      ) this.rename();
    }, false);
    if (this.props.authed) {
      const dataset = await this.transport.socketCall('availableFiles', {});
      this.setState({ dataset });
    }
  }

  async filesSelected(event) {
    const fileList = [];

    for (const file of event.target.files) 
      fileList.push(`${this.state.currentPath}${file.name}`);

    await this.transport.socketCall('pmtUpload', { fileList })
    
    for (const file of event.target.files) 
      await this.transport.bufferCall(file);

    event.target.value = "";

  }

  createLink() {
    const onlyFile =
      this.state.selected.length === 1 &&
      this.state.selected[0].childs === null;

    if (onlyFile) {
      this.transport.socketCall('createLink', { 
        name: 
          this.state.selected[0].name 
      })
      .then(async token => {
        copyToClipboard(`${window.location.origin}/link/${token}`);
      })
      .catch(console.log);
    }
  }

  download() {
    const fileList = toFlat(this.state.currentPath, this.state.selected);

    this.transport.names = fileList;
    this.transport.socketCall('pmtDownload', { fileList })
    .then()
    // .then(files => { 
    //   for (let i = 0; i < files.length; i++) 
    //     downloadFile(files[i], this.transport.buffers[i]); 
    //   this.transport.clearBuffers();
    // })
    .catch(console.log);
  }

  delete() {
    const fileList = toFlat(this.state.currentPath, this.state.selected, [], true);
    console.log(fileList);
    this.transport.socketCall('delete', { fileList })
    .then()
    .catch(console.log);
  }

  rename() {
    if (this.state.selected.length === 1) {
      console.log(this.state.selected);
      const { name } = this.state.selected[0];
      const place = findPlace(this.state.dataset, this.state.currentPath);
      const names = place.map(item => item.name);
      const renameIndex = names.indexOf(name);
      this.setState({ renameIndex });
    }
  }

  addToFavourites() {
    const onlyFolder = 
      this.state.selected.length === 1 &&
      this.state.selected[0].childs !== null;
      
    if (onlyFolder) {
      const { name } = this.state.selected[0];
      const { favourites } = this.state; 
      const favouritesNames = favourites.map(item => item.name);

      if (favouritesNames.includes(name)) {
        const index = favourites.indexOf(name);
        favourites.splice(index, 1);
      } else favourites.push({ name, path: name });
      this.setState({ favourites });
    }
  }

  goTo(item) {
    if (item.childs !== null && this.state.renameIndex === -1) {
      this.setState({ 
        currentPath: `${this.state.currentPath}${item.name}/`,
        selected: [],
        renameIndex: -1,
        selectState: false,
        creatingNewFolder: false
      });
    }
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
                <button 
                  className={( 
                    this.state.selected.length === 1 && 
                    this.state.selected[0].childs !== null 
                      ? "active " 
                      : "")
                    + "control-button"} 
                  onClick={ this.addToFavourites }>
                  <img src={ `${process.env.PUBLIC_URL}/icons/bookmark.svg` } alt="Bookmark"/>
                </button>
                <button 
                  className={( this.state.selected.length === 1 && this.state.selected[0].childs === null ? "active " : "") + "control-button"}
                  onClick={ this.createLink }>        
                  <img src={ `${process.env.PUBLIC_URL}/icons/link.svg` } alt="Link"/>
                </button>
                <button 
                  className={( this.state.selected.length === 1 ? "active " : "") + "control-button"}
                  onClick={ this.rename }>       
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
                  { this.state.favourites.map((item, index) => 
                    <div 
                      className="favourites-title" 
                      key={index} 
                      onClick = { () => {
                        if (this.state.renameIndex === -1) {
                          this.setState({ 
                            currentPath: item.path + '/',
                            selected: [],
                            renameIndex: -1,
                            selectState: false,
                            creatingNewFolder: false
                          });
                        }
                      } }
                    >{ item.name }
                  </div>) }
                </div>    
                <Accordeon 
                  dataset={ this.state.dataset } 
                  onItemClick={(item, path) => {
                    if (item.childs !== null)
                      this.setState({ 
                        currentPath: `${path}${item.name}/`,
                        selected: [],
                        renameIndex: -1,
                        selectState: false,
                        creatingNewFolder: false
                      });
                  }}
                />
              </div>
              <div className="hierarchy">
                <PathList 
                  currentPath={ this.state.currentPath } 
                  dataset={ this.state.dataset } 
                  active={ this.state.selected }
                  renameIndex={ this.state.renameIndex } 
                  onRename={ newName => {
                    const item = this.state.selected[0]
                    const { name } = item;
                    const fullName = 
                      `${this.state.currentPath}${name}${item.childs === null ? '' : '/'}`;
                    this.setState({ renameIndex: -1, selected: [] });
                    this.transport.socketCall('rename', { 
                      name: fullName, 
                      newName: `${this.state.currentPath}${newName}${item.childs === null ? '' : '/'}`
                    })
                  } }
                  goTo={ this.goTo }
                  select={ item => {
                    if (this.state.renameIndex === -1) {
                      if (!this.state.selected.includes(item)) 
                        this.state.selected.push(item);
                      else {
                        const index = this.state.selected.indexOf(item);
                        this.state.selected.splice(index, 1);
                      }
                      this.forceUpdate();
                    }
                  }}
                />
                {this.state.creatingNewFolder ? 
                  <div className="new-folder">
                    <img className="el-icon" src={ `${process.env.PUBLIC_URL}/icons/folder.svg` }/>
                    <input className="el-input"
                      value={ this.state.newFolderName }
                      onChange={ event => this.setState({ newFolderName: event.target.value }) }
                      onKeyPress={ event => { if (event.key === 'Enter') { 
                        this.transport.socketCall("newFolder", { 
                          name: `${this.state.currentPath}${this.state.newFolderName}/`
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