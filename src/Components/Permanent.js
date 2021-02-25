import React from 'react';
import Header from './Header';
import Accordeon from './Accordeon';
import PathList from './PathList';

const dataset = [
  { name: 'folder1', childs: [
    { name: 'file3', childs: null, capacity: 1234 },
    { name: 'folder2', childs: [
      { name: 'file4', childs: null, capacity: 1234 },
      { name: 'file5', childs: null, capacity: 1234 }
    ], capacity: 1234 }
  ], capacity: 1234 }, 
  { name: 'falder6', childs: [
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

    super(props);
		this.state = {
      currentPath: "",
      favouritePaths: []
    };
	}

	render() {
		return 	<div className="permanent">
							<Header/>
							<div className="explorer">
								<div className="list-header">
                  <div className="path">{ "/" + this.state.currentPath.slice(0, -1) }</div>
                  <div className="control-buttons">
                    <button className="control-button"><img src={ `${process.env.PUBLIC_URL}/upload.svg` } /></button>
                    <button className="control-button"><img src={ `${process.env.PUBLIC_URL}/download.svg` } /></button>
                    <button className="control-button"><img src={ `${process.env.PUBLIC_URL}/delete.svg` } /></button>
                  </div>
                </div>
                <div className="main">
                  <div className="navbar">
                    
                    <Accordeon dataset={ dataset } onItemClick={(item, path) => {
                      if (item.childs !== null)
                        this.setState({ currentPath: `${path}${item.name}/` })
                    }}/>
                  </div>
                  <div className="hierarchy">
                    <PathList dataset = { generateListFromPath(this.state.currentPath.split("/"), dataset) } onItemClick={item => {
                      if (item.childs !== null) {
                        this.setState({ currentPath: `${this.state.currentPath}${item.name}/` })

                      }
                    }}/>
                  </div>
                </div>
							</div>
						</div>
	}
}