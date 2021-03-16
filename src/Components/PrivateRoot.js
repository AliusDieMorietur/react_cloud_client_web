import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute ({
    component: Component, 
    authed, 
    transport, 
    callback,
    redirect, 
    ...rest
  }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component authed={ authed } transport={ transport } callback={callback} {...props}/>
        : <Redirect to={ redirect }/>
      }
    />
  )
}