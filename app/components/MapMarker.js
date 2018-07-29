import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
} from 'react-native';
import { Marker } from 'react-native-maps';

class MapMarker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false,
            name: 'name',
        }
    }

    selected() {
        this.setState({selected: true});
    }

    componentDidMount() {
        if(this.props.selected === true) this.setState({selected: true})
    }
    
    render() {
        return (
            <Marker
                coordinate = {this.props.coordinate}
                onPress = {[() => this.selected()] && this.props.onPress}
            >
                <View style = {styles.container}>
                    <View style = {[styles.bubble, this.state.selected ? {borderColor: '#e67e22'} : {borderColor: 'gray'}]}>
                        <Text style = {styles.name}> {this.props.name} </Text>
                    </View>
                    <View style = {[styles.arrow, this.state.selected ? {borderTopColor: '#e67e22'} : {borderTopColor: 'gray'}]} />
                </View>
            </Marker>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: -7,
    },
    bubble: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 2,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 7,
        paddingRight: 7,
    },
    name: {
        color: 'black',
        fontSize: 10,
        fontFamily: 'Rubik-Regular'
    },
    arrow: {
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 7,
        bottom: 2
    },
})

export default MapMarker;