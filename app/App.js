import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import BuildingScreen from './screens/BuildingScreen';
import DetailsScreen from './screens//DetailsScreen.js'
import DirectoryScreen from './screens//DirectoryScreen.js'
import MapScreen from './screens//MapScreen.js';
import SearchScreen from './screens//SearchScreen.js'

YellowBox.ignoreWarnings((['Warning: isMounted(...) is deprecated']));
YellowBox.ignoreWarnings((['Setting a timer']));

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