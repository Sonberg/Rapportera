import React from 'react';
import moment from 'moment';
import AutogrowInput from 'react-native-autogrow-input';
import DateTimePicker from 'react-native-datetime';

import { Screen, Divider, View, Tile,Text, Title, Heading, TouchableOpacity, Button, Icon, Subtitle, Caption, Row, TextInput } from '@shoutem/ui';
import { StyleSheet, ScrollView } from 'react-native';
import { formatTime } from '../../helpers';
import t, { form } from 'tcomb-form-native';
import { graphql, gql } from 'react-apollo';

const DATE_FORMAT = 'DD-MM-YYYY HH:mm';

const query = gql`query {
  allProjects(orderBy: isPrimary_DESC) {
    id
    name
    isPrimary
  }
}`

class Edit extends React.PureComponent {
  
  
  static defaultProps = {
    onChange: () => null
  }
  
  
  constructor(props) {
    super(props)
    this.state = {
      rapport: props.rapport,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.rapport) {
      return;
    }
    
    this.setState({ rapport: nextProps.rapport });
  }
  
  
  update(state) {
    this.props.onChange(state.rapport);
    this.setState(state);
  }
  
  projects = () => {
    var obj = {};
    this.props.data.allProjects.forEach((p) => obj[p.id] = p.name);
    return t.enums(obj || {}, "Projects");
  }
  
  model = () => t.struct({   
    project: this.projects(),
    start: t.Date,               
    end: t.Date,
    comment: t.maybe(t.String),         
  });
  
  formatRapport = (rapport) => {
    return {
      comment: rapport.comment,
      start: moment(rapport.start).toDate(),
      end: moment(rapport.end).toDate(),
      project: rapport.project ? rapport.project.id : null
    }
  }
  
  options = () => {
    return {
      fields: {
        start: {
          config: {
            format: (date) => moment(date).format('DD/MM/YYYY HH:mm'), 
          }
        },
        end: {
          config: {
            format: (date) => moment(date).format('DD/MM/YYYY HH:mm'), 
          }
        }
      }
    }
  }


  render() {
    
    const { rapport } = this.state;
  
    return (        
      <ScrollView style={{padding: 16}}>
      
        
        <form.Form
          ref="form"
          type={this.model()}
          value={this.formatRapport(rapport)}
          options={this.options()}
        />
          
      </ScrollView>
    );
  }
}

export default graphql(query, {})(Edit)


/*
<View  styleName="vertical md-gutter-vertical">
  <Caption>Start time ({DATE_FORMAT.toLowerCase()})</Caption>
  <TextInputMask
    style={{flex: 1}}
    customTextInputProps={{
      inputStyle: { color: 'black', fontWeight: '500', fontSize: 16, left: 0 }
    }}
    value={moment(rapport.start).format(DATE_FORMAT)}
    type={'datetime'}
    onChangeText={this.setStart}
    options={{
      format: DATE_FORMAT
    }} />
</View>
<Divider styleName="line" />



setStart = (date) => {
  let time = moment(date, DATE_FORMAT);
  if (date && date.length === 16 && time.isValid()) {
    let state = { rapport: {...this.state.rapport, start: time }};
    this.update(state);
  }
  
}

setEnd = (date) => { 
  let time = moment(date, DATE_FORMAT);
  if (date && date.length === 16 && time.isValid()) { 
    let state = {rapport: {...this.state.rapport, end: time }};
    this.update(state);
  }
}

setComment = (text) => { 
  let state = {rapport: {...this.state.rapport, comment: text }};
  this.update(state);
}

 */