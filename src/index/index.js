import React from 'react';
import moment from 'moment';

import { StatusBar } from 'react-native';
import { Screen, View, Divider } from '@shoutem/ui';
import { graphql, gql, compose } from 'react-apollo';
import Navigation from './components/navigation';
import TrackList from './components/trackList';
import Timer from './components/timer';

const createRapportMutation = gql`
  mutation createRapport($start: DateTime!, $end: DateTime!) {
    createRapport( start: $start, end: $end )
      {
        id
        start
        end
      }
  }
`


class Index extends React.Component {


  createNew = (start, end) => {
    if (!start) {
      start = moment();
    }
    if (!end) {
      end = moment();
    }

    let params = { start: start.format(), end: end.format() };

    this.props.mutate({mutation: 'createRapport', variables: params })
    .then(rapport => this.showRapport(Object.assign({}, { comment: "" }, rapport)));
  };

  showRapport = (rapport) => this.props.navigation.navigate('rapport', { rapport });

  render() {
    return (
      <Screen styleName={'paper'}>
        <StatusBar
           backgroundColor="blue"
           barStyle="light-content"
         />
        <Navigation {...this.props} createNew={this.createNew}/>
        <TrackList {...this.props}/>
        <Divider styleName="line" />
        <Timer onStop={this.createNew} />
      </Screen>
    );
  }
}

export default graphql(createRapportMutation)(Index);
