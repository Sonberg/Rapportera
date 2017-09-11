import React from 'react';
import App from './src/app';
import Store from './src/store';

import { Provider } from 'mobx-react';
import { Font, AppLoading} from 'expo';
import { StyleSheet, Text, AsyncStorage } from 'react-native';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';


const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj6nppijv1p2n01430mjftjjy',
  batchInterval: 100,
  batchMax: 10,
})

networkInterface.use([{
  applyMiddleware(req, next) {
    
    if (!req.options.headers) {
      req.options.headers = {}  // Create the header object if needed.
    }
  
    if (Store.token) {
      req.options.headers['authorization'] = `Bearer ${Store.token}`
      
    }
      
    next()
    
  }
}]);

export const client = new ApolloClient({networkInterface});

class Wrapper extends React.Component {
  
  state = {
     fontsLoaded: false,
   };

 async componentWillMount() {
   
   Store.init(client);
   
   await Font.loadAsync({
     'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
     'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
     'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
     'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
     'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
     'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
     'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
     'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
     'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
     'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
     'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
   });

   this.setState({fontsLoaded: true});
  }
  
  
  render() {
    
    if (!this.state.fontsLoaded) {
      return (<AppLoading/>);
    }
    
    console.log("fontsLoaded");
    
    
    
    return (
      <ApolloProvider client={client}>
        <Provider store={Store}>
          <App />
        </Provider>
      </ApolloProvider>
    );
  }
}


export default Wrapper
