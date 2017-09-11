import React from 'react';
import { graphql, gql } from 'react-apollo';
import Swipeout from 'react-native-swipeout';
import { StyleSheet, RefreshControl } from 'react-native';
import { 
  Screen, 
  Button, 
  Icon, 
  Divider, 
  ListView, 
  Tile, 
  Title, 
  Heading, 
  Subtitle, 
  Image, 
  Text, 
  View, 
  Caption, 
  Row, 
  ScrollView, 
  TouchableOpacity 
} from '@shoutem/ui';

import moment from 'moment';
import { timeDuration } from '../../helpers';

const query = gql`query {
  allRapports(orderBy: end_ASC) {
    id
    comment
    end
    start
    project {
      id
      name
    }
  }
  allProjects(orderBy: isPrimary_DESC) {
    id
    name
    isPrimary
  }
}`

class TrackList extends React.Component {
  
  constructor(props) {
   super(props);
  
   this.state = {
    buttons: [ 
      { text: 'Change', backgroundColor: '#2c3e50', underlayColor: "#34495e" },
      { text: 'Delete', backgroundColor: '#c0392b', underlayColor: "#e74c3c" } 
   ]};
 }
 
 show = (rapport) => {
  this.props.navigation.navigate('Rapport', { rapport });
 }
 
 getSectionHeaderId() {
   return 1;
 }

 
 renderSectionHeader = () => {
   return (   
     <Divider styleName="section-header">
      <Caption>PRODUCT NAME</Caption>
      <Caption>PRICE</Caption>
    </Divider>
   );
 }
 
 renderRow = (rapport) => {
    return (
      <View>
        <Row>
          <Tile styleName="md-gutter-right">
            <Heading>{timeDuration(rapport.start, rapport.end)}</Heading>
          </Tile>
          <TouchableOpacity 
            onPress={() => this.show(rapport)} 
            styleName="vertical center space-between"
            >
            <Subtitle>{rapport.project ? rapport.project.name : "(no project selected)"}</Subtitle>
            
            {rapport.comment ? (
              <Caption>{rapport.comment}</Caption>
            ) : (null)}
            
          </TouchableOpacity>
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    
    const { loading, allRapports } = this.props.data;
    
    return (
      <Screen styleName="paper">
        <ListView
          styleName="paper"
          data={allRapports || []}
          renderRow={this.renderRow}
          loading={loading}
        //  renderSectionHeader={this.renderSectionHeader}
          getSectionId={this.getSectionHeaderId}
          refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => null}
          />
        }
        />
      </Screen>
    );
  }
 
}


export default graphql(query, {
  options: { pollInterval: 8000 },
})(TrackList)