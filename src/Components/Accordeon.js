import React from 'react';

export default class Accordeon extends React.Component {
	constructor(props) {
    super(props);
    
    const fn = item => {
      item.state = false;
      if (item.childs !== null) item.childs.map(fn);

      return item;

      // if (item.childs !== null) return { state: false, childs: item.childs.map(fn) }
      // else return { state: false, childs: null }
    }

		this.state = {
      dataset: props.dataset.map(fn)
    };
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
    return toAccaredon(this.state.dataset);
	}
}