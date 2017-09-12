import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen, Stage, Button, Icon, Divider, Tile, Title, Subtitle, Heading, Image, Text, View } from '@shoutem/ui';
import BackgroundJob from 'react-native-background-job';
import moment from 'moment';

export default class Timer extends React.Component {

  static defaultProps = {
    onStop: () => null
  }


  constructor(props) {
    super(props);

    this.state = {
      started: false,
      counter: 0,
      clock: null,
      startedAt: null
    };

  }

  updateTime = () => {
    this.setState({ counter: this.state.counter + 1 });
  }

  start = () => {
    this.setState({ clock: setInterval(this.updateTime, 1000), started: true, startedAt: moment() });
  }

  stop = () => {
    this.props.onStop(this.state.startedAt, moment());
    this.reset();
  }

  reset = () => {
    clearInterval(this.state.clock);
    this.setState({ clock: null, started: false, counter: 0, startedAt: null });
  }

  render() {

    const { started, counter, startedAt } = this.state;

    return (
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} styleName="md-gutter">

        <Tile>
          <Heading styleName={started ? "" : "muted"}>
            {startedAt ? moment.utc(moment().diff(this.state.startedAt)).format('HH : mm : ss') : '00 : 00 : 00'}
          </Heading>
        </Tile>

        <Button onPress={() => started ? this.stop() : this.start()}>
          <Icon name={started ? "stop" : "play"} size={28} />
        </Button>

      </View>
    );
  }

}
