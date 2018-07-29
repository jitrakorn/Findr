import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SearchBar } from "react-native-elements";
import HeaderButton from 'react-navigation-header-buttons';
import { Icon } from 'react-native-elements';
import { firebaseApp } from '../firebase';
import { createFilter } from 'react-native-search-filter';

var database = firebaseApp.database();

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buildingData: [],
            roomData: [],
            staffData: [],
            searchTerm: '',
        }
    }

    getData() {
        buildingData = firebaseApp.database().ref('buildings/');
        buildingData.once('value', (snapshot) => {
            this.setState({buildingData: Object.values(snapshot.val())})
        })

        roomData = firebaseApp.database().ref('rooms/');
        roomData.once('value', (snapshot) => {
            this.setState({roomData: Object.values(snapshot.val())})
        })

        staffData = firebaseApp.database().ref('staff/');
        staffData.once('value', (snapshot) => {
            this.setState({staffData: Object.values(snapshot.val())})
        })
    }

    searchUpdated(term) {
        this.setState({searchTerm: term})
    }

    componentDidMount() {
        this.getData();
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        }
    }

    render() {
        const filteredBuildings = this.state.buildingData.filter(createFilter(this.state.searchTerm, 'name'))
        const filteredRooms = this.state.roomData.filter(createFilter(this.state.searchTerm, 'name'))
        const filteredStaff = this.state.staffData.filter(createFilter(this.state.searchTerm, 'name'))

        return (
            <View>
                <SearchBar
                    containerStyle = {styles.searchContainer}
                    inputStyle = {styles.searchInput}
                    placeholder = 'Search...'
                    noIcon
                    clearIcon
                    autoFocus = {true}
                    onChangeText = {(text) => this.searchUpdated(text)} />

                <ScrollView>
                    {filteredBuildings.map((building, index) => (
                        <TouchableOpacity
                            key = {index}
                            style = {styles.searchResult} 
                            onPress = {() => this.props.navigation.navigate('BuildingMap', {
                                selectedBuilding: building.name,
                                selectedFloor: '01',
                            })} >
                            <Icon name = 'building' type = 'font-awesome' />
                            <View style = {{flex: 1, flexDirection: 'column'}} >
                                <Text style = {styles.searchResultText} > {building.name} </Text>
                                <Text style = {styles.searchResultSubText} > {building.school} </Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {filteredRooms.map((room, index) => (
                        <TouchableOpacity 
                            key = {index} 
                            style = {styles.searchResult} 
                            onPress = {() => this.props.navigation.navigate('Details', {
                                roomName: room.name,
                                selectedRoom: room.unit
                            })} >
                            <Icon name = 'door' type = 'material-community' />
                            <View style = {{flex: 1, flexDirection: 'column'}} >
                                <Text key = {index} style = {styles.searchResultText} > {room.name} </Text>
                                <Text style = {styles.searchResultSubText} > {room.unit} </Text>
                            </View>
                        </TouchableOpacity>                          
                    ))}

                    {filteredStaff.map((staff, index) => (
                        <TouchableOpacity 
                            key = {index} 
                            style = {styles.searchResult} 
                            onPress = {() => this.props.navigation.navigate('Staff', {
                                email: staff.email
                            })} >
                            <Icon name = 'face' type = 'material-community' />
                            <View style = {{flex: 1, flexDirection: 'column'}} >
                                <Text key = {index} style = {styles.searchResultText} > {staff.name} </Text>
                                <Text style = {styles.searchResultSubText} > {staff.room} </Text>
                            </View>
                        </TouchableOpacity>  
                    ))}
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchInput: {
        backgroundColor: 'white',
        color: 'black',
    },
    searchResult: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchResultText: {
        fontFamily: 'Rubik-Medium',
        fontSize: 18,
    },
    searchResultSubText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 12,
    }
})

