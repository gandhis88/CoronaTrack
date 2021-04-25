import React, {Component} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import { Button, 
        Text, 
        View, 
        TouchableOpacity,
        TouchableWithoutFeedback,
        KeyboardAvoidingView,
        ScrollView,
        Image,
        Alert,
        Keyboard } from 'react-native';
import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'


import {
    BASE_URL,
    RESPONSES
} from '../../functions/helperConstants'
/*Styles*/

import {
    MainContainer,
    FlexView,
    LogoContainer,
    ButtonContainer,
    LogoImage,
    GreyText,
    TextDefault,
    SplashContent,
    ButtonPrimary,
    ButtonDarkGrey,
    ButtonBlack,
    ImageSelectorTouchable,
    ProfilePictureImage,
    ProfilePictureUploadView,
    FormGroup,
    InputTF,
    DefaultErrorText,
    LabelText,
    FooterView,
    InlineFlex,
    RadioButtonDarkGrey,
    ButtonWhite,
    ButtonTransparent,
    ModInputTF,
    FInputTF

} from '../../styles/DefaultStyles'

/*Import Components*/
import NavBarCustom from '../UI/NavBarCustom'
import NavBarStage from '../UI/NavBarStage'
import DeviceInfo from 'react-native-device-info';
 import Geolocation from '@react-native-community/geolocation';

import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';


import * as Helpers from '../../functions/helpers';
import { DateTime } from 'luxon';

export default class HelpScreen extends Component{
    constructor(props){
        super(props);
    this.state = {
        feedbackTF:"",
        successMessage: ""
    }
    this.handleTFSubmit = this.handleTFSubmit.bind(this)
    }






    async componentDidMount(){

    }

async handleTFSubmit(){
    Keyboard.dismiss()
    let {feedbackTF} = this.state
    let location = ""
    if(feedbackTF.length > 5){
        try{
        location =   await AsyncStorage.getItem("@lastUserPos");
        }catch(e){}
        let date = DateTime.local().toISO().slice(0,10)
        try{
        let res = await Helpers.getFeedback(feedbackTF, location, date);
        }catch(e){}
      
        this.setState({successMessage:"Thank you! 😀"})
    
    }

}



    render(){
            
        let {feedbackTF, successMessage} = this.state
        
        return (
            <View style={{flex : 1}}>
    
                
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1, background:'#f7f7f7' }}>
                    <MainContainer>
                         <FlexView style={{marginTop:100}}>
                           <TextDefault color={'#e12727'}>
                            {successMessage}
                        </TextDefault>
                        <GreyText>
                        The app is in its initial version.
                        </GreyText>
                        <GreyText>
                        I would highly value your suggestions and feedback.
                        </GreyText>
                        <FInputTF  keyboardType="default" 
                                        active={feedbackTF} 
                                        value={feedbackTF}
                                          multiline={true}
                                    numberOfLines={8}
                                        autoCapitalize="none"
                                        onFocus={()=>{
                                        this.setState({
                                            feedbackTF: true
                                        })
                                        }}
                                        onSubmitEditing={this.handleTFSubmit}
                                        onBlur={() =>{
                                        this.setState({
                                            feedbackTF: false
                                        })
                                        }}
                                        onChangeText={(value) =>{
                                        
                                            this.setState({
                                                feedbackTF: value
                                            })
                                    
                                }}/> 
                            </FlexView>
                        <FooterView>
                     <ButtonContainer>
                        <ButtonBlack>
                        <TextDefault color={"#fff"}>
                            SEND FEEDBACK
                        </TextDefault>
                             </ButtonBlack>
                             <ButtonTransparent>
                        <TextDefault color={"#000"}>
                         -Harman Sandhu @harryxsandhu
                        </TextDefault>
                             </ButtonTransparent>
                            </ButtonContainer>
                     </FooterView>
                    </MainContainer>
                </KeyboardAvoidingView>

            </View>
        )
        
    }

}