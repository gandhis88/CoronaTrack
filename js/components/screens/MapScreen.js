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
        Keyboard,
        FlatList,
        Alert } from 'react-native';
import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import MapView, {Circle} from 'react-native-maps';

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
    ModRadioButtonDarkGrey,
    SearchBarTouch,
    ButtonTransparent,
    ButtonWhite,
ModInputTF,
ContentElementStats,
StatsFlexView

} from '../../styles/DefaultStyles'

/*Import Components*/
import NavBarCustom from '../UI/NavBarCustom'
import NavBarStage from '../UI/NavBarStage'
import DeviceInfo from 'react-native-device-info';
 import Geolocation from '@react-native-community/geolocation';
import Icon, { Ionicons  } from 'react-native-vector-icons/Ionicons';

import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';


import * as Helpers from '../../functions/helpers';



export default class MapScreen extends Component{
    constructor(props){
        super(props);

        this.state= {
            isLoading:true,
            user: {},
            authToken: "",
            error: {},
              currentDate: {
                day: "",
                date: "",
                month: "",
                year: ""
            },
            searchTF: "",
            searchData: [],
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.922,
                longitudeDelta: 0.0421,
            },
            zoom:20,
            mounted:false,
            searchScreenActive:false,
            currentLocationName:"",
            radius: 1000,
            presType: {},
            geoHash:"",
            placeName:"",
            infectionStateResults :[],
            initial_region:  {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.922,
                longitudeDelta: 0.0421,
            }
            
        }

        this.onRegionChange = this.onRegionChange.bind(this)
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this)
        this.toggleSearchScreen = this.toggleSearchScreen.bind(this)
        this.handleMapTouch = this.handleMapTouch.bind(this)
        this.handleMoveToUser = this.handleMoveToUser.bind(this)
        this.getInitialState = this.getInitialState.bind(this)
        this.handleTFSubmit = this.handleTFSubmit.bind(this)
    }

    getInitialState() {
        let {
            user
        } = this.state
    return {
        region: {
        latitude: user.location.latitude,
        longitude:user.location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        },
    };
    }

    async onRegionChange(region) {
        console.log("YOOOOOOO--------------------------------------")
        console.log(region)
        let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
        let radius = Math.pow(2, 20-zoom)/((1/zoom));
        // {geohash, precision}
         let presType = Helpers.getPrecisionType(radius);
        let geoHash = await Helpers.getLocationGeohash({latitude:region.latitude, longitude:region.longitude}, presType.precision);
        

        console.log("ZOOM LEVEL ::: ", zoom)
        this.setState({   zoom,
                            radius,
                            presType,
                            geoHash,
                          });
    }

    // onRegionChange(region){
    //     this.setState({region})
    // }


  async onRegionChangeComplete(region) {
        let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
        let radius = Math.pow(2, 20-zoom)/((1/zoom));
        // {geohash, precision}
        let presType = Helpers.getPrecisionType(radius-520);
        var placeName = ""
        try{
            placeName = await Helpers.getPlaceName({latitude:region.latitude, longitude:region.longitude}, presType)
        }catch(e){
            console.log("PLACENAME", e)
        }
        let geoHash = await Helpers.getLocationGeohash({latitude:region.latitude, longitude:region.longitude}, presType.precision);
        let infectionStateResults = await Helpers.getInfectionState(geoHash)

        console.log("ZOOM LEVEL ::: ", zoom)

        this.setState({ region, placeName, infectionStateResults, zoom,radius, presType, geoHash });
    }

    async handleTFSubmit(){

        let {
            searchTF,
            region
        } = this.state
    console.log("submitted")
        try{
            
            let geolocation = await Helpers.getLocationCoords(searchTF)
            
            let geoHash = await Helpers.getLocationGeohash({latitude:geolocation.latitude, longitude:geolocation.longitude}, 8);
            let infectionStateResults = await Helpers.getInfectionState(geoHash)
            let region = {
                latitude: geolocation.latitude,
                longitude: geolocation.longitude,
                latitudeDelta: 0.04,
                longitudeDelta:0.05
            }


             let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
        let radius = Math.pow(2, 20-zoom)/((1/zoom));
        // {geohash, precision}
         let presType = Helpers.getPrecisionType(radius);


             this.setState({ searchTF,region,placeName:searchTF, zoom, radius, presType,geoHash, infectionStateResults  });
        }catch(e){
            this.setState({searchTF:"Place not found"})
        }
    }

    handleMapTouch(){
        Keyboard.dismiss()
        let {
            searchScreenActive
        } = this.state;
        if(searchScreenActive){
            Keyboard.dismiss();
            this.setState({searchScreenActive: false})
        }
        console.log("map touched")
    }


    async handleMoveToUser(){
        // let {
        //     latitude, longitude        
        // } = this.state.user.location.coords 
        console.log("pressed")
        try{
          let userLocation = JSON.parse(await AsyncStorage.getItem("@lastUserPos"))
            if(userLocation != null){
                console.log(userLocation)
                    console.log()
                let region = {
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.122,
                    longitudeDelta: 0.121,
                }
                 let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
        let radius = Math.pow(2, 20-zoom)/((1/zoom));
        // {geohash, precision}
         let presType = Helpers.getPrecisionType(radius);
        let geoHash = await Helpers.getLocationGeohash({latitude:region.latitude, longitude:region.longitude}, presType.precision);
          let placeName = await Helpers.getPlaceName({latitude:region.latitude, longitude:region.longitude}, presType)
        // let placeName = await Helpers.getPlaceName({latitude:region.latitude, longitude:region.longitude}, presType)


        console.log("ZOOM LEVEL ::: ", zoom)
        this.setState({ region, zoom,
                            radius,
                            presType,
                            geoHash,
                            placeName
                              });
            }
         
        }catch(e){console.log(e)}
        
    }

   async componentDidMount(){


        try{
            let authToken = await AsyncStorage.getItem("@authToken");
            let user = await Helpers.getUser(authToken)
             console.log("MOUNT LOCATION:: 1");
            let currentDate = Helpers.getCurrentDate();
            console.log("-----")
            //request location access always
            let userLocation = JSON.parse(await AsyncStorage.getItem("@lastUserPos"));
            user.location = userLocation;
             console.log("MOUNT LOCATION::5 :: ", userLocation);

            let region = {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0121,
            }

            


          let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
        let radius = Math.pow(2, 20-zoom)/((1/zoom));
        let presType = Helpers.getPrecisionType(radius);
        let geoHash = await Helpers.getLocationGeohash({latitude:region.latitude, longitude:region.longitude}, presType.precision);
        
        let infectionStateResults = await Helpers.getInfectionState(geoHash)


        let placeName = await Helpers.getPlaceName({latitude:region.latitude, longitude:region.longitude}, presType)

            let initial_region = region

            this.setState({ isLoading: false, 
                            mounted: true,
                            user: user, 
                            authToken:authToken, 
                            region:region,
                            currentDate: currentDate,
                            infectionStateResults,
                            zoom,
                            radius,
                            presType,
                            geoHash,
                            placeName,
                            initial_region
                            })
                          
          

        }catch(error){
            console.log("MAP SCREEN", error)
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

    toggleSearchScreen(){
        this.setState({searchScreenActive: true})
    }

    

    render(){
       
        let {
            isLoading,
            user,
            authToken,
            searchTF,
            searchScreenActive,
            searchData,
            searchDataIsLoading,
            mounted,
            region,
             zoom,
            radius,
            presType,
            geoHash,
            placeName,
            infectionStateResults,
            initial_region
        } = this.state


        let circleCenter = {latitude: region.latitude, longitude: region.longitude}
         let z = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)




        console.log("radius:: ", radius)
        let circleColor = 'rgba(225,39,39, 0.3)'
        console.log("STATE :::: ", this.state.infectionStateResults)

        let ranges = [">85%", "60-85%", "30-60%","0-30%" ]

        let RangeElements = infectionStateResults.map((x, i) =>{
            console.log("relemen", x)
            return (
                <ModFlexView>
                   <DarkText key={ranges[i]} align={'center'} size={'25px'} weight={700}>{x.count}</DarkText>
                   <DarkText key={'x'+ranges[i]} align={'center'}  size={'14px'} weight={400}>{ranges[i]}</DarkText>
                   </ModFlexView>
            )
        })








         searchTF = placeName;

        let SearchBar = ( <ModInputTF  style={{marginTop:'10%'}} keyboardType="default" 
                                        active={searchScreenActive} 
                                        returnKeyType = {"search"}
                                        value={searchTF}
                                        autoCapitalize="none"
                                        onFocus={()=>{
                                            console.log("I GOT PRESSED")
                                        this.setState({
                                            searchScreenActive: true
                                        })
                                        }}
                                        placeholder="Search"

                                        onBlur={() =>{
                                        this.setState({
                                            searchScreenActive: false
                                        })
                                        }}

                                         onSubmitEditing={this.handleTFSubmit}
                                        onChangeText={(value) =>{
                                        if(value.length <= 45){
                                        
                                            this.setState({
                                                searchTF: value,
                                                placeName: value
                                            })
                                        }
                                }}/> 
        )
     
    return (
         <View style={{flex: 1, background: 'none'}}>
          
<MapView style={{flex:1,position:'absolute',top:0, bottom:0, elevation: 1, left:0, right:0, zIndex:0}}
                    region={this.state.region}

                    onRegionChangeComplete = {
                        (region1) =>{
                            this.onRegionChangeComplete(region1)
                        }
                    }

                    // onRegionChangeComplete={this.onRegionChange}
                    // onRegionChange={
                        
                    //     (region1) => {
                  
                    //     //   console.log("=====|||||||||||||||||||||||||")
                    //       this.onRegionChange(region1)
                    //     //    this.setState({region:region1}) 
                    // }
                    // }
                    
                //  onPress={this.handleMapTouch}
            >
              <Circle center={circleCenter} radius={radius} fillColor={circleColor}/>

    </MapView>
    <ModFlexView style={{height:200, position:'absolute', background: 'none', zIndex:2,  elevation: 3}} >
           {SearchBar}
           </ModFlexView>
            <ModFlexView style={{height:50,   elevation: 3,  display:(!searchScreenActive)? 'flex' : 'none', width:50, background: 'none', 
            zIndex:2, position:'absolute', right:20,top:100}}>
                <ButtonWhite onPress={this.handleMoveToUser}>
        
                <Image source={require("../../../assets/images/icons/gps.png")} style={{width: 25, height:25, resizeMode:'contain'}}/>
                </ButtonWhite>
                {/* <ModFlexView style={{height:'auto', background: 'none', zIndex:1}}>
                    {SearchResults}
            </ModFlexView> */}
            
           </ModFlexView>

 <StatsFlexView style={{height:'auto',padding:30, width:'90%', display:(!searchScreenActive)? 'flex' : 'none', backgroundColor: '#fff', elevation: 3, zIndex:2, position:'absolute', right:20,bottom:50}}>
            <FlexRow style={{justifyContent:'space-around', width:'100%', paddingBottom:20}}>
               {RangeElements}
            </FlexRow>
              <DarkText align={'center'}  size={'14px'} weight={400}>People with Infection Probabilites</DarkText>
         </StatsFlexView>
            

         </View>
    )
    }

}




