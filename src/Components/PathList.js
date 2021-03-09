import React from 'react';

const generateListFromPath = (path, dataset) => {
  const dir = path.shift();

  for (const item of dataset) {
    if(item.name === dir) {
      return generateListFromPath(path, item.childs)
    }
  }

  return dataset;
}

const convert = sizeInBytes => {
  const units = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];
  const index = Math.floor(Math.log10(sizeInBytes) / 3);
  const unit = units[index];
  const res = (sizeInBytes / Math.pow(10, index * 3)) | 0;

  return `${Math.round((res + Number.EPSILON) * 100) / 100} ${unit ? unit : units[0]}`
}

export default class PathList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      timeout: null
    };
	}

	render() {
    return <ul className="current-folder-list"> { 
      generateListFromPath(this.props.currentPath.split("/"), this.props.dataset)
        .map((item, index) =>  {
        const imgSrc = item.childs === null
          ? `${process.env.PUBLIC_URL}/icons/file.svg`
          : `${process.env.PUBLIC_URL}/icons/folder.svg`;
        const className = (this.props.active.includes(item) ? "active " : "") + "folder-list-el";
        const holdTime = this.props.holdTime | 200;

        return <li className={className} key={index} 
          // onClick={() => { console.log(this.state.timeout); if (!this.state.timeout)  } } 
          onMouseDown={ () => { this.state.timeout = setTimeout(() => { 
            this.props.onItemHold(item); 
            this.props.onItemClick(item); 
            this.state.timeout = null; 
          }, holdTime) }}
          onMouseUp={ () => { 
            if (this.state.timeout != null) {
              clearTimeout(this.state.timeout); 
              this.state.timeout = null; 
              this.props.onItemClick(item); 
            }
          }}
        >
          <img className="el-icon" src={ imgSrc }/>
          <div className="el-name">{item.name}</div>
          <div className="el-capacity">{ convert(item.capacity) }</div>
        </li>
      }) 
    }
  </ul>
	}
}