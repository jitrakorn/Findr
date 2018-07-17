import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firebaseApp } from '../firebase';

var database = firebaseApp.database();

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomData: [],
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

    componentDidMount() {
        this.getRoomData();
    }

    componentDidUpdate(prevProps, prevState) {
        // After fetching building data
        if(this.state.roomData !== prevState.roomData) this.setState({isLoading: false});
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
