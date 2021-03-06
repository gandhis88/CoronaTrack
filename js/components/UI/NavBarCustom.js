
import React, {Component} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'


import { Button, 
        Text, 
        View, 
        TouchableOpacity,
        TouchableWithoutFeedback,
        Image } from 'react-native';
 
import {
    MainContainer,
    LogoContainer,
    ButtonContainer,
    LogoImage,
    GreyText,
    TextDefault,
    SplashContent,
    ButtonPrimary,
    ButtonDarkGrey,
    ButtonBlack,
    NavbarDefault,
    NavButton,
    NavTitle,
    NavButtonImage,
    NavTitleView,
    NavSub
} from '../../styles/DefaultStyles'


export default class NavBarCustom extends Component{

    constructor(props) {
        super(props);
    }

    render(){
        return (
             <NavbarDefault>
                    <NavButton onPress={() =>{this.props.backAction()}}>
                        <NavButtonImage size='20px' source={require('../../../assets/images/icons/backBlack.png')} />
                    </NavButton>
                    <NavTitleView>
                        <NavTitle>
                          {this.props.title}
                        </NavTitle>
                        {/* <NavSub>
                        USING EMAIL ADDRESS
                        </NavSub> */}
                    </NavTitleView>    
                      
                </NavbarDefault>
        );
    }
    
}