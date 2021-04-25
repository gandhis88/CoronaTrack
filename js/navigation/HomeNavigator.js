import React, {Component} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';


import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../components/screens/Splash'
import SignUp from '../components/screens/SignUp'
import ReportHome from '../components/screens/ReportHome'
import UserNavigator from './UserNavigator'
const Stack = createStackNavigator();


export default class HomeNavigator extends Component{

      constructor(props) {
        super(props);
        this.state = {}
    }

    render(){
        return (
            <Stack.Navigator initialRouteName="Splash" gesturesEnabled={false} navigationOptions = {{
      gesturesEnabled: false
    }} >
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, gesturesEnabled: false }}/>
                <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false, gesturesEnabled: false }}/>
                <Stack.Screen name="UserNavigator" component={UserNavigator} options={{ headerShown: false, gesturesEnabled: false }}/>

            </Stack.Navigator>
        );
    }
}