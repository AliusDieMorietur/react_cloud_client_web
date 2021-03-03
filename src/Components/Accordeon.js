import React from 'react';

export default class Accordeon extends React.Component {
	constructor(props) {
    super(props);
		this.state = {};
	}

	render() {
    const toAccaredon = (dataset, path = "") => {
      const res = dataset.map((item, index) => {
        let bodyRef = React.createRef();
        let iconRef = React.createRef();
        return item.childs !== null
          ? <div key={index} className="accordeon">
              <div className="accordeon-head">
                <div className="accordeon-title" onClick={() => this.props.onItemClick(item, path)}>
                  { item.name }
                </div>
                <button className="dropdown-button" onClick={() => { 
                    bodyRef.current.classList.toggle('active');
                    iconRef.current.classList.toggle('active');
                    this.forceUpdate();
                  }}>
                  <img src={ `${process.env.PUBLIC_URL}/icons/arrow.svg`  } alt="Dropdown" ref={ iconRef } />
                </button>
              </div>
              <div className="accordeon-body" style={{ marginLeft: '16px' }} ref={ bodyRef }> 
                { toAccaredon(item.childs, `${path}${item.name}/`) }
              </div>
            </div>
          : <div key={index} className="file-title" onClick={() => this.props.onItemClick(item, path)}>{ item.name }</div>
      });
      return res;
    };
    return toAccaredon(this.props.dataset);
	}
}