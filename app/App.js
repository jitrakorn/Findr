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
    Map: {
        screen: MapStack,
        navigationOptions: ({ navigation }) => ({
            title: "Map",
            icon: ({ tintColor }) => <Icon name = 'map' size = {25} color = 'black'/>
        })
    },
    Search: {
        screen: SearchStack,
    },
    About: {
        screen: AboutScreen,
    }
},
{
    initialRouteName: 'Map',
    navigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, tintColor}) => {
            const {routeName} = navigation.state;
            if(routeName === 'Map') (<Icon name = 'map'/>)
            else if (routeName === 'Search') (<Icon name = 'search'/>)
        }
    }),
    tabBarOptions: {
        activeTintColor: '#e67e22',
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