import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firebaseApp } from '../firebase';
import AutoLink from 'react-native-autolink';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import mapStyle from '../mapStyle.json';
import MapMarker from '../components/MapMarker';
import Map from '../components/Map';

var database = firebaseApp.database();
var storage = firebaseApp.storage();

export default class StaffScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomData: [],
            staffData: [],
            isLoading: true,
            floorplanBounds: [],
            floorplan: 'https://firebasestorage.googleapis.com/v0/b/findr-1526869968216.appspot.com/o/blank.png?alt=media&token=8ec2978f-8a16-4472-8000-3801c0224997',
            fullSizedMap: false
        }
    }

    getStaffData() {
        var dataRef = database.ref('staff/')
        dataRef.orderByChild('email').equalTo(this.props.navigation.getParam('email', 'NO-DATA')).once('value', (snapshot) => {
            this.setState({staffData: Object.values(snapshot.val())});

        })
    }

    getRoomData() {
        var dataRef = database.ref('rooms/');   
        dataRef.orderByChild('unit').equalTo(this.state.staffData["0"].room).once('value', (snapshot) => {
            this.setState({roomData: Object.values(snapshot.val())});
        })
    }

    getFloorplan() {
        var dataRef = database.ref('buildings/' + this.state.roomData["0"].location.split('-')[0] + '/bounds');
        dataRef.once('value', (snapshot) => {
            this.setState({floorplanBounds: snapshot.val()})
        })

        var storageRef = storage.ref(this.state.roomData["0"].location.split('-')[0] + '/' + this.state.roomData["0"].location.split('-')[1] + '.png');
        storageRef.getDownloadURL().then((url) => {
            this.setState({floorplan: url});
        })
    }

    componentDidMount() {
        this.getStaffData();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.staffData !== prevState.staffData) this.getRoomData();
        if(this.state.roomData !== prevState.roomData) this.getFloorplan();
        if(this.state.floorplan !== prevState.floorplan) {
            this.setState({isLoading: false});
        }
    }

    render() {
        if(this.state.isLoading === false) {
            return (
                <View style = {styles.container}>
                    <ScrollView>
                        <View style = {styles.header} >
                            <Text style = {styles.headerTitle} >{this.state.staffData["0"].name}</Text>
                            <Text style = {styles.headerText} >{this.state.staffData["0"].appointment}</Text>
                            <Text style = {styles.headerText} >{this.state.staffData["0"].department}</Text>
                        </View>

                        <View style = {styles.card} >
                            <Text style = {styles.cardTitle}>CONTACT</Text>
                            <Text style = {styles.cardTextBold}>Email</Text>
                            <Text style = {styles.cardText}>{this.state.staffData["0"].email}</Text>
                            <Text style = {styles.cardTextBold}>Phone</Text>
                            <Text style = {styles.cardText}>{this.state.staffData["0"].phone}</Text>
                        </View>

                        <View style = {styles.card} >
                            <Text style = {styles.cardTitle}>LOCATION</Text>
                            <View style = {{flex: 1, flexDirection: 'row'}} >
                                <View style = {{flex: 1, flexDirection: 'column'}} >
                                    <Text style = {styles.cardTextBold}>Unit</Text>
                                    <Text style = {styles.cardText}>{this.state.roomData["0"].unit}</Text>
                                </View>
                                <View style = {{flex: 1, flexDirection: 'column'}} >
                                    <Text style = {styles.cardTextBold}>Building</Text>
                                    <Text style = {styles.cardText}>{this.state.roomData["0"].location.split('-')[0]}</Text>
                                </View>
                                <View style = {{flex: 1, flexDirection: 'column'}} >
                                    <Text style = {styles.cardTextBold}>Floor</Text>
                                    <Text style = {styles.cardText}>{this.state.roomData["0"].location.split('-')[1]}</Text>
                                </View>
                            </View>

                            <Map
                                style = {styles.map}
                                fullSize = {false}
                                onPress = {() => this.setState({fullSizedMap: true})}
                                roomLatitude = {this.state.roomData["0"].latitude}
                                roomLongitude = {this.state.roomData["0"].longitude}
                                bounds = {this.state.floorplanBounds}
                                floorplan = {this.state.floorplan}
                                shortname = {this.state.roomData["0"].shortname}
                            />
                        </View>
                    </ScrollView>

                    <Modal
                        animationType = 'slide'
                        transparent = {false}
                        visible = {this.state.fullSizedMap}
                        onRequestClose = {() => this.setState({fullSizedMap: false})} >
                            <Map
                                style = {styles.fullSizedMap}
                                fullSize = {true}
                                roomLatitude = {this.state.roomData["0"].latitude}
                                roomLongitude = {this.state.roomData["0"].longitude}
                                bounds = {this.state.floorplanBounds}
                                floorplan = {this.state.floorplan}
                                shortname = {this.state.roomData["0"].shortname}
                            />
                            <TouchableOpacity style = {{margin: 10}} onPress = {() => this.setState({fullSizedMap: false})}>
                                <Text style = {{fontSize: 18, textAlign: 'right', fontFamily: 'Rubik-Regular', color: '#e67e22'}}> CLOSE </Text>
                            </TouchableOpacity>
                    </Modal>
                </View>
            )
        }
        else return <View/>
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },

    header: {
        alignItems: 'flex-start',
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 15,
        paddingRight: 15,        
    },

    headerTitle: {
        color: 'black',
        fontSize: 25,
        fontFamily: 'Rubik-Medium',
    },

    headerText: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'Rubik-Light'
    },

    card: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5
    },

    cardTitle: {
        color: '#e67e22',
        fontSize: 16,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        marginBottom: 10
    },
    
    cardTextBold: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center'
    },

    cardText: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Rubik-Light',
        textAlign: 'center',
        marginBottom: 10
    },

    map: {
        height: 150,
    },

    fullSizedMap: {
        ...StyleSheet.absoluteFillObject,
    }
})