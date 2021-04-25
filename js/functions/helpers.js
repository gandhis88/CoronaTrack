import axios from 'axios'
import {
    BASE_URL,
    RESPONSES,
    MAPBOX_TOKEN_1,
    GOOGLE_API_KEY
} from './helperConstants'

import {
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USER_DESC_MAX_LENGTH
} from './lengthConstants'

import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';
var Geohash = require('ngeohash');


import { DateTime } from 'luxon';


export async function getLocationCoords(place){
     return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method : 'GET',
                url: "https://maps.googleapis.com/maps/api/geocode/json?address="+place+"&key="+GOOGLE_API_KEY
            })
            console.log(res)
            if(res.data.results){
                let coords = {latitude: res.data.results[0]['geometry']['location']['lat'], longitude: res.data.results[0]['geometry']['location']['lng']}
                console.log(res.data)
                console.log(coords)
                resolve(coords)
            }
        }catch(e){
            console.log(e)
             reject(RESPONSES.ERR_SYSTEM)
        }
})
}



export async function getInfectionState(locationGeohash){
     return new Promise(async (resolve, reject) =>{
        try{

              let res = await axios({
                method: 'GET',
                url: BASE_URL + '/v1/data/infection_state',
                params: {
                    locationGeohash:locationGeohash.slice(0, locationGeohash.length - 2)
                }
            })
        if(res.data.results){
                resolve(res.data.results)
            }
            else
                throw res;  

        }catch(e){
            console.log(e)
             reject(RESPONSES.ERR_SYSTEM)
        }
})
}



//d_id, symptoms, location =locationGeohash
export async function processUserInfectionState(d_id,locationGeohash, symptoms){
    return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method: 'POST',
                url: BASE_URL + '/v1/data/user/infection_probability',
                data: {
                    d_id: d_id,
                    locationGeohash: locationGeohash,
                    symptoms: symptoms
                }
            })

            if(res.data){
                resolve(res.data)
            }
            else
                throw res;            
        }catch(e){
            console.log("Coudn't resolve infection probability.")
            reject(RESPONSES.ERR_SYSTEM)
        }

    })
}



//location = {latitude, longitude}
export async function getLocationGeohash(location, precision){
    return new Promise(async (resolve, reject) =>{
         let locationGeohash = Geohash.encode(location.latitude, location.longitude, precision);
    
        resolve(locationGeohash)   

    })
}

 export async function getLocation(){
        return new Promise(async (resolve, reject) =>{
            check(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                console.log("check Result:", result);
                switch (result) {
                    case RESULTS.GRANTED:{
                        Geolocation.getCurrentPosition(

                                (position) => {
                                    console.log("position: ", position)
                                    resolve(position)
                                },
                                
                                (error) =>{
                                    reject(RESPONSES.LOCATION_ACCESS_ERROR)
                                },
                                
                                { enableHighAccuracy: true, timeout: 10000, maximumAge:1000}
                                
                            )
                            break;
                        }
                    
                    default:{

            //              check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result1) => {
            //     console.log("check Result:", result);
            //     switch (result1) {
            //         case RESULTS.GRANTED:{
            //             Geolocation.getCurrentPosition(

            //                     (position) => {
            //                         console.log("position: ", position)
            //                         resolve(position)
            //                     },
                                
            //                     (error) =>{
            //                         reject(RESPONSES.LOCATION_ACCESS_ERROR)
            //                     },
                                
            //                     { enableHighAccuracy: true, timeout: 10000, maximumAge:1000}
                                
            //                 )
            //                 break;
            //             }
                    
            //         default:{
            //             reject(RESPONSES.LOCATION_ACCESS_ERROR)
            //         }
            //     }
            // })
                     reject(RESPONSES.LOCATION_ACCESS_ERROR)
                    }
                }
            })
        })
    }


 export async function requestLocation(){
        return new Promise(async (resolve, reject) =>{
            // Geolocation.setRNConfiguration({skipPermissionRequests:false, authorizationLevel:"always"});
            // Geolocation.requestAuthorization();
              request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
                console.log("request Result:", result);
                switch(result){
                    case RESULTS.DENIED:{
                        reject(RESPONSES.LOCATION_ACCESS_ERROR);
                        break;
                    }
                    case RESULTS.GRANTED:{
                        console.log('The permission is granted');
                        resolve(true)
                        break;
                    }
                    case RESULTS.BLOCKED:{
                    
                        

                        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
                console.log("request Result:", result);
                switch(result){
                    case RESULTS.DENIED:{
                        reject(RESPONSES.LOCATION_ACCESS_ERROR);
                        break;
                    }
                    case RESULTS.GRANTED:{
                        console.log('The permission is granted');
                        resolve(true)
                        break;
                    }
                    default:{
                         reject(RESPONSES.LOCATION_ACCESS_ERROR);
                    }
                }
            });


                        break;
                    }
                }
            });
        })
    }


// export function getRadiusFromPlaceType(){
// country, region, postcode, district, place, locality, neighborhood, address, and poi. 
// }


// export const PlaceType = ["ROOFTOP","RANGE_INTERPOLATED", "neighborhood", "locality", "postcode",  "place", "district", "region", "country" ]

export const PlaceType = [
    {
        location_type:"ROOFTOP" ,
        result_type: "street_address"
    },  
    {
        location_type:"ROOFTOP" ,
        result_type: "street_address"
    },
     
    {
        location_type:"RANGE_INTERPOLATED" ,
        result_type: "street_address"
    },
    {
        location_type:"RANGE_INTERPOLATED" ,
        result_type: "neighborhood"
    },
    {
        location_type:"RANGE_INTERPOLATED" ,
        result_type: "political"
    },
    
     {
        location_type:"RANGE_INTERPOLATED" ,
        result_type: "locality"
    },
     {
        location_type:"APPROXIMATE" ,
        result_type: "locality"
    },
     {
        location_type:"APPROXIMATE" ,
        result_type: "country"
    },

    
]


export function getPrecisionType(radius){

//returns a prestype
    switch(true){
        case (radius < 5):{
            return {precision: 9, type:0}
        }
        case  (radius >= 5 && radius < 38):{
            return {precision: 9, type:1}
        }
        case (radius >= 38 && radius < 150):{
             return {precision: 8, type:2}
        }
        case (radius >= 150 && radius < 650):{
             return {precision: 8, type:3}
        }
        case (radius >= 650 && radius < 4800):{
             return {precision: 8, type:4}
        }
        case (radius >= 4800 && radius < 19000):{
             return {precision: 7, type:5}
        }
        case (radius >= 19000 && radius < 156000):{
             return {precision: 7, type:6}
        }
        default:{
             return {precision: 3, type:7}
        }
    }
}

// latlng=37.32837938,-122.02686219&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAC71s6Hqpftux1khU_-r5h2o-yhjINpGg
export async function getPlaceName(location, presType){
    return new Promise(async (resolve, reject) =>{

console.log("PLACE:: " + "https://maps.googleapis.com/maps/api/geocode/json?latlng="+location.latitude+","+location.longitude +"&result_type="+PlaceType[presType.type]['result_type']+"&key="+GOOGLE_API_KEY)
        try{
            let res = await axios({
                method : 'GET',
                url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="
                +location.latitude+","+location.longitude
                +"&result_type="+PlaceType[presType.type]['result_type']
                +"&key="+GOOGLE_API_KEY
            })
            console.log(res);
            if(res.data.results.length == 0){
                resolve(res.data.plus_code.compound_code)
            }else{
                resolve(res.data.results[0].formatted_address)
            }
        }catch(error){
             reject({})
        }

    })
}






// https://api.mapbox.com/geocoding/v5/mapbox.places/georgia.json?types=country&access_token='+MAPBOX_TOKEN_1


export function getSearchResults(value){
    return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method: 'GET',
                url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+value+'.json?autocomplete=true&access_token='+MAPBOX_TOKEN_1
            })
                resolve(res.data.features)

        
        }catch(e){
            console.log("results error")
            reject(RESPONSES.COULDNT_FETCH_RESULTS)
        }
    })
}





export function insertRecord(record, authToken){
     return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method: 'POST',
                url: BASE_URL + '/v1/data/record',
                data: {
                    record:record,
                    dateISO: DateTime.local().toISO().slice(0, 19).replace('T', ' ')
                },
                headers: {
                    Authorization: authToken //the token is a variable which holds the token
                }
            })

            resolve(res.data)
        }catch(e){
              reject(RESPONSES.USER_AUTH_ERROR)
        }
    })
}

export function getFeedback(feedback, location, date){
  return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method: 'GET',
                url: BASE_URL + '/v1/data/feedback',
                params:{
                    feedback,
                    location,
                    date
                },
                
            })
            resolve("sent")

        }catch(e){
           resolve("sent")
        }

})
}
export function getRecordDate(d){
    if(d.length == 0)
        return ""
    else
    return new Date(d).toISOString().split("T")[0] 
}

export function getTodaysDate(){
    return new Date().toISOString().split("T")[0]
}

export async function getTodaysRecord(authToken){
    let dateISO = DateTime.local().toISO().slice(0, 19).replace('T', ' ')
    return new Promise(async (resolve, reject) =>{
         console.log("resu")
        try{
            let res = await axios({
                method: 'GET',
                url: BASE_URL + '/v1/data/user/record',
                params:{
                    dateISO: dateISO
                },
                headers: {
                    Authorization: authToken //the token is a variable which holds the token
                }
            })
            console.log("result at gettodys record", res)
            resolve(res.data)
        }catch(e){
            console.log("get err", e)
              reject(RESPONSES.USER_AUTH_ERROR)
        }
    })
}


export function getM(m){

    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    return months[m-1];
}

export function getD(d){
    let days = ['Sunday', 'Monday', 'Tuesday', 
    'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    return days[d];
}



export function getCurrentDate(){
    let d = DateTime.local()
    return {
        day: getD(d.day),
        date: d.day,
        month: getM(d.month),
        year: d.year
    }
}

export async function getUser(authToken){
    return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method: 'GET',
                url: BASE_URL + '/v1/auth/user',
                headers: {
                    Authorization: authToken //the token is a variable which holds the token
                }
            })
            console.log("GOT THE USER:: ", res.data)
            resolve(res.data)
        }catch(e){
            console.log(e)
            reject(RESPONSES.USER_AUTH_ERROR)
        }
    })
}

export async function checkIfUserExists(d_id){
    return new Promise(async (resolve, reject) =>{
          try{
            let res = await axios({
                method: 'GET',
                url : BASE_URL + '/v1/auth/check',
                params : {
                    d_id:d_id
                }
            })
            console.log("result at checkif Helpers: ", res)
            //res.data will be {authtoken, sucess}
            resolve(res.data)
        }catch(e){
            console.log(e);
            reject(RESPONSES.ERR_SYSTEM)
        }
    })
}

export async function checkAge(ageTF){

    return new Promise(async (resolve, reject) =>{
        let age = Number(ageTF)
        console.log("numberform", age)
        if(typeof age !== "number"){
            console.log("type check", age)
             reject(RESPONSES.AGE_INVALID)
        }
        else if(age < 1 || age > 110){
            console.log("here yoo", age)
            reject(RESPONSES.AGE_INVALID)
        }else{
            resolve(true)
        }
    })
}

export async function checkGender(gender){
    console.log("chec gende :: ", gender)
    return new Promise(async (resolve, reject) =>{
        if(gender != 1 && gender != 2 && gender != 3){
            reject(RESPONSES.GENDER_INVALID)
        }else{
            resolve(true)
        }
    })
}

export function genUserId(){
     const length = 8;
        let seedText = "newUser";
        let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		seedText.toUpperCase() +
		"abcdefghijklmnopqrstuvwxyz" +
		seedText +
		"123456789";
	    let charLength = chars.length;
	    var result = "";
	    for (var i = 0; i < length; i++) {
		    result += chars[Math.floor(Math.random() * charLength)];
	    }   

    return result; 
}



export function signUpUser(user){
     return new Promise(async (resolve, reject) => {
        try{
            console.log("\n\n\n\n", user, "\n\n\n")
            let res = await axios({
                method: 'POST',
                url : BASE_URL + '/v1/auth/signup',
                data : {
                    user
                }
            })
            console.log(res)
            //res.data will be authtoken
            resolve(res.data)
        }catch(e){
            console.log(e);
            reject(RESPONSES.ERR_SYSTEM)
        }
    })
}



/**
 * Checks the validity of phone number
 * and available by making an api call.
 * @param {string} phone to check against.
 * @returns {Promise} resolves res.data from api.
 */

export async function checkPhone(phone){
    return new Promise(async (resolve, reject) =>{
        if(phone === "" || phone === null) reject(RESONSES.PHONE_INVALID)
        phone = phone.trim();
        let response = RESPONSES.ERR_SYSTEM;
        const phoneExp = /^[0-9]*$/;
        if(phone.length !== 11){
            console.log((phone.length !== 11), phone)
            reject(RESPONSES.PHONE_INVALID);
        }else if (!(phoneExp.test(phone))){
            reject(RESPONSES.PHONE_INVALID);
        }
        else{
            try{
                let res = await axios({
                    url : BASE_URL + '/validate/phone',
                    method: 'GET',
                    params : {
                        phone: phone
                    }
                })

                resolve(res.data)
            }catch(e){
                  console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim(), e)
                  reject(RESPONSES.ERR_CONNECTION)
            }
        }
        
    })
}


/**
<key>NSLocationWhenInUseUsageDescription</key>
	<string>$(PRODUCT_NAME) would like access to your location.<string/>
	<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
	<string>$(PRODUCT_NAME) would like access to your location.<string/>
 * Checks the validity of email address
 * and available by making an api call.
 * @param {string} email to check against.
 * @returns {Promise} resolves res.data from api.
 */
 export async function checkEmailAddress(email){
    return new Promise(async (resolve, reject) =>{
        if(email === '' || email === null) reject(RESPONSES.EMAIL_FORMAT)
        email = email.toLowerCase().trim()
        let response = RESPONSES.ERR_SYSTEM
        const emailExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email.length < 4){
            reject(RESPONSES.EMAIL_LENGTH)
        }
        else if(!(emailExpression.test(email))){
            reject(RESPONSES.EMAIL_FORMAT)
        }
        else{
            try{
                let res = await axios({
                url : BASE_URL + '/validate/email',
                method: 'GET',
                params : {
                    email
                }
            })
            resolve(res.data)
            }catch(e){
                 console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim(), e)
                reject(RESPONSES.ERR_CONNECTION)
            }
        }
    })
 }

/**
 * Checks the validity of name field.
 * @param {string} name to check.
 * @returns {Promise} 
 */
 export async function checkName(name){
     return new Promise((resolve, reject) =>{
        if(name === null || name.length < 2 || name.length > 40) reject(RESPONSES.NAME_INVALID)
        else resolve(RESPONSES.SUCCESS)
     })
 }


/**
 * Checks the validity of password.
 * @param {string} password to check against.
 * @returns {Promise}
 */

export async function checkPassword(password){
    return new Promise((resolve, reject) => {
        if(password === null || password.length < 8 || password.length > 100) reject(RESPONSES.PASSWORD_LENGTH)
        else resolve(RESPONSES.SUCCESS)
    })
}  


export async function checkUserProfileFields(name, username, userDescription){
    return new Promise((resolve, reject) =>{
        if(name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH){
            reject(RESPONSES.NAME_LENGTH)
        }else if(username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH){
            reject(RESPONSES.USERNAME_LENGTH)
        }else if(userDescription.length > USER_DESC_MAX_LENGTH){
            reject(RESPONSES.USER_DESC_LENGTH)
        }
        else resolve(RESPONSES.SUCCESS)
    })
}

/**
 * Checks the validity of username
 * and available by making an api call.
 * @param {string} username to check against.
 * @returns {Promise} resolves res.data from api.
 */
export async function checkUsername(username){
    return new Promise(async (resolve, reject) => {
//username regex expression
    const usernameExpression = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/
    //trim any spaces
    username = username.trim().toLowerCase()
    //min length = 2
    if(
        username.length < USERNAME_MIN_LENGTH ||
        username.length > USERNAME_MAX_LENGTH
    ) {
         
        reject(RESPONSES.USERNAME_LENGTH)
    }
    else if(!usernameExpression.test(username)){

        reject(RESPONSES.USERNAME_FORMAT)
    }
        else{
            try{
                let res = await axios({
                    method: 'GET',
                    url: BASE_URL + '/validate/username',
                    params: {
                        username
                    }
                })
                if(res.data.hasOwnProperty("errorStatus")){
                    if(res.data.errorStatus){
                        console.log('username helpers: username has')
                        reject(res.data)
                    }else if(!res.data.errorStatus){
                        console.log('username helpers: username success')
                        resolve(res.data)
                    }
                }
                console.log('system error at - username helpers')
                reject(res.data)
              
            }catch(e){
                console.log('username helpers error catch:', e)
                reject(e)
            }
        }
    })
}

/*
* Inserts user data.
* @param {Object} userData : the user data object.
* @returns {Promise} resolves server response on success (res.data),
*  rejects if error or user not authenticated.
**/
export async function insertUserData(userData){
    return new Promise(async (resolve, reject) =>{
        try{
            let authToken = await AsyncStorage.getItem("authToken")
            if(authToken === "" || authToken == null || authToken.length < 10){
                reject(RESPONSES.NOT_AUTHENTICATED)
            }else{
                let res = await axios({
                    method: 'POST',
                    url: BASE_URL + "/user_data",
                    data : {
                        userData
                    },
                    headers: {
                        'Authorization' : authToken
                    }
                })
                if(res.data.hasOwnProperty("errorStatus")){
                    if(res.data.errorStatus){
                        reject(res.data)
                    }
                }
                resolve(res.data)
            }
        }catch(e){
            console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim(), e)
        }
    })
}



export async function getPrimaryFieldType(primaryTF){
    return new Promise((resolve, reject) => {
        const emailExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const usernameExpression = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/
        if( emailExpression.test(primaryTF) ){
             resolve("email_address")
        }else if (usernameExpression.test(primaryTF)){
            resolve("username")
        }
        reject(RESPONSES.INVALID_PRIMARY_FIELD)
    })
    

}

export async function checkFields(primaryTF, passwordTF, primaryFieldType){
    return new Promise((resolve, reject) => {
        switch(primaryFieldType){
            case 'email_address': {
                if(primaryTF.length > 320 || passwordTF.length > 1000){
                    reject(RESPONSES.EMAIL_LOGIN_FAIL)
                }
                break;
            }
            case 'username' : {
                 if(primaryTF.length > USERNAME_MAX_LENGTH || passwordTF.length > 1000){
                    reject(RESPONSES.USERNAME_LOGIN_FAIL)
                }break;
            }
        }
        resolve(true)
    }) 
    
}


export async function logInUser(primaryTF, passwordTF, primaryFieldType){
    return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method : 'POST',
                url : BASE_URL + '/auth/login',
                data : {
                    primaryField: primaryTF,
                    password : passwordTF,
                    primaryFieldType: primaryFieldType
                }
            })
            console.log("login user:", res.data)
            if(res.data.hasOwnProperty("authToken")){
                resolve(res.data.authToken)
            }else if(res.data.hasOwnProperty("errorStatus")){
                reject(res.data)
            }
            reject(RESPONSES.ERR_SYSTEM)
        }catch(e){
            if(e.hasOwnProperty("errorStatus")){
                reject(e)
            }
            reject(RESPONSES.ERR_SYSTEM)
        }
    })
}



export function getPhoneVerifyCode(phoneExt, phone){
    return new Promise(async (resolve, reject) => {
        try{
            let res = await axios({
                method: 'GET',
                url : BASE_URL + '/service/phone/code',
                params : {
                    phoneExt,
                    phone
                }
            })
            console.log(res)
            resolve(res.data)
        }catch(e){
            console.log(e);
            reject(RESPONSES.ERR_SYSTEM)
        }
    })
}



export function parseKey(key){
        return JSON.parse(JSON.stringify(key))
    }


export function startNewUser(phone){
    return new Promise(async (resolve, reject) =>{
        try{
            let res = await axios({
                method : 'GET',
                url : BASE_URL + '/v2/new_user',
                params: {
                    phone : phone
                }
            })
        }catch(e){
            console.log(e);
            reject(RESPONSES.ERR_SYSTEM)
        }
    })
}