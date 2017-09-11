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


const createUserMutation = gql`
  mutation createUser($encodedToken: String!, $username: String!) {
    createUser( authProvider: { auth0: { idToken: $encodedToken } } name: $username )
      {
        id
        name
      }
  }
`

export default
@inject((store) => store) 
@observer 
class Settings extends React.Component {
  
  render() {
    
    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          
          <TouchableOpacity onPress={this.props.store.logoutUser} style={styles.button}>
            <Subtitle>Logout</Subtitle>
          </TouchableOpacity>
          
        </View>
      </View>
    );
    
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
