import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firebaseApp } from '../firebase';
import AutoLink from 'react-native-autolink';

var database = firebaseApp.database();

export default class StaffScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staffData: [],
            isLoading: true,
        }
    }

    getStaffData() {
        var dataRef = database.ref('staff/')
        dataRef.orderByChild('email').equalTo(this.props.navigation.getParam('email', 'NO-DATA')).once('value', (snapshot) => {
            this.setState({staffData: Object.values(snapshot.val())});

        })
    }

    componentDidMount() {
        this.getStaffData();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.staffData !== prevState.staffData) {
            console.log(this.state.staffData);
            this.setState({isLoading: false});
        }
    }

    render() {
        if(this.state.isLoading === false) {
            return (
                <View>
                    <Text style = {styles.name}>Name</Text>
                    <Text style = {styles.field}>{this.state.staffData["0"].name}</Text>
                    <Text style = {styles.name}>Appointment</Text>
                    <Text style = {styles.field}>{this.state.staffData["0"].appointment}</Text>
                    <Text style = {styles.name}>Deparment</Text>
                    <Text style = {styles.field}>{this.state.staffData["0"].department}</Text>
                    <Text style = {styles.name}>Email</Text>
                    <AutoLink
                        text = {this.state.staffData["0"].email}
                        textStyle = {styles.field}
                        email = {true} />
                    <Text style = {styles.name}>Phone</Text>
                    <AutoLink
                        text = {'67650171'}
                        textStyle = {styles.field}
                        phone = {true} />
                </View>
            )
        }
        else return <View/>
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
