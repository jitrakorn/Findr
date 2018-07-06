import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import data from '../database/buildings.json';

export default class DetailsScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
            },
            title: data[navigation.getParam('building', 'NO-ID')].
                floors[navigation.getParam('floor', 'NO-ID')].
                rooms[navigation.getParam('room', 'NO-ID')].fullname,
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
        const building = this.props.navigation.getParam('building', 'NO-ID');
        const floor = this.props.navigation.getParam('floor', 'NO-ID');
        const room = this.props.navigation.getParam('room', 'NO-ID');

        return (
            <View>
                <Text style = {styles.name}>Type</Text>
                <Text style = {styles.field}>{data[building].floors[floor].rooms[room].type}</Text>
                <Text style = {styles.name}>Unit</Text>
                <Text style = {styles.field}>{data[building].floors[floor].rooms[room].unit}</Text>
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
