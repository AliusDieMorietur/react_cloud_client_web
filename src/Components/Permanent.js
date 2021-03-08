import React from 'react';
import Header from './Header';
import Accordeon from './Accordeon';
import PathList from './PathList';
import Modal from './Modal';

const comparator = (a, b) => {
  const is_a_folder = a.childs !== null;
  const is_b_folder = b.childs !== null;

  if(is_a_folder) a.childs.sort(comparator);
  if(is_b_folder) b.childs.sort(comparator);

  if (is_a_folder === is_b_folder) {
    if (a.name < b.name) return -1;
    else if (a.name === b.name) return 0;
    else return 1;
  } else {
    if (is_a_folder) return -1;
    else return 1;
  }
};

export default class Permanent extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      dataset: [],
      currentPath: "",
      favourites: [{ path: "", name: "home" }],
      selected: [],
      selectState: false
    };

    this.buffers = [];
    this.transport = this.props.transport;
    this.transport.rebuildStructure = structure => {
      console.log(structure);
      this.setState({ dataset: structure.sort(comparator) });
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
      const dataset = await this.transport.socketCall('getStorageStructure');
      dataset.sort(comparator);
      this.setState({ dataset });
    }
  }

  async filesSelected(event) {
    console.log(event.target.files);
    const changes = [];
    for (const file of event.target.files) changes.push([file.name, 'file']);
    for (const file of event.target.files) await this.transport.bufferCall(file);
    this.transport.socketCall('pmtUpload', { 
      currentPath: '/home' + this.state.currentPath, 
      changes 
    })
    .then()
    .catch(console.log);
  }

  upload() {
    // this.uploadModal.current.toggleModal();
    // this.transport.socketCall('rename', { 
    //       currentPath: '/home', 
    //       changes: [ 
    //         ['file1', 'file105']
    //       ]
    //     })
    // .then()
    // .catch(console.log);
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
                value={ this.state.value } 
                onChange={ this.filesSelected }
                multiple
              />
              <div className="control-buttons">
                <button className={"active control-button"} onClick={() => {
                  
                }}>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/newfolder.svg` } alt="New Folder"/>
                </button>
                <label className="active control-button" htmlFor="files">
                  <img src={ `${process.env.PUBLIC_URL}/icons/upload.svg` } alt="Upload"/>
                </label>
                <button className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"} onClick={() => {
                  let favourites = [...this.state.favourites, ...this.state.selected.map( x => ({ name: x, path: x }) )];

                  favourites = [...new Set(favourites)]; // make unique
                  this.setState({ favourites })
                }}>
                  <img src={ `${process.env.PUBLIC_URL}/icons/bookmark.svg` } alt="Bookmark"/>
                </button>
                <button className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"}>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/link.svg` } alt="Link"/>
                </button>
                <button className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"}>       
                  <img src={ `${process.env.PUBLIC_URL}/icons/download.svg` } alt="Download"/>
                </button>
                <button className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"}>       
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
                    if (!this.state.selected.includes(item.name)) 
                      this.state.selected.push(item.name);
                    else {
                      const index = this.state.selected.indexOf(item.name);

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
              </div>
            </div>
          </div>
        </div>
      </div>	
    );
	}
}