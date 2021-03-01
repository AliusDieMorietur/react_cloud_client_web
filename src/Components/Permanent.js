import React from 'react';
import Header from './Header';
import Transport from '../additional/socket'
import Accordeon from './Accordeon';
import PathList from './PathList';

let dataset = [
  { name: 'folder1', childs: [
    { name: 'file3', childs: null, capacity: 1234 },
    { name: 'folder2', childs: [
      { name: 'file4', childs: null, capacity: 1234 },
      { name: 'file5', childs: null, capacity: 1234 }
    ], capacity: 1234 }
  ], capacity: 1234 }, 
  { name: 'folder6', childs: [
    { name: 'file7', childs: null, capacity: 1234 }
  ], capacity: 1234 },  
  { name: 'file11', childs: null, capacity: 1234 },
  { name: 'folder8', childs: [
    { name: 'file9', childs: null, capacity: 1234 }
  ], capacity: 1234 },  
  { name: 'file10', childs: null, capacity: 1234 }
];

const generateListFromPath = (path, dataset) => {
  const dir = path.shift();

  for (const item of dataset) {
    if(item.name === dir) {
      return generateListFromPath(path, item.childs)
    }
  }

  return dataset;
}

export default class Permanent extends React.Component {
	constructor(props) {
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
    dataset.sort(comparator);

    // dataset = [{ 
    //   name: 'home', 
    //   childs: dataset, 
    //   capacity: dataset.reduce((acc, cur) => acc + cur.capacity, 0) 
    // }]

    super(props);
		this.state = {
      currentPath: "",
      favourites: [{ path: "", name: "home" }],
      selected: [],
      selectState: false,
    };

    this.buffers = [];
    this.transport = this.props.transport;
	}

	render() {

		return (
      <div>
        <Header/>
        <div className="permanent">
          <div className="explorer">
            <div className="list-header">
              <div className="path">{ "/" + this.state.currentPath.slice(0, -1) }</div>
              <div className="control-buttons">
                <button className={( this.state.selected.length === 0 ? "" : "active ") + "control-button"} onClick={() => {
                  this.setState({ favourites: [...this.state.favourites, ...this.state.selected.map( x => ({ name: x, path: x }) )] })
                }}>
                  <img src={ `${process.env.PUBLIC_URL}/icons/bookmark.svg` } alt="Bookmark"/>
                </button>
                <button className="active control-button"><img src={ `${process.env.PUBLIC_URL}/icons/upload.svg` }   alt="Upload"  /></button>
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
                <Accordeon dataset={ dataset } onItemClick={(item, path) => {
                  if (item.childs !== null)
                    this.setState({ currentPath: `${path}${item.name}/`, selected: [], selectState: false })
                }}/>
              </div>
              <div className="hierarchy">
                <PathList dataset = { generateListFromPath(this.state.currentPath.split("/"), dataset) } active={this.state.selected} 
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