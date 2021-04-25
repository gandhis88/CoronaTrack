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
        Alert } from 'react-native';
import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Geolocation from '@react-native-community/geolocation';



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
    RadioButtonDarkGrey

} from '../../styles/DefaultStyles'

/*Import Components*/
import NavBarCustom from '../UI/NavBarCustom'
import NavBarStage from '../UI/NavBarStage'
import DeviceInfo from 'react-native-device-info';
//  import Geolocation from '@react-native-community/geolocation';

import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';


import * as Helpers from '../../functions/helpers';

export default class SignUpForm extends Component{
    constructor(props){
        super(props);
        this.processForm = this.processForm.bind(this);
        // this.findCoordinates = this.findCoordinates.bind(this)
        this.requestLocation = this.requestLocation.bind(this)
        this.getLocation = this.getLocation.bind(this)
    }


    async getLocation(){
        return new Promise(async (resolve, reject) => {
            Geolocation.getCurrentPosition((pos) =>{
                console.log("YOOOO", pos)
                resolve(pos)
            })
        })
    }


    // async getLocation(){
    //     return new Promise(async (resolve, reject) =>{
    //         check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
    //             console.log("check Result:", result);
    //             switch (result) {
    //                 case RESULTS.GRANTED:{
    //                     Geolocation.getCurrentPosition(

    //                             (position) => {
    //                                 console.log("position: ", position)
    //                                 resolve(position)
    //                             },
                                
    //                             (error) =>{
    //                                 reject(RESPONSE.LOCATION_ACCESS_ERROR)
    //                             },
                                
    //                             { enableHighAccuracy: true, timeout: 10000, maximumAge:1000}
                                
    //                         )
    //                         break;
    //                     }
                    
    //                 default:{
    //                     reject(RESPONSE.LOCATION_ACCESS_ERROR)
    //                 }
    //             }
    //         })
    //     })
    // }


    async requestLocation(){

        return new Promise(async (resolve, reject) =>{
            // Geolocation.setRNConfiguration({skipPermissionRequests:false, authorizationLevel:"always"});
            // Geolocation.requestAuthorization();
              request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
                console.log("request Result:", result);
                switch(result){
                    case RESULTS.DENIED:{
                        reject(false);
                        break;
                    }
                    case RESULTS.GRANTED:{
                        console.log('The permission is granted');
                        resolve(true)
                        break;
                    }
                    case RESULTS.BLOCKED:{
                        reject(false)
                        break;
                    }
                }
            });
        })
    }

    async componentDidMount(){
        let d_id = DeviceInfo.getUniqueId();
        let u_id = Helpers.genUserId();
        console.log({d_id, u_id})
        this.props.changeState({d_id, u_id})
        console.log(this.props.state)
          
    }

async processForm(){
    
    let {
        d_id,
        u_id,
        ageTF,
        age,
        gender,
        locationIsAllowed,
        currentLocation,
        alreadyRequested
    } = this.props.state;
    
    let userLocation, isAllowed;
    //request location access always
    try{
        isAllowed = true

        if(isAllowed){
            userLocation = await this.getLocation();
        }
    }catch(error){
        console.log("error at processForm: ", error)
         Alert.alert("Location Access Required!",
            "Location access must be set to \"Always\". Please go to your Settings and change it. ",
       
            [
                {text: 'Go to Settings', onPress: ()=> {openSettings().catch(()=>console.warn("cannot open settings."))}}
            ],
            {cancelable: true},
            )
        if(error.hasOwnProperty('errorCode')){
            this.props.changeState({error:error})
        }
    
        return false;
    }
   
    if(isAllowed){
         
        try{
             console.log(this.state)
            console.log({d_id:d_id, u_id:u_id, age:ageTF, gender:gender, location:userLocation, locationIsAllowed:true  });
            
            let ageres = await Helpers.checkAge(ageTF)
            let genderres = await Helpers.checkGender(gender)
            console.log("genderres", genderres)
            console.log(JSON.stringify({d_id:d_id, u_id:u_id, age:ageTF, gender:gender, location:userLocation, locationIsAllowed:true  }))
            let res = await Helpers.signUpUser({d_id:d_id, u_id:u_id, age:ageTF, gender:gender, location:userLocation, locationIsAllowed:true  })
            console.log(res.authToken)
            if(res.success){
                let authToken = res.authToken
            try {
                await AsyncStorage.setItem('@authToken', authToken)
            } catch (e) {
            // saving error
            console.log("saving error")
            }
                this.props.changeState({authtoken: authToken, loggedIn:true});
            }
        }catch(error){
            console.log("error at proce: ", error)
            this.props.changeState({
                error: error
            })
        }
    }
}




    render(){
            
        let {
            viewTitle,
            d_id,
            u_id,
            ageTF,
            gender,
            locationIsAllowed,
            currentLocation,
            error,
            step,
            authToken,
            loggedIn,
            ageTFActive
        } = this.props.state;

    

        let errorMessage = 
            (error.errorMessage === null) ? "" : error.errorMessage

        return (
            <View style={{flex : 1}}>
                <NavBarStage user={{}} title={viewTitle} handleAction={this.props.controlBack}/>
                
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1, background:'#f7f7f7' }}>
                    <MainContainer>
                        <FlexView>
                             <FormGroup>
                                <DefaultErrorText>
                                    {errorMessage}
                                </DefaultErrorText>
                            </FormGroup>

                             <FormGroup>
                            <TextDefault color={'#000'} size={'18px'} align={'center'}>
                                    We need some information from you. 
                            </TextDefault>
                            <TextDefault color={'#000'} size={'15px'} align={'center'}>
                                    Its completely anonymous.
                            </TextDefault>
                              </FormGroup>
                                <FormGroup>
                                <TextDefault color={'#000'} size={'20px'}>
                                    AGE
                                </TextDefault>
                                <InputTF  keyboardType="number-pad" 
                                        active={ageTFActive} 
                                        value={ageTF}
                                        autoCapitalize="none"
                                        onFocus={()=>{
                                        this.props.changeState({
                                            ageTFActive: true
                                        })
                                        }}

                                        onBlur={() =>{
                                        this.props.changeState({
                                            ageTFActive: false
                                        })
                                        }}
                                        onChangeText={(value) =>{
                                        if(value.length <= 3){
                                            this.props.changeState({
                                                ageTF: value
                                            })
                                        }
                                }}/> 
                                </FormGroup>
                                  <FormGroup>
                                <TextDefault color={'#000'} size={'20px'}>
                                    GENDER
                                </TextDefault>
                                <InlineFlex>
                                    <RadioButtonDarkGrey 
                                        activeStyle={(this.props.state.gender == 1)}
                                        onPress={()=>{
                                            this.props.changeState({
                                            gender: 1
                                            })
                                        }}
                                        >
                                        <TextDefault color={"#fff"}>
                                            MALE
                                        </TextDefault>
                                    </RadioButtonDarkGrey>
                                    <RadioButtonDarkGrey 
                                        activeStyle={(this.props.state.gender == 2)}
                                        onPress={()=>{
                                            this.props.changeState({
                                            gender: 2
                                            })
                                        }}
                                        >
                                        <TextDefault color={"#fff"}>
                                            FEMALE
                                        </TextDefault>
                                    </RadioButtonDarkGrey>
                                    <RadioButtonDarkGrey 
                                        activeStyle={(this.props.state.gender == 3)}
                                        onPress={()=>{
                                            this.props.changeState({
                                            gender: 3
                                            })
                                        }}
                                        >
                                        <TextDefault color={"#fff"}>
                                            OTHER
                                        </TextDefault>
                                    </RadioButtonDarkGrey>
                                </InlineFlex>
                                </FormGroup>
                            </FlexView>
                        <FooterView>
                     <ButtonContainer>
                        <ButtonPrimary 
                        onPress={this.processForm}
                        >
                        <TextDefault color={"#fff"}>
                            CONTINUE
                        </TextDefault>
                        </ButtonPrimary>
                            </ButtonContainer>
                     </FooterView>
                    </MainContainer>
                </KeyboardAvoidingView>

            </View>
        )
        
    }

}