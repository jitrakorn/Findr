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
import MapMarker from '../components/MapMarker';
import { firebaseApp } from '../firebase';
import DirectoryScreen from './DirectoryScreen';

var database = firebaseApp.database();
var storage = firebaseApp.storage();

export default class BuildingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBuilding: this.props.navigation.getParam('selectedBuilding', 'NO-NAME'),
            selectedFloor: this.props.navigation.getParam('selectedFloor', 'NO-ID'),
            selectedIndex: 0,
            markerSelected: false,
            buildingData: [],
            floorData: [],
            roomData: [],
            floorplan: [],
            isLoading: true,
            directoryVisible: false,
        }
        this.updateFloor = this.updateFloor.bind(this)
    }

    getBuildingData() {
        var buildingsRef = database.ref('buildings/');
        buildingsRef.orderByChild('name').equalTo(this.state.selectedBuilding).once('value', (snapshot) => {
            this.setState({buildingData: Object.values(snapshot.val())})
        });
    }
    
    getFloorData() {
        var roomRef = database.ref('rooms/');
        var lookup = this.state.selectedBuilding + '-' + this.state.selectedFloor;
        roomRef.orderByChild('location').startAt(lookup).endAt(lookup + '\uf8ff').once('value', (snapshot) => {
            this.setState({floorData: Object.values(snapshot.val())});
        })
    }

    getSelectedIndex() {
        this.state.buildingData["0"].floors.map((floor, index) => {
            if(this.state.selectedFloor === floor) this.setState({selectedIndex: index})
        })
    }

    getFloorplan() {
        var storageRef = storage.ref(this.state.selectedBuilding + '/' + this.state.selectedFloor + '.png');
        storageRef.getDownloadURL().then((url) => {
            this.setState({floorplan: url});
            console.log(url)
        })
    }

    selectMarker(unit) {
        var roomRef = database.ref('rooms/');
        roomRef.orderByChild('unit').equalTo(unit).once('value', (snapshot) => {
            console.log(snapshot.val())
            this.setState({roomData: Object.values(snapshot.val())});
        })
    }

    deselectMarker() {
        this.setState({markerSelected: false})
    }

    updateFloor(selectedFloor) {
        this.setState({selectedFloor: this.state.buildingData["0"].floors[selectedFloor]});
        this.setState({selectedIndex: selectedFloor});
    }
        
    componentDidMount() {
        this.getBuildingData();
        this.getFloorData();
        if(this.props.navigation.getParam('selected', 'NO-NAME') === true) {
            this.selectMarker(this.props.navigation.getParam('selectedRoom', 'NO-NAME'))
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // After fetching building data
        if(this.state.buildingData !== prevState.buildingData) {
            this.getFloorplan();
            this.getSelectedIndex();
        }

        if(this.state.floorplan !== prevState.floorplan) this.setState({isLoading: false});
        
        // Get room markers after selectedFloor is updated
        if(this.state.selectedFloor !== prevState.selectedFloor) {
            this.getFloorData();
            this.getFloorplan();
        }

        if(this.state.roomData !== prevState.roomData) this.setState({markerSelected: true});
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
            },
            title: navigation.getParam('selectedBuilding', 'NO-NAME'),
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
                        onPress = {this.setState({directoryVisible: true})}
                    />
                </HeaderButton>
            )
        }
    }

    render() {
        if(this.state.isLoading === false) {
            return (
                <View style = {styles.container}>
                    <MapView
                        mapType = "none"
                        provider = {PROVIDER_GOOGLE}
                        style = {styles.map}
                        initialRegion = {{
                            latitude: this.state.buildingData["0"].latitude, longitude: this.state.buildingData["0"].longitude,
                            latitudeDelta: 0.001, longitudeDelta: 0.001,
                        }}
                        onPress = {() => this.deselectMarker()}>

                        <MapView.Overlay
                            bounds = {[[1.295529, 103.773580],[1.294548, 103.774318]]}
                            image = {{uri: this.state.floorplan}} />

                        {this.state.markerSelected ? 
                            <MapMarker
                                name = {this.state.roomData["0"].shortname}
                                coordinate = {{ latitude: Number(this.state.roomData["0"].latitude), longitude: Number(this.state.roomData["0"].longitude) }}
                                selected = {true} />
                        :
                            this.state.floorData.map((room, index) => (
                                <MapMarker
                                    key = {index}
                                    name = {room.shortname}
                                    coordinate = {{ latitude: Number(room.latitude), longitude: Number(room.longitude) }}
                                    onPress = {() => this.selectMarker(room.unit)} />
                            ))
                        }
                        
                    </MapView>

                    {this.state.markerSelected ?
                        <Card containerStyle = {styles.cardContainer}>
                            <Text style = {styles.cardName}> {this.state.roomData["0"].name} </Text>
                            <Text style = {styles.cardInfo}> {this.state.roomData["0"].type} · {this.state.roomData["0"].unit} </Text>
                            <Button
                                title = 'More Details'
                                onPress = {() => this.props.navigation.navigate('Details', {roomName: this.state.roomData["0"].name, selectedRoom: this.state.roomData["0"].unit})} />
                        </Card>
                    :
                        <ButtonGroup
                            containerStyle = {styles.cardContainer}
                            onPress = {this.updateFloor}
                            selectedIndex = {this.state.selectedIndex}
                            buttons = {this.state.buildingData["0"].floors} />
                    }

                    <SlidingUpPanel
                        visible = {this.state.directoryVisible}
                        onRequestClose = {() => this.setState({directoryVisible: false})} >
                        <DirectoryScreen/>
                    </SlidingUpPanel>

                </View>
            )
        }
        else return <View/>
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
