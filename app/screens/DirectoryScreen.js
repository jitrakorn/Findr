import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import data from '../database/buildings.json';

export default class DirectoryScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center'
            },
            title: data[navigation.getParam('index', 'NO-ID')].name,
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

    render() {
        const index = this.props.navigation.getParam('index', 'NO-ID');

        return (
            <FlatList
                data = {data[index].floors}
                renderItem = {({item}) =>
                    <FlatList
                        data = {item.rooms}
                        renderItem = {({item}) => 
                            <TouchableOpacity style = {styles.button}>
                                <Text
                                    style = {styles.name}
                                    numberOfLines = {1} 
                                >
                                    {item.fullname}
                                </Text>
                                <Text style = {styles.detail}> {item.unit}</Text>
                            </TouchableOpacity>
                        }
                    />
                }
            />
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

