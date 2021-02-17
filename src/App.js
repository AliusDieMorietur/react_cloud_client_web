import React from 'react';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import Header from './Components/Header';
import FileForm from './Components/Form';

const Home = () => {
  return(
    <div className="home">
      <h2>This is the home page</h2>
    </div>
  )
}

const SomeComponent = withRouter(props => <Header {...props}/>)

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <SomeComponent/>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/temporary" component={FileForm}></Route>
          </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;