

import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationBar, Icon, Button, Title, Heading } from '@shoutem/ui';


export default class Navigation extends React.Component {
  
  goToSettings = () => this.props.navigation.navigate('Settings')
  
  render() {
    
    return (
        <NavigationBar
          styleName="inline"
          leftComponent={<Button onPress={this.goToSettings} style={{padding: 12}}><Ionicons name="md-person" size={20}/></Button>}
          centerComponent={<Title>RAPPORTERA</Title>}
          rightComponent={(
            <Button style={{padding: 12}}>
              <Ionicons name="md-add" size={22} />
            </Button>)}
        />
    );
    
  }
}