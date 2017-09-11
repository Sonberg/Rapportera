/**
 * ListPopover - Popover rendered with a selectable list.
 */

import React from 'react';

import {
  ListView,
  PropTypes,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});


class ListPopover extends React.Component {
  
  static defaultProps =  {
      list: [""],
      isVisible: false,
      onClick: () => null,
      onClose: () => null 
  }
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows(this.props.list)
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({dataSource: ds.cloneWithRows(nextProps.list)});
    }
  }
  
  handleClick = (data) => {
    this.props.onClick(data);
    this.props.onClose();
  }
  
  renderRow = (rowData) => {
    var separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
    var rowTextStyle = this.props.rowText || DefaultStyles.rowText;

    var separator = <View style={separatorStyle}/>;
    if (rowData === this.props.list[0]) {
      separator = null;
    }

    var row = <Text style={rowTextStyle}>{rowData}</Text>
    if (this.props.renderRow) {
      row = this.props.renderRow(rowData);
    }

    return (
      <View>
        {separator}
        <TouchableOpacity onPress={() => this.handleClick(rowData)}>
          {row}
        </TouchableOpacity>
      </View>
    );
  }
  
  renderList = () => {
    var styles = this.props.style || DefaultStyles;
    var maxHeight = {};
    if (this.props.list.length > 12) {
      maxHeight = {height: SCREEN_HEIGHT * 3/4};
    }
    return (
      <ListView
        style={maxHeight}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
      />
    );
  }
  
  render () {
    var containerStyle = this.props.containerStyle || DefaultStyles.container;
    var popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose}>
          <View style={containerStyle}>
            <View style={popoverStyle}>
              {this.renderList()}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (<View/>);
    }
  }
};


var DefaultStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#f1f1f6'
  },
  popover: {
    borderRadius: 3,
    padding: 3,
    height: 200
  },
  rowText: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#CCC',
  },
});

module.exports = ListPopover;