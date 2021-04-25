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
        Image,
        Alert } from 'react-native';
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
    DarkText,
    ContentElement,
    FlexRow,
    ModFlexView,
    ContentElementWarning,
    ModRadioButtonDarkGrey

} from '../../styles/DefaultStyles'

/*Import Components*/
import NavBarCustom from '../UI/NavBarCustom'
import LoaderImage from '../UI/LoaderImage'
import NavBarStage from '../UI/NavBarStage'
import DeviceInfo from 'react-native-device-info';
 import Geolocation from '@react-native-community/geolocation';

import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';

import { DateTime } from 'luxon';


import * as Helpers from '../../functions/helpers';



export default class ReportHome extends Component{
    constructor(props){
        super(props);
        this.state= {
            isLoading:true,
            user: {},
            authToken: "",
            error: {},
            currentDate: DateTime.local(),
            symptoms: {},
            isEmptyRecordForToday:true,
            infectionProbability:0,
            lastPosition: {},
            userLocationGeohash: ""
        }

        this.watchId = 0;

        this.renderRecordTable = this.renderRecordTable.bind(this)
    // this.handlePress = this.handlePress.bind(this)
        this.getSubmitButtonContent = this.getSubmitButtonContent.bind(this)
        this.handleRecordSubmit = this.handleRecordSubmit.bind(this)
        this.getSymptomComponents = this.getSymptomComponents.bind(this)
    }   


    handlePress(e){
        let {symptoms} = this.state
        symptoms[e]['state'] += 1;
        this.setState({symptoms}) 
    }



    async renderRecordTable(authToken){
     
        try{
            let res = await Helpers.getTodaysRecord(authToken);
            console.log(res.record.symptoms)
            console.log(res.record.record_datetime)
             let recordDate = res.record.record_datetime.slice(0,10)

            let todaysDate = DateTime.local().toISO().slice(0,10)

                console.log("recorddate", recordDate)
                console.log("todaysdate", todaysDate)

            this.setState({symptoms: res.record.symptoms, isEmptyRecordForToday: !(todaysDate === recordDate)})
        }catch(e){
            console.log(e)
            this.setState({error:e})
        }
    }


    getSubmitButtonContent(){
        let {isEmptyRecordForToday, isLoading} = this.state
        if(isLoading) return "⏳"
        if(isEmptyRecordForToday){
            return "SUBMIT FOR TODAY"
        }else{
            return "SUBMITTED FOR TODAY ✅"
        }

    }


    async handleRecordSubmit(){
        let {
        user,
        authToken,
        symptoms,
        locationIsAllowed,
    } = this.state;
    
        try{
           
            let newRecord = {
                    d_id:user.d_id,
                    record_datetime:DateTime.local().toISO().slice(0, 19).replace('T', ' '), 
                    location:user.location, 
                    symptoms:symptoms, 
                };
            
            let res = await Helpers.insertRecord(newRecord, authToken)
 console.log("checking 3")
            //insert new infection probability = f (d_id, location, symptoms)
            let {latitude, longitude} = user.location.coords
            //high precision
             let PRECISION = 9;
            let locationGeohash = await Helpers.getLocationGeohash({latitude, longitude},PRECISION );
            let infecProbResult = await Helpers.processUserInfectionState(user.d_id, locationGeohash, newRecord.symptoms) 
             console.log("checking 4")
            // console.log(locationGeohash, infecProbResult)
            console.log(res)
            console.log(infecProbResult)
            if(res.success && infecProbResult.success){
                this.setState({
                    infectionProbability:infecProbResult.infection_probability,
                    userLocationGeohash: locationGeohash,
                    isEmptyRecordForToday: false, 
                    isLoading:false
                    });
            }else{
                throw RESPONSES.ERR_SYS;
            }

        }catch(error){
            if(error.errorCode === 'ERROR/LOCATION_ACCESS_ERROR'){
                console.log("Error at handleRecordSubmit: ", error)

                Alert.alert("Location Access Required!", "Location access must be set to \"Always\". Please go to your Settings and change it. ",
                [
                    {text: 'Go to Settings', onPress: ()=> {openSettings().catch(()=>console.warn("cannot open settings."))}}
                ],
                {cancelable: true},
                )
            }
            this.setState({error:error, isLoading:false})
        }   


    }
     componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }
    async componentDidMount(){

        try{
            let authToken = await AsyncStorage.getItem("@authToken");
            let user = await Helpers.getUser(authToken)
            await this.renderRecordTable(authToken)

             let currentDate = DateTime.local()
            // let {latitude, longitude} = user.location.coords
            //high precision
            
           

             this.watchID = Geolocation.watchPosition(
                async (lastPosition) => {
            //  const lastPosition = JSON.stringify(position);
                    user.location = lastPosition;
                    let lastUserPos = JSON.stringify(lastPosition)
                    await AsyncStorage.setItem("@lastUserPos", lastUserPos);
                 let {latitude, longitude} = user.location.coords

                    let PRECISION = 9;
                let locationGeohash = await Helpers.getLocationGeohash({latitude, longitude},PRECISION );
                let infecProbResult = await Helpers.processUserInfectionState(user.d_id, locationGeohash, this.state.symptoms) 
                await AsyncStorage.setItem("@lastUserPos", lastUserPos);
              this.setState({ 
                    isLoading: false, 
                    user:user, 
                    infectionProbability:infecProbResult.infection_probability, 
                    authToken:authToken, 
                    currentDate: currentDate,
                    lastPosition:lastPosition,
                    userLocationGeohash:locationGeohash
                })
                 }, 
                 (error) =>{
                     console.log("Error :: ", error)
                 },
                  { enableHighAccuracy: true, timeout: 50000, maximumAge:1000, distanceFilter: 25}

    
    );


               

        }catch(error){
            if(error.errorCode === 'ERROR/LOCATION_ACCESS_ERROR'){
                console.log("Error at handleRecordSubmit: ", error)

                Alert.alert("Location Access Required!", "Location access must be set to \"Always\". Please go to your Settings and change it. ",
                [
                    {text: 'Go to Settings', onPress: ()=> {openSettings().catch(()=>console.warn("cannot open settings."))}}
                ],
                {cancelable: true},
                )
                   this.setState({error:error, isLoading:false})
            }
          this.setState({error:RESPONSES.ERR_SYS, isLoading:false})
        }   
    }

    getSymptomComponents(){
        let {
            isLoading,
            user,
            authToken,
            currentDate,
            error,
            symptoms,
            isEmptyRecordForToday,
            infectionProbability,
            lastPosition
        } = this.state




        let SymptomComponents =  Object.keys(symptoms).map((symptom) =>{
                    return(
                        <ContentElement key={symptom}>
                         <FlexRow>
                        <FlexRow style={{width:'30%'}}>
                            <TextDefault color={'#191919'} size={'18px'} weight={600}>{symptoms[symptom].name}</TextDefault>
                        </FlexRow>
                            <FlexRow style={{width:'70%', justifyContent:'flex-end'}}>
                                <ModRadioButtonDarkGrey 
                                        activeStyle={(symptoms[symptom]['state'] == 0)}
                                        onPress={()=>{
                                            let sympObj = {...symptoms}
                                            sympObj[symptom]['state'] = 0
                                            this.setState({
                                                symptoms : sympObj
                                            })
                                        }}
                                        >
                                        <TextDefault color={"#fff"}>
                                            NO
                                        </TextDefault>
                                    </ModRadioButtonDarkGrey>
                                    <ModRadioButtonDarkGrey 
                                        activeStyle={(symptoms[symptom]['state'] == 1)}
                                        onPress={()=>{
                                            let sympObj = {...symptoms}
                                            console.log("symbObj :: ", sympObj)
                                            console.log("statevar:: ", symptoms[symptom]['state'])
                                            sympObj[symptom]['state'] = 1
                                            this.setState({
                                                symptoms : sympObj
                                            })
                                        }}
                                        >
                                        <TextDefault color={"#fff"}>
                                            MILD
                                        </TextDefault>
                                    </ModRadioButtonDarkGrey>
                                    <ModRadioButtonDarkGrey 
                                        activeStyle={(symptoms[symptom]['state'] == 2)}
                                        onPress={()=>{
                                            let sympObj = {...symptoms}
                                            sympObj[symptom]['state'] = 2
                                            this.setState({
                                                symptoms : sympObj
                                            })
                                        }}
                                        >
                                        <TextDefault color={"#fff"}>
                                            HIGH
                                        </TextDefault>
                                    </ModRadioButtonDarkGrey>
                            </FlexRow>
                        </FlexRow>
                        </ContentElement> )
                })

                return SymptomComponents;
    }


    getUpdatedInfprob(){
        
    }


    render(){

        console.log("DATETIME NOW: ",  );

        let {
            isLoading,
            user,
            authToken,
            currentDate,
            error,
            symptoms,
            isEmptyRecordForToday,
            infectionProbability,
            lastPosition
        } = this.state
         console.log(this.state)
        
        let errorMessage = 
            (error.errorMessage === null) ? "" : error.errorMessage    
        let submitBtnContent = this.getSubmitButtonContent()

        let month = Helpers.getM(currentDate.month)
        let weekday = Helpers.getD(currentDate.weekday)
        let symptomComponents =  this.getSymptomComponents();

    if(isLoading){
        return (
            <MainContainer>
               
            </MainContainer>
        )
    }else{
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <MainContainer>
                    
                    {/* <ModFlexView style={{padding:25}}> */}
                    <FlexRow style={{padding:25, width:'100%' }} >
                    <ModFlexView style={{width:'auto'}}>
                     <DarkText weight={800} style={{fontWeight: "bold"}}>
                            {weekday} 
                        </DarkText>
                        <DarkText weight={400}>
                            {month + " " + currentDate.day + ", " + currentDate.year} 
                        </DarkText>
                        </ModFlexView>
                         <ModFlexView style={{width:'auto'}}>
                         <ContentElementWarning>
                      <TextDefault weight={600} size={'25px'} color={'#fff'}>
                           {infectionProbability} %
                        </TextDefault>
                        <TextDefault weight={400} color={'#fff'}>
                        Infection
                            </TextDefault>
                            <TextDefault weight={400} color={'#fff'}>
                        Probability
                            </TextDefault>
                          </ContentElementWarning>
                        </ModFlexView>
                    </FlexRow>
                    {/* </ModFlexView> */}

                      <ScrollView
                            contentContainerStyle={{
                                minWidth: "100%"
                            }}>

                         <ModFlexView  style={{flex:1, paddingBottom:'10%'}}  justifyContent={'center'}>
                        {symptomComponents}
                        <FlexView style={{width:'92%', marginTop:'8%'}} >
                        <ButtonBlack disabled={!(isEmptyRecordForToday)} onPress={this.handleRecordSubmit}>
                             <TextDefault weight={400} color={'#fff'}>
                            {submitBtnContent}
                            </TextDefault>
                        </ButtonBlack>
                         </FlexView>
                        </ModFlexView>

                       </ScrollView>
                </MainContainer>

            </SafeAreaView>

    
        )
        }

    }
}

/* Rectangle:


   <ContentElement>

                                <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                Fever
                            </TextDefault>
                            <FlexRow>
                                 <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            </FlexRow>
                        </ContentElement>
                          <ContentElement>

                                <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                Cough
                            </TextDefault>
                            <FlexRow>
                                 <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            </FlexRow>
                        </ContentElement>
                          <ContentElement>
                            
                                <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                Cold
                            </TextDefault>
                            <FlexRow>
                                 <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            </FlexRow>
                        </ContentElement>
                          <ContentElement>
                             <FlexRow>
                                <TextDefault weight={400} size={'20px'} color={'#010101'}>
                                Breathing Diff.
                            </TextDefault>

                            <FlexRow>
                                 <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            </FlexRow>
                             </FlexRow>
                        </ContentElement>
                        <ContentElement>

                                <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                Body Ache
                            </TextDefault>

                            <FlexRow>
                                 <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            <TextDefault weight={400} size={'25px'} color={'#010101'}>
                                F
                            </TextDefault>
                            </FlexRow>
                        </ContentElement> */
