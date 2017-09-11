import Expo from 'expo';
import { observable, action } from 'mobx';
import { graphql, gql, compose } from 'react-apollo';
import { Linking, AsyncStorage } from 'react-native';
import { redirect_uri, authorize_url, logout_url, auth0_client_id } from '../../config';

const currentUserQuery = gql`
    query currentUser {
        user {
            id
            name
        }
    }
`

const createUserMutation = gql`
  mutation createUser($encodedToken: String!, $username: String!) {
    createUser( authProvider: { auth0: { idToken: $encodedToken } } name: $username )
      {
        id
        name
      }
  }
`


class Store {
  @observable token = '';
  @observable user = null;
  @observable isAuthenticated = false;
  @observable loading = true;
  @observable rapports = [];
  
  client = null;
  
  @action init = (client) => {
    this.client = client;
    
    AsyncStorage.getItem('token').then(encodedToken => {
      this.token = encodedToken;
      this.checkSession();
    })
    
  };
  
  @action checkSession = (callback) => {
    this.client.query({query: currentUserQuery}).then(result => {
      
      this.loading = false;
      
      if (result.data.user) {
        this.isAuthenticated = true;
        this.user = {
            name: result.data.user.name,
            id: result.data.user.id
          };
      } else {
        this.isAuthenticated = false;
        this.user = null
      }
      
      if (callback) {
        callback(result.data.user);
      }
      
    });
  }
  
  @action saveToken = (encodedToken) => {
    this.token = encodedToken;
    return AsyncStorage.setItem('token', encodedToken);
  };

  @action createUser = ({encodedToken, username}) => {
      this.client.mutate({mutation: createUserMutation, variables: { encodedToken, username } }).then((result) => {
        console.log("created");
        this.checkSession();
      });
  }
  
  @action loginUser = () => {
    
  }  
  
  @action logoutUser = () => {
    AsyncStorage.removeItem('token').then(res => {
      this.token = null;
      this.checkSession();
    });
  };

  
  _toQueryString(params) {
    return '' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
  }
  
}

const store = new Store();

export default store;
