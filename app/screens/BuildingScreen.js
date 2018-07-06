import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button, ButtonGroup, Card } from 'react-native-elements';
import HeaderButton from 'react-navigation-header-buttons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapMarker from './MapMarker';
import data from '../database/buildings.json'

export default class BuildingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFloor: 1,
            selectedRoom: 0,
            markerSelected: false,
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    deselectMarker() {
        this.setState({markerSelected: false})
    }

    selectMarker(selectedRoom) {
        this.setState({markerSelected: true})
        this.setState({selectedRoom: selectedRoom})
    }

    updateIndex(selectedFloor) {
        this.setState({selectedFloor})
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
            },
            title: data[navigation.getParam('index', 'NO-ID')].name,
            headerLeft: (
                <HeaderButton IconComponent = {Icon} iconSize = {23} color = "black">
                    <HeaderButton.Item 
                        title = "back"
                        iconName = "arrow-back"
                        onPress = {() => navigation.goBack()}
                    />
                </HeaderButton>
            ),
            headerRight: (
                <HeaderButton
                    IconComponent = {Icon}
                    iconSize = {23}
                    color = 'black'
                >
                    <HeaderButton.Item
                        title = 'directory'
                        iconName = 'format-list-bulleted'
                        onPress = {() => navigation.navigate('Directory', {index: navigation.getParam('index', 'NO-ID')})}
                    />
                </HeaderButton>
            )
        }
    }

    render() { 
        const index = this.props.navigation.getParam('index', 'NO-ID');
        const buttons = data[index].floors.map((floors) => (floors.floor));
        const {selectedFloor} = this.state;

        return (
            <View style = {styles.container}>
                <MapView
                    provider = {PROVIDER_GOOGLE}
                    style = {styles.map}
                    initialRegion = {{
                        latitude: Number(data[index].latitude),
                        longitude: Number(data[index].longitude),
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                    }}
                    onPress = {() => this.deselectMarker()}
                >
                    {this.state.markerSelected ? 
                        <MapMarker
                            name = {data[index].floors[this.state.selectedFloor].rooms[this.state.selectedRoom].name}
                            coordinate = {{
                                latitude: Number(data[index].floors[this.state.selectedFloor].rooms[this.state.selectedRoom].latitude),
                                longitude: Number(data[index].floors[this.state.selectedFloor].rooms[this.state.selectedRoom].longitude)
                            }}
                        />

                    :
                        data[index].floors[this.state.selectedFloor].rooms.map((room, index) => (
                        <MapMarker
                            key = {index}
                            name = {room.name}
                            coordinate = {{
                                latitude: Number(room.latitude),
                                longitude: Number(room.longitude)
                            }}
                            onPress = {() => this.selectMarker(index)}
                        />
                        ))
                    }

                    <MapView.Overlay
                        //bounds = {[[1.295529, 103.773545],[1.294544, 103.774315]]}
                        //image = {require(data[index].floors[selectedFloor].floorplan)}
                    />
                </MapView>

                {this.state.markerSelected ?

                    <Card containerStyle = {styles.cardContainer}>
                            <Text style = {styles.cardName}> {data[index].floors[this.state.selectedFloor].rooms[this.state.selectedRoom].fullname} </Text>
                            <Text style = {styles.cardInfo}> {data[index].floors[this.state.selectedFloor].rooms[this.state.selectedRoom].type} · {data[index].floors[this.state.selectedFloor].rooms[this.state.selectedRoom].unit} </Text>
                            <Button
                                title = 'More Details'
                                onPress = {() => this.props.navigation.navigate('Details', {building: index, floor: this.state.selectedFloor, room: this.state.selectedRoom})}
                            />
                        </Card>
                :
                    <ButtonGroup
                        containerStyle = {styles.cardContainer}
                        onPress = {this.updateIndex}
                        selectedIndex = {selectedFloor}
                        buttons = {buttons}
                    />
                }


            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        bottom: 10,
        left: -5,
        right: -5,
        position: 'absolute',
    },

    cardName: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    cardInfo: {
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
})
