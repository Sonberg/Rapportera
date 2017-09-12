import React from 'react';
import { graphql, gql } from 'react-apollo';
import Swipeout from 'react-native-swipeout';
import { StyleSheet, RefreshControl, SectionList } from 'react-native';
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
  allRapports(orderBy: end_DESC) {
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
      { text: 'Delete', backgroundColor: '#e74c3c', underlayColor: "#c0392b" },
      { text: 'Edit', type: 'primary' }
   ]};
 }

 show = (rapport) => {
  this.props.navigation.navigate('Rapport', { rapport });
 }

 getSectionHeaderId() {
   return 1;
 }


 renderSectionHeader = ({section}) => {
   return (
     <Divider styleName="section-header" style={{ backgroundColor: '#f3f3f3' }}>
      <Subtitle style={{color: 'black', paddingLeft: 16, paddingBottom: 8, fontWeight: 'bold'}}>{section.key}</Subtitle>
    </Divider>
   );
 }

 keyExtractor = (item, index) => item.id;

 renderRow = (rapport) => {
    return (
      <Swipeout right={this.state.buttons} sensitivity={20} autoClose={true}>
        <Row style={{ backgroundColor: '#f3f3f3' }}>
          <Tile styleName="md-gutter-right"   style={{ backgroundColor: '#f3f3f3' }}>
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
      </Swipeout>
    );
  }

formatRapports = (rapports) => {
  return rapports.reduce((acc, post) => {
    const foundIndex = acc.findIndex(element => element.key === moment(post.end).calendar().split(" at")[0]);
    if (foundIndex === -1) {
      return [
        ...acc, {
          key: moment(post.end).calendar().split(" at")[0],
          data: [post]
        }
      ];
    }
    acc[foundIndex].data = [
      ...acc[foundIndex].data, post
    ];
    return acc;
  }, []);
}

  render() {

    const { loading, allRapports } = this.props.data;
    if (!allRapports) {
      return null;
    }

    return (
        <SectionList
          style={{backgroundColor: '#f3f3f3'}}
          loading={loading}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.formatRapports(allRapports)}
          refreshControl={
          <RefreshControl
            style={{backgroundColor: '#f3f3f3'}}
            refreshing={loading}
            onRefresh={() => null}
          />}
        />
    );
  }

}

/*
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
*/


export default graphql(query, {
  options: { pollInterval: 8000 },
})(TrackList)
