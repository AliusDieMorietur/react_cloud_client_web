import React from 'react';
import Header from './Header';
import Accordeon from './Accordeon';

const dataset = [
  { name: '1', childs: [
    { name: '2', childs: [
      { name: '3', childs: null, capacity: 1234 },
      { name: '4', childs: null, capacity: 1234 }
    ], capacity: 1234 },  
    { name: '5', childs: null, capacity: 1234 }
  ], capacity: 1234 }, 
  { name: '6', childs: [
    { name: '7', childs: null, capacity: 1234 }
  ], capacity: 1234 },  
  { name: '11', childs: null, capacity: 1234 },
  { name: '8', childs: [
    { name: '9', childs: null, capacity: 1234 }
  ], capacity: 1234 },  
  { name: '10', childs: null, capacity: 1234 }
];

export default class Permanent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return 	<div className="permanent">
							<Header/>
							<div className="explorer">
								<div className="list-header">
                  <div className="path">/current/path/</div>
                  <div className="control-buttons">
                    <button className="control-button">Upload</button>
                    <button className="control-button">Download</button>
                    <button className="control-button">Delete</button>
                  </div>
                </div>
                <div className="main">
                  <div className="navbar">
                    <Accordeon dataset={ dataset }/>
                  </div>
                  <div className="hierarchy">
                    <ul className="current-folder-list">
                      { 
                        dataset.map((el, index) =>  {
                          const imgSrc = el.childs === null
                            ? `${process.env.PUBLIC_URL}/file.svg`
                            : `${process.env.PUBLIC_URL}/folder.svg`;
                          return <li className="folder-list-el" key={index}>
                            <img className="el-icon" src={ imgSrc } />
                            <div className="el-name">{el.name}</div>
                            <div className="el-capacity">{el.capacity}</div>
                          </li>
                        }) 
                      }
                    </ul>
                  </div>
                </div>
							</div>
						</div>
	}
}