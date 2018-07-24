import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import { SearchBar } from "react-native-elements";
import HeaderButton from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firebaseApp } from '../firebase';

var database = firebaseApp.database();

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            noResults: true,
        }
    }

    filterSearch(text) {
        var dataRef = database.ref('rooms/');
        dataRef.orderByChild('name').startAt(text).endAt(text + "\uf8ff").on('value', (snapshot) => {
            this.setState({searchResults: Object.values(snapshot.val())})
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    render() {
        return (
            <View>
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

                    {this.state.searchResults.map((room, index) => (
                        <Text key = {index}> {room.name} </Text>
                    ))}

            </View>
        )
    }
}

