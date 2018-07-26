import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firebaseApp } from '../firebase';
import moment from 'moment';

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
                });
            }
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
                alignSelf: 'center',
                textAlign: 'center',
            },
            title: navigation.getParam('roomName', 'NO-NAME'),
            headerLeft: (
                <HeaderButton IconComponent = {Icon} iconSize = {23} color = "black">
                    <HeaderButton.Item 
                        title = "back"
                        iconName = "arrow-back"
                        onPress = {() => navigation.goBack()}
                    />
                </HeaderButton>
            ),
            headerRight: <View/>
        }
    }

    render() {
        return (
            <View>
            {this.state.isLoading ?
                null
            :
                <View>
                    <Text style = {styles.name}>Type</Text>
                    <Text style = {styles.field}>{this.state.roomData["0"].type}</Text>
                    <Text style = {styles.name}>Unit</Text>
                    <Text style = {styles.field}>{this.state.roomData["0"].unit}</Text>
                    {this.state.nusModsIDExists ?
                        <View>
                            <Text style = {styles.name}>Current Availability</Text>
                            <Text style = {styles.field}>
                                {this.state.dataSource[this.state.roomNow][this.state.day].Day} ({this.state.time}-{this.state.endTime}): {this.state.dataSource[this.state.roomNow][this.state.day].Availability[this.state.time]}
                            </Text>
                        </View>
                    :
                        null
                    }
                    {this.state.staffExists ?
                        <View>
                            <Text style = {styles.name}>Staff</Text>
                            {this.state.staff.map((staff, index) => (
                                <TouchableOpacity key = {index} onPress = {() => this.props.navigation.navigate('Staff', {email: staff.email})} >
                                    <Text style = {styles.field}>{staff.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    :
                        null
                    }

                </View>
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    field: {
        color: 'black',
        fontSize: 18,
    },

    name: {
        color: 'gray',
        fontSize: 12,
    }
})
