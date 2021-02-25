

import React from 'react';

const convert = sizeInBytes => {
  const units = ['b', "Kb", "Mb", "Gb", "Tb"];
  const index = Math.floor(Math.log10(sizeInBytes) / 3);
  const unit = units[index];
  const res = sizeInBytes / Math.pow(10, index * 3);

  return `${res} ${unit}`
}

export default class PathList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
    return <ul className="current-folder-list"> { 
      this.props.dataset.map((item, index) =>  {
        const imgSrc = item.childs === null
          ? `${process.env.PUBLIC_URL}/file.svg`
          : `${process.env.PUBLIC_URL}/folder.svg`;
        return <li className="folder-list-el" key={index}>
          <img className="el-icon" src={ imgSrc } />
          <div className="el-name" onClick={() => this.props.onItemClick(item)}>{item.name}</div>
          <div className="el-capacity">{ convert(item.capacity) }</div>
        </li>
      }) 
    }
  </ul>
	}
}