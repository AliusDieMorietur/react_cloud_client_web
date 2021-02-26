import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return  <div className="header">
              <div className="logo-box">
							  <img className="logo" src={process.env.PUBLIC_URL + '/icons/logo.svg'} alt=""/>
              </div>
              <div className="locations">
                <Link 
									className={`location ${this.props.location.pathname === '/permanent' ? 'active' : ''}`} 
									to="/permanent">
									Permanent
								</Link>
                <Link 
									className={`location ${this.props.location.pathname === '/temporary' ? 'active' : ''}`} 
									to="/temporary">
									Temporary
								</Link>
              </div>
						</div>
	}
}

export default withRouter(props => <Header {...props}/>);