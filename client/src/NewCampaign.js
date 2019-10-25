//lifecycle of this component
//1) mount
//2) check to make sure links are youtube or vimeo & submit links to firebase -->return success or failure
//3) if successfully submitted --> show address and promp to deposit eth
//    else --> tell user there was a problem and suggest they try again 
//4) if successfully deposited --> show user qrcode and download button

//check for success or failure most iportant 

import React from 'react';
import QRCode from 'qrcode.react';
import { Button, Input, Icon } from 'semantic-ui-react';
import { ethers } from 'ethers';
import './NewCampaign.css';
import firebase from './firebase';

//import ethers from 'ethers';

let provider = ethers.getDefaultProvider('ropsten');
let testWallet = '0x830c5D312D507DdB066192d34dD6441737e127C8';

class NewCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    accountEmpty: true,
    adWallet: ethers.Wallet.createRandom(),
    linksSubmitted: false,
    problemSubmitting: false,
    link1: '',
    link2: '',
    link3: ''
  };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);

  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }


  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async tick() {
    let wallet = new ethers.Wallet(this.state.adWallet.privateKey , provider);
    let balance = await wallet.getBalance();

    if (!balance.isZero()){

      this.setState({
          accountEmpty: false
      }, () => {
          //this.afterSetStateFinished();
      });
      clearInterval(this.timerID);

    }

  }

  handleChange1 = (event) => {
    this.setState({link1: event.target.value});
  }

  handleChange2 = (event) => {
    this.setState({link2: event.target.value});
  }
  handleChange3 = (event) => {
    this.setState({link3: event.target.value});
  }





  submitButton = () => {
    console.log( " QR code takes you to https://cryptoads-77142.firebaseapp.com/page1/?adWalletAddress=" + this.state.adWallet.address);
    this.uploadKeys();
    
  }
  

  uploadKeys = () => {

    firebase.database().ref('keypairs/' + this.state.adWallet.address).set({
        privateKey: this.state.adWallet.privateKey
    }).then(() => {
        console.log("Keys successfully written!");
        this.uploadLinks();
    })
    .catch(() => {
        this.setState({
            problemSubmitting: true 
        })
      }
    );

  }

  uploadLinks = () => {

    firebase.database().ref('adCampaigns/' + this.state.adWallet.address).set({
        link1: this.state.link1,
        link2: this.state.link2,
        link3: this.state.link3
    }).then(() => {
        console.log("Document successfully written!");
        this.setState({ linksSubmitted: true });
    })
    .catch(() => {
        this.setState({
            problemSubmitting: true 
        })
      }
    );
    

  }



  downloadQR = () => {
    const canvas = document.getElementById("123456");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "123456.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
  }

  render() {
    if(!this.state.linksSubmitted && !this.state.problemSubmitting){ 
      return (
        <div className="Campaign">
          <div>
            <h1> Create a New Ad Campaign </h1>
          </div>
          <div>
            <h2>Step1: Paste Links to Video Ads Below</h2>
          </div>
        <div>
            <Input focus  placeholder='Youtube or Vimeo Video Link ' value={this.state.link1} onChange={this.handleChange1}/>
          </div>
          <div>
            <Input focus   placeholder='Youtube or Vimeo Video Link ' value={this.state.link2} onChange={this.handleChange2}/>
          </div>
          <div>
            <Input focus  placeholder='Youtube or Vimeo Video Link ' value={this.state.link3} onChange={this.handleChange3}/>
          </div>
      
          <div>
            <Button onClick={this.submitButton} content='Submit Links' primary />
          </div>
          
        </div>
      );
    } 
    else if(!this.state.linksSubmitted && this.state.problemSubmitting){ 
      return (
        <div className="Campaign">
          <div>
            <h1> Oh no! Problem Uploading Links to Database! </h1>
          </div>
          <div>
            <h2>Please consider trying again later </h2>
          </div>
          
        </div>
      );
    }
    else if(this.state.accountEmpty){
      return (
        <div className="Campaign">
          <div>
            <h2>Step2: Deposit Ether in Your New Ad Account</h2>
          </div>
          <div>
            <h3>Send to this Address</h3>
          </div>
          <div>
            <h3> {this.state.adWallet.address}</h3>
          </div>
          <div>
            <Icon.Group size='huge'>
              <Icon loading size='big' name='circle notch' />
              <Icon name='download' />
            </Icon.Group>
            <h4>Awaiting Deposit</h4>
          </div>
        </div>
      );
    } 
    else{
      return (

        <div className="Campaign">
          <div>
            <h1> Success! Your add campaign is live! </h1>
          </div>
          <div>
            <h3> Users can scan the QR code below to view your ads and recieve crypto as paymet. </h3>
          </div>
          <div>
            <h3> Put this code on flyers, tshirts, buillbords ect! </h3>
          </div>
          <div>
            <QRCode
              id="123456"
              value= {"https://cryptoads-77142.firebaseapp.com/page1/?adWalletAddress=" + this.state.adWallet.address}
              size={290}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <div>
            <a onClick={this.downloadQR}> Download QR </a>
          </div>
        </div>
      );
    }   
  }
}

export default NewCampaign;