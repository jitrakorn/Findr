import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class DetailsScreen extends React.Component {
    render() {
        return (
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style = {styles.boldText}>DEVELOPED BY</Text>
                <Text style = {styles.text}>Terence "DetailsScreen.js" Tay</Text>
                <Text style = {styles.text}>Jitrakorn "SearchScreen.js" Tan</Text>

                <Text style = {styles.boldText}>DEVELOPED USING</Text>
                <Text style = {styles.text}>React Native</Text>
                
                <Text style = {styles.boldText}>REPO AVAILABLE AT</Text>
                <Text style = {styles.text}>github.com/jitrakorn/Findr</Text>
            </View>


        )
    }
}

const styles = StyleSheet.create({
    boldText: {
        color: '#e67e22',
        fontFamily: 'Rubik-Medium',
        fontSize: 18,
        marginTop: 20
    },
    text: {
        fontFamily: 'Rubik-Light',
        fontSize: 25,
    }
})
