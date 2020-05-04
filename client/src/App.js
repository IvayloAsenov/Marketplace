import React from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Login from './components/Login';
import Register from './components/Register';
import Timeline from './components/Timeline';
import NotFound from './components/NotFound';

import UserProfile from './components/UserProfile';
import './App.css';
import Cart from "./components/Cart";
// import InitializeChatComponent from './components/InitializeChatComponent';
import ChatComponent from './components/ChatComponent';
import WebSocketInstance from './WebSocket';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", logged_in: !!localStorage.getItem('token'), id: undefined };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/core/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if(res.status >= 400) {
            throw new Error("Invalid token or it expired.");
          }
          return res.json()
        })
        .then(json => {
          this.setState({ username: json.username, id: json.id });
        }).catch(err => {
          this.setState({ logged_in: false, username: '' });
      });
    }
  }

  handleLogin = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
        if(res.status >= 400) {
          throw new Error("Invalid credentials.");
        }
        return res.json()
      })
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          username: json.user.username,
          id: json.user.id,
        });
      }).catch(err => {
        alert("Invalid credentials.");
    });
    // WebSocketInstance.connect();
  };

  handleSignup = (e, data) => {
    fetch('http://localhost:8000/core/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
        if(res.status >= 400) {
          throw new Error("");
        }
        return res.json()
      })
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          username: json.username,
          id: json.id,
        });
      }).catch(err => alert("Something went wrong!"));
  };

  handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('state');
    this.setState({ logged_in: false, username: '', id: undefined });
    alert("Successfully logged out!");
  };

  handleChat = (e, data) => {
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
        if(res.status >= 400) {
          throw new Error("Invalid credentials.");
        }
        return res.json()
      })
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          username: json.user.username,
          id: json.user.id,
        });
      }).catch(err => {
        alert("Invalid credentials.");
    });
    // WebSocketInstance.connect();
  };

  render() {
    const { username, logged_in, id } = this.state;
    return (
        <BrowserRouter>
          <div className="h-100 gray">
            <Header logged_in={ logged_in } username={ username } id={ id } handle={this.handleLogout} handle_chat={this.handleChat}/>
            <Switch>
              <PublicRoute logged_in={logged_in} exact path="/login" component={ Login } handle={this.handleLogin} />
              <PublicRoute logged_in={logged_in} exact path="/register" component={ Register } handle={this.handleSignup} />
              <PrivateRoute logged_in={logged_in} path="/users/:name" component={ UserProfile } id={id }/>
              <PrivateRoute logged_in={logged_in} path="/cart" component={ Cart } id={id } />
              <PrivateRoute logged_in={logged_in} exact path="/" component={ Timeline } username={ username } id={ id }/>
              <PrivateRoute logged_in={logged_in} exact path="/chat/:chatroom_id" component={ ChatComponent } currentUser={ username } id={ id }/>
              <Route component={ NotFound } />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

const PublicRoute = ({ component: Component, logged_in, handle, ...rest }) => {
  return (
      <Route
          {...rest}
          render={props =>
              !logged_in ? (
                  <Component {...props} handle={handle} />
              ) : (
                  <Redirect to={{ pathname: '/'}} />
              )}/>
  )
};

const PrivateRoute = ({ component: Component, logged_in, id, ...rest }) => {
  return (
      <Route
          {...rest}
          render={props =>
            logged_in ? (
                <Component {...props} id={id} />
            ) : (
                <Redirect to={{ pathname: '/login'}} />
            )}/>
  )
};

export default App;
