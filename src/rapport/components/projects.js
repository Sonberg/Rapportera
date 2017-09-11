import React from 'react';
import { graphql, gql } from 'react-apollo';
import ListPopover from '../../components/ListPopover';
import { View, Text, TextInput, DropDownMenu, Divider } from '@shoutem/ui';
import { TouchableHighlight } from 'react-native';

const query = gql`query {
  allProjects(orderBy: isPrimary_DESC) {
    id
    name
    isPrimary
  }
}`


class Projects extends React.Component {
  
  static defaultProps = {
    onChange: () => null,
    project: null
  }
  
  constructor(props) {
    super(props)

    this.state = {
      item: props.project,
      placeholder: "Select Item",
      isVisible: false,
    };
  }
  
  togglePopover = () => {
     this.setState({isVisible: !this.state.isVisible});
   }

   closePopover = () => {
     this.setState({isVisible: false});
   }

   setItem = (item) => {
     this.setState({ item: item });
   }
  
  render() {
     
    const { data } = this.props;

    return (
      <View>
        <TouchableHighlight onPress={this.togglePopover} overlayColor={'transparent'}>
         <Text>{this.state.item ? this.state.item : this.state.placeholder}</Text>
       </TouchableHighlight>
       
       <ListPopover
         list={data.allProjects.map(p => p.name) || []}
         isVisible={this.state.isVisible}
         onClick={this.setItem}
         onClose={this.closePopover}
       />
       <Divider styleName="line" />
      </View>
    )
  }
}

export default graphql(query, {})(Projects)