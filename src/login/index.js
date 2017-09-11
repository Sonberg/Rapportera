import React from 'react';
import Expo from 'expo';
import Auth0 from 'react-native-auth0';
import jwtDecoder from 'jwt-decode';

import { client } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { graphql, gql, compose } from 'react-apollo';
import { redirect_uri, authorize_url, logout_url, auth0_client_id } from '../../config';
import { View, StyleSheet, Modal, TouchableOpacity, Linking, AsyncStorage } from 'react-native';
import {observer, inject} from "mobx-react/native";
import {
  Overlay,
  Text,
  Subtitle,
} from '@shoutem/ui';


export default
@inject((store) => store)
@observer
class Login extends React.Component {
  
  state = {
    user: null
  }
  
  componentDidMount() {
    Linking.addEventListener('url', this._handleAuth0Redirect);
    Linking.getInitialURL().then(url => this._handleAuth0RedirectUrl(url)).catch(err => {
      console.warn('An error occurred', err);
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleAuth0Redirect);
  }

  render() {
    
    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Subtitle>{this.state.user ? this.state.user.name : ""}</Subtitle>
          <Text styleName="h-center" >
            Login with
          </Text>
          <TouchableOpacity onPress={() => this._loginWithAuth0('facebook')} style={styles.button}>
            <Ionicons name="logo-facebook" style={styles.icon} />
            <Subtitle>Facebook</Subtitle>
          </TouchableOpacity>
          <Text styleName="h-center">
            or
          </Text>
          <TouchableOpacity onPress={() => this._loginWithAuth0('google-oauth2')} style={styles.button}>
            <Ionicons name="logo-google" style={styles.icon} />
            <Subtitle>Google</Subtitle>
          </TouchableOpacity>
          
        </View>
      </View>
    );
    
  }
  
  _loginWithAuth0 = async (connection) => {
    const redirectionURL = authorize_url + this._toQueryString({
        client_id: auth0_client_id,
        response_type: 'token',
        scope: 'openid name',
        redirect_uri: redirect_uri,
        connection: connection
      });
      
    Expo.WebBrowser.openBrowserAsync(redirectionURL);
  
  }

  _handleAuth0Redirect = async (event) => {
    
      if (!event.url.includes('+/redirect')) {
        console.log("have redirect, closing");
          return;
      }
      
      Expo.WebBrowser.dismissBrowser();
      this._handleAuth0RedirectUrl(event.url);
  }

  _handleAuth0RedirectUrl = async (url) => {
    
    if (!url.includes('redirect')) {
      console.log("dont include redirect");
      return;
    }

    const [, queryString] = url.split('#')
    const responseObj = queryString.split('&').reduce((map, pair) => {
      const [key, value] = pair.split('=')
      map[key] = value // eslint-disable-line
      return map
    }, {});
    
    const encodedToken = responseObj.id_token;
    const decodedToken = jwtDecoder(encodedToken);
    const username = decodedToken.name;
    
    this.props.store.saveToken(encodedToken).then((res) => {
      console.log("res", res);
      this.props.store.checkSession((user) => {
        console.log("user", user);
        if (!user) {
        //  this.props.store.createUser({encodedToken, username});
        }
        
      });
      
    });
    
  }

  _toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
  }

  
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    display: 'flex'
  },
  icon: {
    marginRight: 9, 
    fontSize: 22
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    margin: 12,
    marginHorizontal: 18,
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 9,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center'
  }
});
