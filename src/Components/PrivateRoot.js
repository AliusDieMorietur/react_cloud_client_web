import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute ({component: Component, authed, redirect, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props}/>
        : <Redirect to={ redirect }/>
      }
    />
  )
}