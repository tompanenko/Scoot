import React, { useState } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import { Button, View, StyleSheet, Image, TouchableOpacity, Alert, Text, FlatList, ActivityIndicator,   AppRegistry, ScrollView,Animated, AnimatedRegion, Dimensions, } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { ActionButton } from 'react-native-action-button';

class HomeScreen extends React.Component {
  state = {
     data:'',
     show: true,
     location:[0,0]
}

render(){
  return (
    <View>
      <Text>
        {'abc'}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
        }}
        onPressIn={async () => {
          let { status } = await Permissions.askAsync(Permissions.LOCATION);
          if (status === 'granted') {    
           let location = await Location.getCurrentPositionAsync({});
           
           this.setState({ location });  
            }
          const limeResponse = await fetch('https://data.lime.bike/api/partners/v1/gbfs/los_angeles/free_bike_status')
          const limeData = await limeResponse.json()
          const limeFeeds = limeData.data.bikes
          const limeLocations = limeFeeds.filter((f, i) => i < 2).map(({ bike_id, lat, lon }) => ({ id: bike_id, lat, lon }))

          this.setState({data:JSON.stringify(limeLocations)})
          this.props.navigation.navigate('Scoot', { limeLocations })
          // setShow(false)
        }}
        style={styles.MenuStyle}>
        {
          this.state.show &&
          <Image
            source={{
              uri: 'https://www.razor.com/wp-content/uploads/2018/01/A_CL_Product.png',
            }}
            style={{
              top: 140,
              height: 250,
              width: 300,
              resizeMode: 'contain'
            }}
          />
        }
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={async () => {
          // navigate('Search', { name: 'Jane' })
          // setShow(!show)
        }}
        style={styles.MenuStyle}>
        <Image
          source={{
            uri: 'https://live.staticflickr.com/4909/44167523590_2327f8547c_b.jpg',
          }}
          style={{
            height: 400,
            width: 370,
            top: 400,
            resizeMode: 'contain'
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
}
HomeScreen.navigationOptions = {
  title: 'Welcome',
};

const ScootScreen = ({ navigation }) => {
  const clickHandler = async () => {
    Alert.alert('Floating Button Clicked');
  }

  const { navigate } = navigation;
  const limeLocations = navigation.getParam('limeLocations', [])
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      <MapView style={{ flex: 1 }}
      initialRegion = {{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05
      }}
      >
        
        {limeLocations.map(({ id, lat, lon }) => <Marker key={id} coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lon) }} />)}
      </MapView>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={clickHandler}
        style={styles.TouchableOpacityStyle}>
        <Image
          source={{
            uri: 'http://aboutreact.com/wp-content/uploads/2018/08/bc72de57b000a7037294b53d34c2cbd1.png',
          }}
          style={styles.FloatingButtonStyle}
        />
      </TouchableOpacity>
    </View>
  );
}

const SearchScreen = ({ navigation }) => {
  const { navigate } = navigation;

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <FlatList
        data={this.state.dataSource}
        renderItem={({ item }) => <Text>{item.title}, {item.releaseYear}</Text>}
        keyExtractor={({ id }, index) => id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  MenuStyle: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',


  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Scoot: { screen: ScootScreen },
  Search: { screen: SearchScreen }
});

const App = createAppContainer(MainNavigator);

export default App;
