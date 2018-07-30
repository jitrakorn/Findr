import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons'
import MapView, { PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapMarker from '../components/MapMarker';
import { firebaseApp } from '../firebase';

export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buildingData: [],
        }
    }

    getBuildingData() {
        buildingRef = firebaseApp.database().ref('buildings/');
        buildingRef.once('value', (snapshot) => {
            this.setState({buildingData: Object.values(snapshot.val())});
        })
    }

    componentDidMount() {
        this.getBuildingData();
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        }
    }

    render() {
        return (
            <View style = {styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
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

                    {this.state.buildingData.map((building, index) => (
                        <MapMarker
                            key = {index}
                            name = {building.name}
                            coordinate = {{
                                latitude: building.latitude,
                                longitude: building.longitude,
                            }}
                            onPress = {() => this.props.navigation.navigate('BuildingMap', {
                                selectedBuilding: building.name,
                                selectedFloor: '01',
                            })}
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