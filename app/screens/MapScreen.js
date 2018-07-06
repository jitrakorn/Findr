import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapMarker from './MapMarker';
import buildingData from '../database/buildings.json'

export default class MapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
            },
            title: 'Map',
            headerLeft: <View />,
            headerRight: (
                <HeaderButton
                    IconComponent = {Icon}
                    iconSize = {23}
                    color = 'black'
                >
                    <HeaderButton.Item
                        title = 'search'
                        iconName = 'search'
                        onPress = {() => navigation.navigate('Search')}
                    />
                </HeaderButton>
            )
        }
    }

    render() {
        return (
            <View style = {styles.container}>
                <StatusBar backgroundColor = 'white' barStyle = 'dark-content' />

                <MapView
                    provider = {PROVIDER_GOOGLE}
                    style = {styles.map}
                    initialRegion = {{
                        latitude: 1.295087,
                        longitude: 103.77388559999997,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {buildingData.map((building, i) => (
                        <MapMarker
                            key = {i}
                            name = {building.name}
                            coordinate = {{latitude: Number(building.latitude), longitude: Number(building.longitude)}}
                            onPress = {() => this.props.navigation.navigate('BuildingMap', {index: i})}
                        />
                    ))}
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})