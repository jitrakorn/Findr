import React, { Component } from 'react';
import { AppRegistry, Text, YellowBox } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BuildingScreen from './screens/BuildingScreen';
import DetailsScreen from './screens//DetailsScreen.js'
import DirectoryScreen from './screens//DirectoryScreen.js'
import MapScreen from './screens//MapScreen.js';
import SearchScreen from './screens//SearchScreen.js'
import StaffScreen from './screens/StaffScreen';
import AboutScreen from './screens/AboutScreen';

YellowBox.ignoreWarnings((['Warning: isMounted(...) is deprecated']));
YellowBox.ignoreWarnings((['Setting a timer']));

const MapStack = createStackNavigator({
    Map: MapScreen,
    BuildingMap: BuildingScreen,
    Details: DetailsScreen,
    Directory: DirectoryScreen,
    Staff: StaffScreen,
},
{
    initialRouteName: 'Map',
}
)

const SearchStack = createStackNavigator({
    BuildingMap: BuildingScreen,
    Search: SearchScreen,
    Details: DetailsScreen,
    Staff: StaffScreen,
},
{
    initialRouteName: 'Search',
})

const RootStack = createBottomTabNavigator({
    Map: MapStack,
    Search: SearchStack,
    About: AboutScreen,
},
{
    initialRouteName: 'Map',
    navigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, tintColor}) => {
            const {routeName} = navigation.state;
            if(routeName === 'Map') (<Text> Hi </Text>)
            else if (routeName === 'Search') (<Icon name = 'search'/>)
        }
    }),
    tabBarOptions: {
        activeTintColor: 'magenta',
        showIcon: true,
        labelStyle: ({fontFamily: 'Rubik-Regular'})
    }
});

export default class Findr extends Component {
    render() {
        return <RootStack />
    }
}

AppRegistry.registerComponent('BottomSheet', () => BottomSheet)