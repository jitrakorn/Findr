import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { firebaseApp } from '../firebase';
import moment from 'moment';
import mapStyle from '../mapStyle.json';
import MapMarker from '../components/MapMarker';
import Map from '../components/Map';

var database = firebaseApp.database();
var storage = firebaseApp.storage();

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            day: moment().format("dddd").toString(),
            time: moment().format("HHmm").toString(),
            roomData: [],
            staff: [],
            staffExists: false,
            nusModsIDExists: false,
            isLoading: true,
            availabile: false,
            floorplanBounds: [],
            floorplan: 'https://firebasestorage.googleapis.com/v0/b/findr-1526869968216.appspot.com/o/blank.png?alt=media&token=8ec2978f-8a16-4472-8000-3801c0224997',
            fullSizedMap: false,
            timetableVisible: false,
        }
    }

    getRoomData() {
        var dataRef = database.ref('rooms/');   
        dataRef.orderByChild('unit').equalTo(this.props.navigation.getParam('selectedRoom', 'NO-DATA')).once('value', (snapshot) => {
            console.log(snapshot.val())
            this.setState({roomData: Object.values(snapshot.val())});
        })
    }

    getStaff() {
        var dataRef = database.ref('staff/');
        dataRef.orderByChild('room').equalTo(this.props.navigation.getParam('selectedRoom', 'NO-DATA')).once('value', (snapshot) => {
            if(snapshot.exists()) {
                this.setState({staff: Object.values(snapshot.val())});
                this.setState({staffExists: true})
            }
        })
    }

    getTime() {
        // Real-time to Timetable time
        if(parseInt(this.state.time.substring(2,4),10) < 30) {
            this.setState({time: moment().format("HH").toString() + "00", 
            endTime: moment().format("HH").toString() + "30"})
        }
        else {
            this.setState({time: moment().format("HH").toString() + "30",
            endTime: moment().add(1, 'h').format("HH") + "00"})
        }

        // Manipulating day
        switch(this.state.day) {
            case "Monday":
                this.setState({day: 0});
                break;
            case "Tuesday":
                this.setState({day: 1});
                break; 
            case "Wednesday":
                this.setState({day: 2});
                break;
            case "Thursday":
                this.setState({day: 3});
                break;
            case "Friday":
                this.setState({day: 4});
                break;
            case "Saturday":
                this.setState({day: 5});
                break;
            case "Sunday":
                this.setState({day: 0});
                break;
        }
    }

    getTimetable() {
        var dataRef = database.ref('rooms/' + this.state.roomData["0"].unit + '/nusmodsid');
        dataRef.once('value', (snapshot) =>  {
            if(snapshot.exists()) {
                // Retrieve room details from NUSMODS
                return fetch('https://api.nusmods.com/2018-2019/1/venueInformation.json')
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        roomNow: this.state.roomData["0"].nusmodsid.toString(),
                        dataSource: responseJson,
                        nusModsIDExists: true,
                    });
                    this.getAvailability();
                });
            }
        })
    }

    getAvailability() {
        if(this.state.dataSource[this.state.roomNow][this.state.day].Availability[this.state.time] === 'vacant') {
            this.setState({availabile: true});
        }
    }

    getColor(status) {
        if(status === 'occupied') return true
        else return false
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
        this.getRoomData();
        this.getStaff();
        this.getTime();
    }

    componentDidUpdate(prevProps, prevState) {
        // After fetching building data
        if(this.state.roomData !== prevState.roomData) {
            console.log(this.state.roomData)
            this.getTimetable();
            this.getFloorplan();
        }

        if(this.state.floorplanBounds !== prevState.floorplanBounds) this.setState({isLoading: false});
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitleStyle: {
                flex: 1,
                color: 'transparent',
                elevation: 0
            },
            headerLeft: (
                <HeaderButton IconComponent = {Icon} iconSize = {23} color = "black">
                    <HeaderButton.Item 
                        title = "back"
                        iconName = "arrow-back"
                        onPress = {() => navigation.goBack()}
                    />
                </HeaderButton>
            ),
        }
    }

    render() {
        if(this.state.isLoading === false) {
            return (
                <ScrollView style = {styles.container}>
                    <View style = {styles.header} >
                        <Text style = {styles.headerTitle} >{this.state.roomData["0"].name}</Text>
                        <Text style = {styles.headerText} >{this.state.roomData["0"].type}</Text>
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
                        
                    {this.state.staffExists ?
                        <View style = {styles.card} >
                            <Text style = {styles.cardTitle}>STAFF</Text>
                            {this.state.staff.map((staff, index) => (
                                <TouchableOpacity key = {index} onPress = {() => this.props.navigation.navigate('Staff', {email: staff.email})} >
                                    <Text style = {styles.cardText}>{staff.name}</Text>
                                </TouchableOpacity>
                            ))}              
                        </View>
                    :
                        null
                    }


                    {this.state.nusModsIDExists ?
                        <View style = {styles.card} >
                            <Text style = {styles.cardTitle}>CURRENT AVAILABILITY</Text>
                            <TouchableOpacity onPress = {() => this.setState({timetableVisible: true})} >
                                {this.state.availabile ?
                                    <Text style = {[styles.cardText, {color: '#2ecc71'}]}> Available </Text>
                                :
                                    <Text style = {[styles.cardText, {color: '#e74c3c'}]}> Not Available </Text>
                                }
                            </TouchableOpacity>

                        <Modal
                            animationType = 'slide'
                            transparent = {false}
                            visible = {this.state.timetableVisible}
                            onRequestClose = {() => this.setState({timetableVisible: false})} >
                            <ScrollView style = {styles.container}>
                                <View style = {styles.header} >
                                    <Text style = {styles.headerTitle} >Availability for Today</Text>
                                </View>

                                {Object.values(this.state.dataSource[this.state.roomNow][this.state.day].Availability).map((time, index) => (
                                <View key = {index} style = {{height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 3}}>
                                    <Text style = {[styles.cardText, {width: '20%'}]}>{Object.keys(this.state.dataSource[this.state.roomNow][this.state.day].Availability)[index]}</Text>
                                    {this.getColor(time) ?
                                        <View style = {{width: '80%', height: 50, backgroundColor: '#e74c3c'}} />
                                        :
                                        <View style = {{width: '80%', height: 50, backgroundColor: '#2ecc71'}} />
                                    }
                                </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity style = {{margin: 10}} onPress = {() => this.setState({timetableVisible: false})}>
                                <Text style = {{fontSize: 18, textAlign: 'right', fontFamily: 'Rubik-Regular', color: '#e67e22'}}> CLOSE </Text>
                            </TouchableOpacity>
                        </Modal>

                        </View>
                    :
                        null
                    }


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
                    
                </ScrollView>
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
