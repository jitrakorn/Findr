import React from 'react';
import { 
    Animated,
    Dimensions,
    StyleSheet, 
    View,
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

const {height} = Dimensions.get('window')

export default class BottomPanel extends React.Component {
    static defaultProps = {
        draggableRange: {
            top: height / 1.75,
            bottom: 120
        }
    }

    getSelectedIndex() {
        buildingData["0"].floors.map((floor, index) => {
            if(selectedFloor === floor) this.setState({selectedIndex: index});
        })
    }

    _draggedValue = new Animated.Value(-120);

    render() {
        return (
            <View>
                <SlidingUpPanel
                    visible
                    startCollapsed
                    showBackdrop = {false}
                    onDrag = {v => this._draggedValue.setValue(v)}>
                </SlidingUpPanel>
            </View>
        )
    }
}

const styles = StyleSheet.create({


})