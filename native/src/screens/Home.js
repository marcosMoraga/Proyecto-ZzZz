import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text} from 'react-native';


const Stack = createStackNavigator();


const Home = ({ navigation }) => {
    return (
        <View>
           <Text>Holaaa</Text>
           
        </View>
    )
};


export default Home
