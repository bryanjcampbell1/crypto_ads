import React from 'react';
import web3Obj from './helper'
import ReactPlayer from 'react-player'
import { Button, Dimmer, Segment,Loader, } from 'semantic-ui-react'
import queryString from 'query-string'

import './Page1.css';


//could query for this list

const urls = [/*'https://www.youtube.com/watch?v=TAZYqXwW5lA',*/
              'https://vimeo.com/265363100'];

const x = Math.floor(Math.random() * urls.length);

function Topbar(props) {
  return (
    <div style={{backgroundColor: '#282c34', height:100, textAlign:'center' }}>
      <h2 style={{padding:40, color:'white', fontSize:34}}>{props.title}</h2>
    </div>
  );
}


class Page1 extends React.Component {

  state = {
    account: '',
    balance: '',
    videoPlayed: false,
    active: false,
    apiResponse: "" 
  }

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    console.log("adWalletAddress")
    console.log(values.adWalletAddress)
    
    const isTorus = sessionStorage.getItem('pageUsingTorus')


    if (isTorus) {
      web3Obj.initialize().then(() => {
        this.setStateInfo()
      })
    }
  }

  callAPI() {

    let fetchStringWithWalletAddress = "http://localhost:9000/payoutAPI/" + this.state.account;

      //fetch("http://localhost:9000/testAPI")
      fetch(fetchStringWithWalletAddress)
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }))
          .then(res => console.log(this.state.apiResponse))
          .then(  () => {
            if(this.state.apiResponse === "Success"){
              this.props.history.push('/page2/')
            }
          });
  }

  setStateInfo = () => {
    
    web3Obj.web3.eth.getAccounts().then(accounts => {
      this.setState({ account: accounts[0] })
      web3Obj.web3.eth.getBalance(accounts[0]).then(balance => {
        this.setState({ balance: balance })
        if(this.state.videoPlayed){
          this.callAPI();
          //this.props.history.push('/page2/')
        }
      })
    })
  }

  enableTorus = async () => {
    this.handleShow()
    try {
      await web3Obj.initialize()
      this.setStateInfo()
    } catch (error) {
      console.error(error)
    }
  }

  render() {

    const { active } = this.state

      if(!this.state.videoPlayed){
        return (
          <div >
            <Topbar title="Play Video to Earn $"/>
            

          {/* Need to modify react player.  Some mobile browser will require a click to play.  T
          This will be impossible because click events have been dissabled.

            Need to fix by adding a videoHasStarted function which disables clicking events
           */}

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
            
            <div style={{backgroundColor: '#282c34', height:150, textAlign:'center' }}></div>
          </div>
        );
      }
      else{
        return (
          <div>
          <Dimmer.Dimmable as={Segment} blurring dimmed={active} style={{padding:0 }}>
          
            <Topbar title="Thanks for Watching!"/>

            
                <ReactPlayer
                  url={ urls[x] } 
                  width='100%'
                  style={{pointeEvents: 'none'}}
                />
              
              
            <div style={{padding:40, backgroundColor: '#282c34', height:150, textAlign:'center' }}>
              <Button  color='violet' size='huge' onClick={this.enableTorus}>Get Payout with Tourus!</Button>
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

