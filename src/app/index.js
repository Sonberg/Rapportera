import React from 'react';
import Store from '../store';
import Login from '../login';
import AppNavigator from '../Router.js';

import { AppLoading } from 'expo';
import { client } from '../../App';
import {observer, inject} from "mobx-react/native";

export default
@inject((store) => store)
@observer
class App extends React.Component {
  
  
  render() {
    
    const { user, isAuthenticated, loading, token } = this.props.store;
    console.log("isAuthenticated", isAuthenticated);
    if (loading) {
      return null;
    }
    
    if (!isAuthenticated || !token) {
      return (<Login />);
    }
    
    return (<AppNavigator/>);
    
  }
}

