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
        SafeAreaView,
        Image } from 'react-native';
 

import ImagePicker from 'react-native-image-crop-picker';

import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// import AccountInfo from '../forms/AccountInfo'

import SignUpForm from '../forms/SignUpForm'

import {
    BASE_URL,
    RESPONSES
} from '../../functions/helperConstants'
import Geolocation from '@react-native-community/geolocation';

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

} from '../../styles/DefaultStyles'

import { checkEmailAddress, checkName, checkPhone } from "../../functions/helpers";
import Icon, { Ionicons  } from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

/*Import Components*/
import NavBarStage from '../UI/NavBarStage'

import * as Helpers from '../../functions/helpers';



export default class SignUp extends Component{
    constructor(props) {
        super(props);
        this.state ={
            viewTitle:"",
            d_id: "",
            u_id: "",
            ageTF: "",
            ageTFActive:false,
            gender: 0,
            locationIsAllowed: false,
            currentLocation: {},
            error : {
                errorMessage : null,
                errorStatus: null,
                errorCode: null
            },
            authToken:"",
            alreadyRequested:false,
            loggedIn:false,
            isLoading: true,
            step: 0,
            buttonActive: 0
        }

        //this.handleSelectImage = this.handleSelectImage.bind(this)
        this.changeState = this.changeState.bind(this)
        this.controlBack = this.controlBack.bind(this)
        this.goToUser = this.goToUser.bind(this)
    }

    async componentDidMount(){
        //check if user with this device id exists
          let d_id = DeviceInfo.getUniqueId();
          console.log("fuucker: ", d_id)
          try{
            let checkUserRes = await Helpers.checkIfUserExists(d_id)
            console.log("checkUserRes: ", checkUserRes)
            if(checkUserRes.success){
            console.log(d_id)
            await AsyncStorage.setItem("@authToken", checkUserRes.authToken)
            this.setState({authToken: checkUserRes.authToken, loggedIn:true,isLoading:false})
            }
            this.setState({isLoading:false})
          }catch(e){
              console.log("error at component Signup: ", e)
              this.setState({isLoading:false})
          }
    }

    changeState(obj){
        let oldState = this.state
            for(var key in obj){
                if(oldState.hasOwnProperty(key)){
                    oldState[key] = obj[key];
                    this.setState(oldState);
                }
            }
    }
    goToUser(){
        this.props.navigation.navigate('UserNavigator')
    }

   
    controlBack(){
        this.props.navigation.goBack()
    }

    render(){
        
        let {step, loggedIn, authToken, isLoading} = this.state
        console.log("STEP: ", step)
        console.log(this.props)
       
        if(isLoading){
            return (
                 <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                
                    <MainContainer>
                        <FlexView style={{marginTop:200}}>
                        <TextDefault size={'30px'}>⏳</TextDefault>

                        </FlexView>
                    </MainContainer>
                 </SafeAreaView>
            )
        }
        else if(loggedIn && !isLoading){
            this.goToUser()
            return (<></>)
        }else{

 //<BizAccountStep1 changeState={this.changeState} state={this.state} nextStep={this.handleNextStep} />
        return (
            <SignUpForm changeState={this.changeState} state={this.state} controlBack={this.controlBack} />
        )
    }
    }
    
}  