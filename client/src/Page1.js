/*
 Two possibilities
  i) return to page1 after google sign in without distroying state --> then move to page2
  ii) pass in a param into redirect url and move to page 2 directly 
*/


import React from 'react';
import web3Obj from './helper'
import ReactPlayer from 'react-player'
import { Button, Dimmer, Segment,Loader, } from 'semantic-ui-react'
import queryString from 'query-string'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from './firebase';

import './Page1.css';


let urls = ['https://www.youtube.com/watch?v=TAZYqXwW5lA',
              'https://vimeo.com/265363100',
              'https://vimeo.com/265363100'];

const x = Math.floor(Math.random() * urls.length);

const uiConfig = {
  
      signInFlow: 'popup',
      //signInSuccessUrl: '/page2/?adWalletAddress=' + this.state.adWalletAddress,
      signInSuccessUrl: '/page1/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
      }
    };

function Topbar(props) {
  return (
    <div style={{backgroundColor: '#282c34', height:100, textAlign:'center' }}>
      <h2 style={{padding:40, color:'white', fontSize:34}}>{props.title}</h2>
    </div>
  );
}


class Page1 extends React.Component {

  constructor(props) {
    super(props);

    const values = queryString.parse(this.props.location.search)

    this.state = {
      adWalletAddress: values.adWalletAddress,
      videoPlayed: false,
      gotLinks: false,
      active: false,
      isSignedIn: false, // Local signed-in state.
      apiResponse: "" 
    };

  }

  
  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  componentDidMount() {

      if(this.state.isSignedIn){
        console.log("Test Point 1: True");
      }
      else{
        console.log("Test Point 1: False");
      }


      this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
          (user) => this.setState({isSignedIn: !!user})
      );

      if(this.state.isSignedIn){
        console.log("Test Point 2: True");
      }
      else{
        console.log("Test Point 2: False");
      }

      const values = queryString.parse(this.props.location.search)
    
      var campaignRef = firebase.database().ref('adCampaigns/' + values.adWalletAddress);
      
      if(values.adWalletAddress == null ){
        campaignRef = firebase.database().ref('adCampaigns/0x619e4bc22CB5079D154640c1ba2fCC936A12606e');
      }
      
      

      campaignRef.once('value').then(function(snapshot) {
        // The first promise succeeded. Save snapshot for later.
        if ( snapshot.val().link1 != ""){
          urls[0] = snapshot.val().link1;
        }
        if ( snapshot.val().link2 != ""){
          urls[1] = snapshot.val().link2;
        }
        if ( snapshot.val().link3 != ""){
          urls[2] = snapshot.val().link3;
        }
         console.log(snapshot.val().link1);
         console.log(snapshot.val().link2);
         console.log(snapshot.val().link3);
        
        
      }).then(() => {
        this.setState({ gotLinks: true })
      }, function(error) {
        // Something went wrong.
        console.error(error);
      });

  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    

    const { active } = this.state

      if(!this.state.gotLinks ){
        return (
          <div >
            <Topbar title="Play Video to Earn $"/>
          </div>
        );
      }
      if(!this.state.videoPlayed ){
        return (
          <div >
            <Topbar title="Play & Earn $"/>

              <ReactPlayer
                url={ urls[x] } 
                playing
                width='100%'
                onEnded={() => {
                    console.log('onEnded')
                    this.setState({
                      videoPlayed: true
                    });
                  }}
              className="Player"  
              />
            
          </div>
        );
      }
      else{
        if(this.state.isSignedIn){
          console.log("Test Point 3: True");
          var user = firebase.auth().currentUser;
          var name, email, photoUrl, uid, emailVerified;

          if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                             // this value to authenticate with your backend server, if
                             // you have one. Use User.getToken() instead.
          }
          console.log(name);
          console.log(uid);
        }
        else{
          console.log("Test Point 3: False");
        }
        return (
          <div>
          <Dimmer.Dimmable as={Segment} blurring dimmed={active} style={{padding:0 }}>
          
            <Topbar title="Thanks!"/>
            
            <div style={{backgroundColor: '#282c34', height:100, textAlign:'center' }}>
              <h2 style={{padding:40, color:'white', fontSize:34}}>Claim $$</h2>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
             
          </Dimmer.Dimmable>
            
            
          <Dimmer active={this.state.active}>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          </div>
        );
      }
  }
}

export default Page1

