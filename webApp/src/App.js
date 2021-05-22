import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import reducers from './redux/reducers';
import Header from './components/Header';
import Home from './screens/Home';
import Shop from './screens/Shop';
import Register from './screens/Register';
import Login from './screens/Login';
import Account from './screens/Account';
import PublicationList from './screens/PublicationList';
import Publication from './screens/Publication';
import Device from './screens/Device';
import LoginProvider from './components/LoginProvider';

const store = createStore(reducers);

class App extends Component {
  state = {
    isMobile: window.innerWidth < 768,
  };

  throttledHandleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth < 768 });
  };

  componentDidMount() {
    window.addEventListener('resize', this.throttledHandleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledHandleWindowResize);
  }

  render() {
    const { isMobile } = this.state;
    return (
      <div className='App' id='outer-container'>
        <Provider store={store}>
          <BrowserRouter basename='/'>
            <Header isMobile={isMobile}></Header>
            <Switch id='page-wrap'>
              <Route exact path='/' component={Home} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/shop' component={Shop} />
              <Route exact path='/publications' component={PublicationList} />
              <Route exact path='/publications/:id' component={Publication} />
              <LoginProvider>
                <Route exact path='/account' component={Account} />
                <Route exact path='/devices/:mac_address' component={Device} />
              </LoginProvider>
            </Switch>
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}

export default App;
