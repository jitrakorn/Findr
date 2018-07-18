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
import { firebaseApp } from '../firebase';

var database = firebaseApp.database();

export default class DirectoryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    getData() {
        var dataRef = database.ref('rooms/');
        var lookup = this.props.navigation.getParam('selectedBuilding', 'NO-NAME')
        dataRef.orderByChild('location').startAt(lookup).endAt(lookup + '\uf8ff').once('value', (snapshot) => {
            this.setState({data: Object.values(snapshot.val())});
        })
    }

    getFloor(location) {
        var locationSplit = location.split('-')
        console.log(locationSplit[1])
        return locationSplit[1];
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center'
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
            headerRight: <View />
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <ScrollView>
                {this.state.data.map((room, index) => ( 
                    <TouchableOpacity 
                        key = {index}
                        onPress = {() => this.props.navigation.push('BuildingMap', {
                            selectedFloor: this.getFloor(room.location),
                            selectedRoom: room.unit,
                            selectedBuilding: this.props.navigation.getParam('selectedBuilding', 'NO-NAME'),
                            selected: true,
                        })}
                    >
                        <Text style = {styles.name}>{room.name}</Text>
                        <Text style = {styles.detail}>{room.unit}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        padding: 5,
        height: 50,
    },

    name: {
        color: 'black',
        fontSize: 18,
    },

    detail: {
        color: 'gray',
        fontSize: 12,
    }
})

