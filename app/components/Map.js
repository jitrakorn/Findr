import React from 'react';
import { View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import mapStyle from '../mapStyle.json';
import MapMarker from '../components/MapMarker';

export default class Map extends React.Component {
    render() {
        return (
            <MapView
                customMapStyle = {mapStyle}
                provider = {PROVIDER_GOOGLE}
                style = {this.props.style}
                onPress = {this.props.onPress}
                scrollEnabled = {this.props.fullSize}
                zoomEnabled = {this.props.fullSize}
                rotateEnabled = {this.props.fullSize}
                initialRegion = {{
                    latitude: this.props.roomLatitude, longitude: this.props.roomLongitude,
                    latitudeDelta: 0.001, longitudeDelta: 0.001
                }} >

                <MapView.Overlay
                    bounds = {this.props.bounds}
                    image = {this.props.floorplan} />

                <MapMarker
                    name = {this.props.shortname}
                    coordinate = {{ latitude: Number(this.props.roomLatitude), longitude: Number(this.props.roomLongitude) }}
                    selected = {true} />
            </MapView>
        )
    }
}