import React, {Component} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {View, Image} from 'react-native'
import MapScreen from '../components/screens/MapScreen'
import ReportHome from '../components/screens/ReportHome'
import HelpScreen from '../components/screens/HelpScreen'
import {NavButtonImage} from '../styles/DefaultStyles'
import Icon, {Ionicons}  from 'react-native-vector-icons/Ionicons';




const Tab = createBottomTabNavigator();



export default class UserNavigator extends Component{

      constructor(props) {
        super(props);
        this.state = {}
    }

    render(){
        return (
            <Tab.Navigator 
            navigationOptions = {{
      gesturesEnabled: false
    }}

                 screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'ReportHome') {
              iconName = focused
                ?  require("../../assets/images/icons/report.png")
                : require("../../assets/images/icons/report.png");
            } else if (route.name === 'MapScreen') {
              iconName = focused ? require("../../assets/images/icons/map.png") : require("../../assets/images/icons/map.png");
            }else if(route.name === "HelpScreen"){
              iconName = require("../../assets/images/icons/report.png")
            }

            // You can return any component that you like here!
            return <Image source={iconName} style={{tintColor: color, width: 25, height:25, resizeMode:'contain'}}/>
          },
        })}
      
        tabBarOptions={{
          activeTintColor: '#E12727',
          inactiveTintColor: 'gray',
          style: {
            marginTop:'-2%',
        paddingLeft:'25%',
        paddingRight:'25%',
           backgroundColor: '#f9f9f9'
          }
          
        }}
            >
                <Tab.Screen name="ReportHome" component={ReportHome} options={{ headerShown: false, tabBarLabel: 'Report' }}/>
                <Tab.Screen name="MapScreen" component={MapScreen}  options={{ headerShown: false, tabBarLabel: 'Map' }}/>
            </Tab.Navigator>
        );
    }
}
