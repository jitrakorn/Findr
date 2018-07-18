import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import BuildingScreen from './screens/BuildingScreen';
import DetailsScreen from './screens//DetailsScreen.js'
import DirectoryScreen from './screens//DirectoryScreen.js'
import MapScreen from './screens//MapScreen.js';
import SearchScreen from './screens//SearchScreen.js'

YellowBox.ignoreWarnings((['Warning: isMounted(...) is deprecated']));
YellowBox.ignoreWarnings((['Setting a timer']));


const MapStack = createStackNavigator({
    Map: MapScreen,
    BuildingMap: BuildingScreen,
    Details: DetailsScreen,
    Directory: DirectoryScreen,
},
{
    initialRouteName: 'Map',
}
)

const RootStack = createBottomTabNavigator({
    Map: MapStack,
    Search: SearchScreen,
},
{
    initialRouteName: 'Map',
}
);

export default class Findr extends Component {
    render() {
        return <RootStack />
    }
}

AppRegistry.registerComponent('BottomSheet', () => BottomSheet)