import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { reducer, initialState } from './components/reducers/userReducer';
import UserProfile from './components/screens/UserProfile'
import SubUserPosts from './components/screens/SubUserPosts'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(typeof (user), user)
    if (user) {
      dispatch({ type: "USER", payload: user })
      // history.push('/')
    }
    else {
      history.push('/signin')
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/create" component={CreatePost} />
      <Route exact path="/profile/:userid" component={UserProfile} />
      <Route exact path="/myfollowerpost" component={SubUserPosts} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
