import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoot';
import Permanent from './Components/Permanent';
import Temporary from './Components/Temporary';
import LoginForm from './Components/LoginForm';
import Transport from './additional/socket';

const NotFound = (props) => <h1>NOT FOUND</h1>;

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      authed: false
    };
    this.transport = new Transport();
	}

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const authed = await this.transport.socketCall('restoreSession', { token });
      console.log(authed);
      if (authed) { 
        this.setState({ authed: true });
      }
    }
  }

	render() {
		return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/"
              render={() => {
                return (
                  this.state.authed ?
                    <Redirect to="/permanent"/> :
                    <Redirect to="/login"/> 
                )
              }}
            />
            <PrivateRoute 
              authed={ this.state.authed }
              transport={this.transport}
              redirect='/login'
              path='/permanent' 
              component={Permanent} 
            />
            <Route 
              exact path='/temporary' 
              render={() => <Temporary transport={this.transport}/>} 
            />
            {/* <PrivateRoute 
              authed={this.state.authed} 
              socket={this.socket} 
              redirect='/login'
              path='/temporary' 
              component={Temporary} 
            /> */}
            <PrivateRoute 
              authed={!this.state.authed} 
              transport={this.transport}
              callback={ token => { 
                localStorage.setItem('token', token);
                this.setState({ authed: true }); 
              }}
              redirect='/permanent'
              path='/login' 
              component={LoginForm} 
            />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    )
	}
}
