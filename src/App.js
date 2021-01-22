import React, { useState } from 'react';
import './App.css';
import Home from './components/Home/Home'
import './initializeDB';
import { Route, Switch, withRouter } from 'react-router-dom'
import Login from './components/Login/Login';
import PatientRegistration from './components/doctor/PatientRegistration/PatientRegistration';
import Navigation from './components/Navigation/Navigation';
import CheckupDetails from './components/doctor/CheckupDetails/CheckupDetails';

function App(props) {
  let loginStatus=localStorage.getItem('currentRole')!=undefined;
  const [isLoggedIn, setIsLoggenIn] = useState(loginStatus);

  const authenticatedRoutes = (
    <Switch>
      <Route path='/home/:id' component={CheckupDetails} />
      <Route path='/home' component={Home} />
      <Route path='/register' component={PatientRegistration} />
      <Route path='/' component={Home} />
    </Switch>
  )

  const loginSuccess = (role, name) => {
    localStorage.setItem('currentRole', role);
    localStorage.setItem('username', name);
    setIsLoggenIn(true);
  }

  const logoutHandler=()=>{
    localStorage.removeItem('currentRole');
    setIsLoggenIn(false);
    props.history.push('/');
  }

  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} logout={logoutHandler}/>
      <Switch>
        {
          isLoggedIn ?
            authenticatedRoutes :
            <Route path='/' component={() => <Login loginSuccess={loginSuccess} />} />
        }
      </Switch>
    </>
  );
}

export default withRouter(App);
