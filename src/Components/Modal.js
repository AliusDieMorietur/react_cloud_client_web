import React from 'react';

export default class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      show: false
    };
    // this.transport = new Transport();
    this.toggleModal = this.toggleModal.bind(this);
	}

  toggleModal() {
    this.setState({ show: !this.state.show });
  }

	render() {
		return (
      <div className={ `modal${this.state.show ? ' active' : ''}`  }>
        <div className="modal-body"> 
          <div className="modal-header">
            <div className="modal-title">{ this.props.title }</div>  
            <button className="modal-close"
              onClick={ this.toggleModal }><img src={ `${process.env.PUBLIC_URL}/icons/close.svg` }/></button>
          </div>
          <div className="modal-content">
            { this.props.content }
          </div>
          <div className="modal-footer">
            <button className="modal-btn" onClick={ this.props.onSubmit }>Submit</button>
            <button className="modal-btn" onClick={ this.props.onCancel }>Cancel</button>
          </div>
        </div>
      </div>
    )
	}
}
