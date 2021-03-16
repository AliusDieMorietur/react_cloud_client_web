import React from 'react';
import { findPlace } from '../additional/utils'

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
      timeout: null,
      renameValue: ''
    }
	}

  componentDidMount() {
  }

	render() {
    return <ul className="current-folder-list"> { 
      findPlace(this.props.dataset, this.props.currentPath)
        .map((item, index) =>  {
        const imgSrc = item.childs === null
          ? `${process.env.PUBLIC_URL}/icons/file.svg`
          : `${process.env.PUBLIC_URL}/icons/folder.svg`;
        const className = (this.props.active.includes(item) ? "active " : "") + "folder-list-el";
        const holdTime = this.props.holdTime | 200;
        let name = item.name;

        return <li 
          className={className}
          key={index} 
          onDoubleClick={() => {
            this.props.goTo(item);
          }}
          onClick={() => {
            this.props.select(item);
          }}
        >
          <img className="el-icon" src={ imgSrc }/>
          { 
            this.props.renameIndex === index 
              ? <input
                  className="el-input"
                  value={ this.state.renameValue || name }
                  onChange={ event => {
                    name = '';
                    this.setState({ renameValue: event.target.value }) 
                  }}
                  onKeyPress={ event => { 
                    if (event.key === 'Enter') { 
                      this.props.onRename(this.state.renameValue);
                      this.setState({ renameValue: '' }); 
                    }
                  }}
                /> 
              : <div 
                  className="el-name"
                >
                  {item.name}
                </div>
          }
          <div className="el-capacity">{ convert(item.capacity) }</div>
        </li>
      }) 
    }
  </ul>
	}
}