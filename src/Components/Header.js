import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return  <div className="header">
              <div className="logo-box">
							  <img className="logo" src={process.env.PUBLIC_URL + '/logo.svg'} alt=""/>
              </div>
              <div className="locations">
                <Link 
									className={`location ${this.props.location.pathname === '/' ? 'active' : ''}`} 
									to="/">
									Home
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