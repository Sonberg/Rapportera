import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationBar, Icon, Button, Title, Heading } from '@shoutem/ui';


export default class Navigation extends React.Component {

  goToSettings = () => this.props.navigation.navigate('Settings');
  createNew = () => this.props.createNew();

  render() {

    return (
        <NavigationBar
          style={{
            container: {
               backgroundColor: '#f3f3f3'
            },
          }}
          styleName="inline"
          leftComponent={<Button onPress={this.goToSettings} style={{padding: 12}}><Ionicons name="md-menu" size={24} color={"black"}/></Button>}
          centerComponent={<Title style={{ fontSize: 18 }}>RAPPORTERA</Title>}
          rightComponent={(
            <Button style={{padding: 12}} onPress={this.createNew}>
              <Ionicons name="md-add" size={26} color={"black" } />
            </Button>)}
        />
    );

  }
}
