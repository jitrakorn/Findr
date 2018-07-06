import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import BuildingScreen from './app/screens/BuildingScreen';
import DetailsScreen from './app/screens//DetailsScreen.js'
import DirectoryScreen from './app/screens//DirectoryScreen.js'
import MapScreen from './app/screens//MapScreen.js';
import SearchScreen from './app/screens//SearchScreen.js'

YellowBox.ignoreWarnings((['Warning: isMounted(...) is deprecated']))

const RootStack = createStackNavigator(
    {
        BuildingMap: BuildingScreen,
        Details: DetailsScreen,
        Directory: DirectoryScreen,
        Map: MapScreen,
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