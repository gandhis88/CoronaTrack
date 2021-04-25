
export const BASE_URL = "https://truffen.com/api"

export const MAPBOX_TOKEN_1 = "pk.eyJ1IjoiaGFycnl5ZWFoc291cCIsImEiOiJjaWpqdjFxejEwMnh1dGRtNW1wcjQxaWRjIn0.D8BseQvXwjLKLw-F--9vTQ"

export const GOOGLE_API_KEY = "AIzaSyAC71s6Hqpftux1khU_-r5h2o-yhjINpGg"

export const RESPONSES = {
    ERR_SYSTEM: {
        errorStatus : true, 
        errorCode: "ERROR/ERR_SYSTEM",
        errorMessage: 'Something went wrong! '
    },
    EMAIL_LENGTH: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_LENGTH',
        errorMessage: 'Please enter a valid email address.'
    },
    EMAIL_FORMAT: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_FORMAT',
        errorMessage: 'Please enter a valid email address.'
    },
    SUCCESS: {
        errorStatus: false,
        errorCode: "",
        errorMessage: ""
    },
    EMAIL_EXISTS: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_EXISTS',
        errorMessage: 'A user with this email already exists.'
    },
    ERR_CONNECTION: {
        errorStatus: true,
        errorCode: "ERROR/ERR_CONNECTION",
        errorMessage: "Can't connect to the server."
    },
    NAME_INVALID: {
        errorStatus: true,
        errorCode: "ERROR/NAME_INVALID",
        errorMessage: "Please enter a valid name"
    },
    PASSWORD_LENGTH: {
        errorStatus: true,
        errorCode: "ERROR/PASSWORD_LENGTH",
        errorMessage: "Password must be minimum 8 characters long."
    },
    NAME_REQ_FIELDS : {
        errorStatus: true,
        errorCode : 'ERROR/NAME_REQ_FIELDS',
        errorMessage: "Name and username are required."
    },
    NOT_AUTHENTICATED: {
        errorStatus: true,
        errorCode : 'ERROR/NOT_AUTHENTICATED',
        errorMessage: 'User is not authenticated. Please log in again.'
    },
    NAME_LENGTH :{
        errorStatus :true,
        errorCode: 'ERROR/NAME_LENGTH',
        errorMessage: 'Please enter a valid name.'
    },
    PROFILE_PIC_NOT_SEL :{
        errorStatus :true,
        errorCode: 'ERROR/PROFILE_PIC_NOT_SEL',
        errorMessage: 'You must select a profile picture.'
    },
    USERNAME_LENGTH : {
        errorStatus:true,
        errorCode: 'ERROR/USERNAME_LENGTH',
        errorMessage: 'Username must be 2-15 characters long.'

    },
     'USERNAME_FORMAT' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_FORMAT',
        errorMessage : 'Username can only contain . _ as special characters and cannot begin or end with `.` '
    },
    USER_DESC_LENGTH : {
        errorStatus :true,
        errorCode: 'ERROR/USER_DESC_LENGTH',
        errorMessage: 'Description can only be 150 characters long.'
    },
    INVALID_PRIMARY_FIELD : {
      errorStatus :true,
        errorCode: 'ERROR/INVALID_PRIMARY_FIELD',
        errorMessage: 'Please enter a valid Email Address/Username'  
    },
    EMAIL_LOGIN_FAIL: {
        errorStatus :true,
        errorCode: 'ERROR/EMAIL_LOGIN_FAIL',
        errorMessage :"The email and password you entered did not match our records. Please try again."
    },
    USERNAME_LOGIN_FAIL : {
        errorStatus :true,
        errorCode: 'ERROR/USERNAME_LOGIN_FAIL',
        errorMessage :"The username and password you entered did not match our records. Please try again."
    },
    PHONE_INVALID:{
        errorStatus :true,
        errorCode: 'ERROR/PHONE_INVALID',
        errorMessage :"Please enter a valid phone number."
    },
    INCORRECT_CODE :{
        errorStatus: true, 
        errorCode: 'ERROR/INCORRECT_CODE',
        errorMessage: "Invalid code."
    },
    AGE_INVALID : {
        errorStatus: true, 
        errorCode: 'ERROR/AGE_INVALID',
        errorMessage: "Please enter a valid age."
    },
    GENDER_INVALID: {
         errorStatus: true, 
        errorCode: 'ERROR/GENDER_INVALID',
        errorMessage: "Please select your gender."
    },
    LOCATION_ACCESS_ERROR:{
        errorStatus:true,
        errorCode: 'ERROR/LOCATION_ACCESS_ERROR',
        errorMessage: "You must set location access to \"Always\" "
    },
    USER_AUTH_ERROR:{
         errorStatus:true,
        errorCode: 'ERROR/USER_AUTH_ERROR',
        errorMessage: "Please try again. Session Error."
    },
    COULDNT_FETCH_RESULTS:{
         errorStatus:true,
        errorCode: 'ERROR/COULDNT_FETCH_RESULTS',
        errorMessage: "Couldn\'t fetch search results."
    }

}




