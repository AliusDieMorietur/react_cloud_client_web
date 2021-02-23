import React from 'react';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return  <div className="login-form">
              <h1 className="form-title">Login</h1>
							<input className="form-field" type="text" name="input" placeholder="Enter login"/>
							<input className="form-field" type="password" name="input" placeholder="Enter password"/>
							<button className="form-button">Login</button>
						</div>
	}
}