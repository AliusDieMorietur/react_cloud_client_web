import React from 'react';

export default class Accordeon extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
    const toAccaredon = dataset => {
      const res = dataset.map((item, index) => {
        let bodyRef = React.createRef();
        let iconRef = React.createRef();
        return item.childs !== null
          ? <div key={index} className="accordeon">
              <div className="accordeon-head">
                <div className="accordeon-title">
                  { item.name }
                </div>
                <button className="dropown-button" onClick={() => { 
                    bodyRef.current.classList.toggle('active');
                    iconRef.current.classList.toggle('active');
                    this.forceUpdate();
                  }}>
                  <img className="dropown-icon" src={ `${process.env.PUBLIC_URL}/arrow.svg` } ref={ iconRef } />
                </button>
              </div>
              <div className="accordeon-body" style={{ marginLeft: '15px' }} ref={ bodyRef }> 
                { toAccaredon(item.childs) }
              </div>
            </div>
          : <div key={index} className="file-title">{ item.name }</div>
      });
      return res;
    };
    return toAccaredon(this.props.dataset);
	}
}