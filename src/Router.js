import { StackNavigator } from 'react-navigation';

import Index from './index';
import Rapport from './rapport';
import Login from './login';
import Settings from './settings';

const AppNavigator = StackNavigator({
  Home: {
    screen: Index,
  },
  Rapport: {
    screen: Rapport,
  },
  Login: {
    screen: Login,
  },
  Settings: {
    screen: Settings,
  }
}, {
  navigationOptions: {
    header: null
  }
});

export default AppNavigator;