import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        var lookup = this.state.selectedBuilding;
        dataRef.orderByChild('location').startAt(lookup).endAt(lookup + '\uf8ff').once('value', (snapshot) => {
            this.setState({data: Object.values(snapshot.val())});
        })
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <ScrollView style = {{backgroundColor: '#FB8C00'}}>
                <View style = {styles.header} >
                    <Icon name = 'building' color = 'white' size = {25}/>
                    <Text style = {styles.building}> {this.state.buildingData["0"].name} </Text>
                    <Text style = {styles.school}> {this.state.buildingData["0"].school} </Text>
                    <Text style = {styles.school}> 13 Computing Drive </Text>
                </View>
                <View style = {{backgroundColor: 'white', margin: 10, borderRadius: 10, padding: 15}}>
                {this.state.data.map((room, index) => ( 
                    <TouchableOpacity 
                        key = {index}
                        onPress = {() => this.props.selectRoom(room.unit)} >
                        <Text style = {styles.name}>{room.name}</Text>
                        <Text style = {styles.detail}>{room.unit}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    header: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 175
    },

    building: {
        color: 'white',
        fontSize: 40,
        fontFamily: 'Rubik-Medium',
    },

    school: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Rubik-Regular',
    },

    name: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'Rubik-Regular',
        marginTop: 10
    },

    detail: {
        color: 'grey',
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
    }
})

