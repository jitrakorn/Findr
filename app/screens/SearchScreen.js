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
            search: [],
            searchTerm: '',
            noResults: true,
            filteredSearch: ['hi']
        }
    }

    filterSearch(text) {
        var dataRef = database.ref('rooms/');
        dataRef.once('value', (snapshot) => {
            this.setState({search: Object.values(snapshot.val())})
            this.setState({noResults: false});
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    searchUpdated(term) {
        this.setState({searchTerm: term})
    }

    render() {
        filteredSearch = this.state.search.filter((item) => item.name === this.state.searchTerm);
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

                    {this.state.filteredSearch.map((room, index) => (
                        <Text key = {index}> {room.name} </Text>
                    ))}

            </View>
        )
    }
}

