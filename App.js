import React, {Component} from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as theme } from '@eva-design/eva';
import AppNavigator from './js/navigation/AppNavigator'
import axios from 'axios';

import {LogBox} from 'react-native'
LogBox.ignoreAllLogs(true)

//background
/**
  //every 35 min
    
  
    //if authkey 
    //get latest_t_hash
      //if lastest_t_hash != t_hash 
      
      [update location]  // if allowed  currentLocation
        // set asyncstorage currentlocation
      // ------------
      // asyncget [currentlocation, t_hash, user.d_id, user.infection_prob]
      // post /update_inf_prob_location
 */




export default class App extends Component{
  constructor(props){
    super(props);

  }

  async componentDidMount(){

      //connect 
      //on latest_t_hash
     
      
      //if authkey
        // get user
        // get cur_t_hash
        
        //if lastest_t_hash != t_hash 
            //get currentlocation
           //send [d_id, infection_prob, latest_t_hash, currentLocation]
        //else if latest_t_hash == t_hash
            //nuthin from you.

        //emit ctos data { d_id, t_hash, infection_prob, get_userlocation }
        //set async storageuser location

        

  }

  render(){
    return (
       <React.Fragment>
                <ApplicationProvider mapping={mapping} theme={theme} >
                    <AppNavigator />
                </ApplicationProvider>
            </React.Fragment>
    )
  }

}


//on connect 
//get latest t_hash
//emit latest_t_hash
//

//on ctos
//put 



