import React from 'react';
import {
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

var database = firebaseApp.database();

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
            floorplan: 'https://firebasestorage.googleapis.com/v0/b/findr-1526869968216.appspot.com/o/blank.png?alt=media&token=8ec2978f-8a16-4472-8000-3801c0224997',
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

    getFloorPlan() {
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
            this.setState({isLoading: false});
        }
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
                <View style = {styles.container}>

                    <ScrollView>
                        <View style = {styles.header} >
                            <Text style = {styles.headerTitle} > {this.state.roomData["0"].name} </Text>
                            <Text style = {styles.headerText} > {this.state.roomData["0"].type} </Text>
                        </View>

                        <View style = {styles.card} >
                            <Text style = {styles.cardTitle}>Location</Text>
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

                            <MapView
                                customMapStyle = {mapStyle}
                                provider = {PROVIDER_GOOGLE}
                                style = {styles.map}
                                scrollEnabled = {false}
                                initialRegion = {{
                                    latitude: this.state.roomData["0"].latitude, longitude: this.state.roomData["0"].longitude,
                                    latitudeDelta: 0.001, longitudeDelta: 0.001
                                }} >

                                <MapView.Overlay
                                    bounds = {[[1.295529, 103.773580],[1.294548, 103.774318]]}
                                    image = {{uri: this.state.floorplan}} />
                            
                            </MapView>
                        </View>
                            
                        {this.state.staffExists ?
                            <View style = {styles.card} >
                                <Text style = {styles.cardTitle}>Staff</Text>
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
                                <Text style = {styles.cardTitle}>Availability</Text>
                                {this.state.availabile ?
                                    <Text style = {[styles.cardText, {color: 'green'}]}> Available </Text>
                                :
                                    <Text style = {[styles.cardText, {color: 'red'}]}> Not Available </Text>
                                }
                            </View>
                        :
                            null
                        }

                    </ScrollView>
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
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 15,
        marginRight: 15,        
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
        color: 'magenta',
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center'
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
        textAlign: 'center'
    },

    map: {
        height: 150,
        marginTop: 20
    }
})
