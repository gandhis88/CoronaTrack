import React, {Component} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import { 
        SafeAreaView, StyleSheet } from 'react-native';
 
import { Divider, Icon, Layout, Button, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';


/*Styles*/


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
    ButtonTransparent,
    FlexView
   
} from '../../styles/DefaultStyles'


const PR_COLOR = '#0037FB';
 

export default class Splash extends Component{


    constructor(props){
        super(props);

        //from the Component
        this.state = {}

    }

   

    async componentDidMount(){
        //check if asynstorage is set
        let authToken = await AsyncStorage.getItem("@authtoken")
        if(authToken != null && authToken.length > 20){
             console.log("authToken at splash: ", d)
             this.props.navigation.navigate('UserNavigator')
        }
    }

    render(){
        
        return (
           <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            
                <MainContainer>
                 <FlexView style={{marginTop:200}}>
                 <LogoContainer>
                    <LogoImage source={require('../../../assets/images/logos/ctlogo.png')} />
                </LogoContainer>
                 </FlexView>
               <FlexView style={{marginTop:-350}}>
                    <GreyText align={'center'}>
                        CoronaTrack is an attempt to help people and authorities keep track of the COVID-19.
                    </GreyText>
                    <GreyText align={'center'} size={'15px'} style={{paddingTop:40}}>
                    Its completely anonymous, so please report your health everyday and help other humans.
                    </GreyText>
                </FlexView>
                <ButtonContainer>
                   
                    <ButtonPrimary onPress={() =>{ this.props.navigation.push('SignUp')}}>
                        <TextDefault color={'#fff'}>CONTINUE</TextDefault>
                    </ButtonPrimary>
                    
                </ButtonContainer>
                </MainContainer>
           </SafeAreaView>
        );
    }
}