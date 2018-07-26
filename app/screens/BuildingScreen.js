import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import HeaderButton from 'react-navigation-header-buttons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapMarker from '../components/MapMarker';
import { firebaseApp } from '../firebase';
import DirectoryScreen from './DirectoryScreen';
import mapStyle from '../mapStyle.json';

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
            directoryData: [],
            floorplan: 'https://firebasestorage.googleapis.com/v0/b/findr-1526869968216.appspot.com/o/blank.png?alt=media&token=8ec2978f-8a16-4472-8000-3801c0224997',
            isLoading: true,
            modalVisible: false
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

        var storageRef = storage.ref(this.state.selectedBuilding + '/' + this.state.selectedFloor + '.png');
        storageRef.getDownloadURL().then((url) => {
            this.setState({floorplan: url});
        })
    }

    getSelectedIndex() {
        this.state.buildingData["0"].floors.map((floor, index) => {
            if(this.state.selectedFloor === floor) this.setState({selectedIndex: index})
        })
    }

    openDirectory() {
        var dataRef = database.ref('rooms/');
        var lookup = this.state.selectedBuilding;
        dataRef.orderByChild('location').startAt(lookup).endAt(lookup + '\uf8ff').once('value', (snapshot) => {
            this.setState({directoryData: Object.values(snapshot.val())});
        })
        this.setState({modalVisible: true});
    }

    selectMarker(unit) {
        var roomRef = database.ref('rooms/');
        roomRef.orderByChild('unit').equalTo(unit).once('value', (snapshot) => {
            this.setState({roomData: Object.values(snapshot.val())});
        });
    }

    selectRoom(location, unit) {
        this.setState({selectedFloor: location.split('-')[1]});
        this.setState({modalVisible: false});
        this.selectMarker(unit);
    }

    deselectMarker() {
        this.setState({markerSelected: false})
    }

    updateFloor(selectedIndex) {
        this.setState({selectedFloor: this.state.buildingData["0"].floors[selectedIndex]});
        this.setState({selectedIndex: selectedIndex});
    }
        
    componentDidMount() {
        this.getBuildingData();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.buildingData !== prevState.buildingData) {
            this.getSelectedIndex();
            this.getFloorData();
        }
        if(this.state.floorData !== prevState.floorData) this.setState({isLoading: false});
        if(this.state.selectedFloor !== prevState.selectedFloor) {
            console.log(this.state.selectedFloor)
            this.getFloorData();
            this.getSelectedIndex();
        }
        if(this.state.roomData !== prevState.roomData) this.setState({markerSelected: true});
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <HeaderButton IconComponent = {Icon} iconSize = {23} color = "black">
                    <HeaderButton.Item 
                        title = "back"
                        iconName = "arrow-back"
                        onPress = {() => navigation.goBack()} />
                </HeaderButton>
            )
        }
    }

    render() {
        if(this.state.isLoading === false) {
            return (
                <View style = {styles.container}>
                    <MapView
                    customMapStyle = {mapStyle}
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
                        <View style = {{flex: 1, width: '100%'}}>
                            <TouchableOpacity onPress = {() => this.deselectMarker()}>
                                <View style = {[styles.button, {alignSelf: 'center', margin: 10}]} >
                                    <Text style = {styles.buttonText} > FULL MAP </Text>
                                </View>
                            </TouchableOpacity>
                            <View style = {styles.bottomPanel}>

                                <Text style = {styles.panelName}> {this.state.roomData["0"].name} </Text>
                                <Text style = {styles.panelInfo}> {this.state.roomData["0"].type} · {this.state.roomData["0"].unit} </Text>
                                <TouchableOpacity onPress = {() => this.props.navigation.navigate('Details', {roomName: this.state.roomData["0"].name, selectedRoom: this.state.roomData["0"].unit})} >
                                    <View style = {styles.button} >
                                        <Text style = {styles.buttonText} > DETAILS </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    :

                            <View style = {styles.bottomPanel}>
                                <Text style = {styles.panelName}> {this.state.buildingData["0"].name} </Text>

                                <View style = {{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style = {{fontFamily: 'Nunito-Regular'}}> FLOOR: </Text>
                                    <ButtonGroup
                                        onPress = {this.updateFloor}
                                        selectedIndex = {this.state.selectedIndex}
                                        buttons = {this.state.buildingData["0"].floors}
                                        containerStyle = {{backgroundColor: 'transparent', borderWidth: 0}}
                                        textStyle = {{color: 'grey', fontSize: 12, fontFamily: 'Rubik-Regular'}}
                                        innerBorderStyle = {{color: 'transparent'}}
                                        buttonStyle = {{padding: 10, width: 50}}
                                        selectedTextStyle = {{color: 'magenta', fontFamily: 'Rubik-Medium'}} />
                                </View>
                                
                                <TouchableOpacity onPress = {() => this.openDirectory()}>
                                    <View style = {styles.button} >
                                        <Text style = {styles.buttonText} > DIRECTORY </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }

                    <Modal
                        animationType = 'slide'
                        transparent = {false}
                        visible = {this.state.modalVisible}
                        onRequestClose = {() => this.setState({modalVisible: false})} >
                            <View style = {{backgroundColor: '#FB8C00', flex: 1}}>
                                <ScrollView>
                                    <View style = {styles.directoryHeader} >
                                        <Text style = {styles.directoryHeaderTitle}> {this.state.buildingData["0"].name} </Text>
                                        <View style = {{flex: 1, flexDirection: 'row'}} >
                                            <Icon name = 'school' color = 'white' size = {15}/>
                                            <Text style = {styles.directoryHeaderInfo}> {this.state.buildingData["0"].school} </Text>
                                        </View>
                                        <View style = {{flex: 1, flexDirection: 'row'}} >
                                            <Icon name = 'room' color = 'white' size = {15} />
                                            <Text style = {styles.directoryHeaderInfo}> {this.state.buildingData["0"].address} </Text>
                                        </View>
                                    </View>
                                    <View style = {{backgroundColor: 'white', margin: 10, borderRadius: 10, padding: 15}}>
                                        {this.state.directoryData.map((room, index) => ( 
                                            <TouchableOpacity key = {index} onPress = {() => this.selectRoom(room.location, room.unit)} >
                                                <Text style = {styles.directoryRoomName}>{room.name}</Text>
                                                <Text style = {styles.directoryRoomInfo}>{room.unit}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                                <TouchableOpacity style = {{margin: 10}} onPress = {() => this.setState({modalVisible: false})}>
                                    <Text style = {{fontSize: 18, textAlign: 'right', fontFamily: 'Rubik-Regular', color: 'white'}}> CLOSE </Text>
                                </TouchableOpacity>
                            </View>
                    </Modal>
                </View>
            )
        }
        else return <View/>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomPanel: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        borderRadius: 10,
        elevation: 3,
        flex: 1,
        flexDirection: 'column',
        padding: 15
    },

    button: {
        backgroundColor: 'magenta',
        borderRadius: 30,
        padding: 12,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        fontFamily: 'Rubik-Regular'
    },

    panelName: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Rubik-Medium'
    },

    panelInfo: {
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Rubik-Regular'
    },

    panelTitle: {
        color: 'grey',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    directoryHeader: {
        alignItems: 'center',
        margin: 40
    },

    directoryHeaderTitle: {
        color: 'white',
        fontSize: 40,
        fontFamily: 'Rubik-Medium',
    },

    directoryHeaderInfo: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Rubik-Regular',
    },

    directoryRoomName: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'Rubik-Regular',
        marginTop: 10
    },

    directoryRoomInfo: {
        color: 'grey',
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
})
