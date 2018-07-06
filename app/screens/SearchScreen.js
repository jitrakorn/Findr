import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import { SearchBar } from "react-native-elements";
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import buildingData from '../database/buildings.json'

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            data: buildingData,
        }
    }

    filterSearch(text) {
        const newData = data.filter((item) => {
            const itemData = item.name.first.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        });
        this.setState({
            text: text,
            data: newData,
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                <SearchBar
                    placeholder = 'Search...'
                    containerStyle = {{
                        backgroundColor: 'white',
                        width: '100%',
                        borderTopWidth: 0,
                        borderBottomWidth: 0
                    }}
                    inputStyle = {{
                        backgroundColor: 'white',
                        color: 'black'
                    }}
                    noIcon
                    clearIcon
                    autoFocus = {true}
                    onChangeText = {(text) => this.filterSearch(text)}
                />
            ),

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
        return (
            <View>
                {this.state.data.map((user) => (
                    <Text> {user.name} </Text>
                ))}
            </View>
        )
    }
}

