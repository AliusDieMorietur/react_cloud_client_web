import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoot';
import Permanent from './Components/Permanent';
import Temporary from './Components/Temporary';
import LoginForm from './Components/LoginForm';

const NotFound = (props) => <h1>NOT FOUND</h1>;

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      authed: true
    };
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
            <PrivateRoute authed={this.state.authed} path='/permanent' component={Permanent} />
            <PrivateRoute authed={this.state.authed} path='/temporary' component={Temporary} />
            <Route exact path="/login" component={LoginForm}></Route>
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    )
	}
}
