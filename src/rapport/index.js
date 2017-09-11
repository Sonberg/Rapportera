import React from 'react';
import { Screen, Divider, View, Tile,Text, Title, Heading, NavigationBar, Button, Icon, Subtitle, Caption } from '@shoutem/ui';
import { StyleSheet, Keyboard } from 'react-native';
import { graphql, gql } from 'react-apollo';

import Edit from './components/edit';
import Projects from './components/projects';
import moment from 'moment';
import { timeDuration } from '../helpers';

const saveRapport = gql`
  mutation updateRapport($id: ID!, $projectId: ID!, $comment: String!, $start: DateTime!, $end: DateTime!) { 
  updateRapport(id: $id, projectId: $projectId, comment: $comment, start: $start, end: $end) {
    id
  }
}`

class Rapport extends React.Component {
  
  save = async () => {
    const { id, comment, start, end } = this.state.rapport;
     let response = await this.props.updateRapport({variables: {id, comment, start, end, projectId: this.state.rapport.project.id }});
     Keyboard.dismiss();
     this.props.navigation.goBack();
  }
  
  render() {
    
    const { rapport } = this.props.navigation.state.params;
    
    return (
      <Screen styleName="paper">
        <NavigationBar
          styleName="inline"
          leftComponent={<Button onPress={() => this.props.navigation.goBack()}><Icon name="back"/></Button>}
          centerComponent={<Heading styleName="v-center">{timeDuration(rapport.start, rapport.end)}</Heading>}
          rightComponent={<Button onPress={this.save}><Subtitle>Save</Subtitle></Button>}
        />
        
        <Edit rapport={rapport} onChange={(rapport) => this.setState({rapport: {...this.state.rapport, start: rapport.start, end: rapport.end, comment: rapport.comment }}) }>
          <Projects />
        </Edit>
        
      </Screen>
    );
  }
}


const styles = StyleSheet.create({
  active: {
    borderBottomColor: '#010101',
    borderBottomWidth: 2
  }
});

export default graphql(saveRapport, {name: 'updateRapport'})(Rapport)