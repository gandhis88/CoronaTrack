import React, {Component} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';



import { NavigationContainer } from '@react-navigation/native';

import HomeNavigator from './HomeNavigator'
import UserNavigator from './UserNavigator'

export default class AppNavigator extends Component{
     constructor(props) {
        super(props);
        this.state = {}
    }


    render(){
        //all the navigation go here...
        return (
            <NavigationContainer>
            
                <HomeNavigator />
                
            </NavigationContainer>
        )
    }
}