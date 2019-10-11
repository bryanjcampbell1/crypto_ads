import React from 'react';
import QRCode from 'qrcode.react';
import { Button, Input, Icon } from 'semantic-ui-react';
import { ethers } from 'ethers';
import './NewCampaign.css';

let provider = ethers.getDefaultProvider('ropsten');

class NewCampaign extends React.Component {
  state = {
    accountEmpty: true,
    adWallet: ethers.Wallet.createRandom(),
    linksSubmitted: false,
    timeSinceDeposit: 0
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

    if (balance.isZero()){
  
    }
    else if(this.state.timeSinceDeposit < 3){

      this.setState({ accountEmpty: false, 
                      timeSinceDeposit: this.state.timeSinceDeposit + 1  
      });

    }
    else{

      console.log(this.state.timeSinceDeposit);
      clearInterval(this.timerID);
    }


  }


  submitButton = () => {
    
    console.log('send links to db');

    //if db returns success
    this.setState({ linksSubmitted: true });
    
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
    if(!this.state.linksSubmitted){
      return (
        <div className="Campaign">
          <div>
            <h1> Create a New Ad Campaign </h1>
          </div>
          <div>
            <h2>Step1: Paste Links to Video Ads Below</h2>
          </div>
          <div>
            <Input focus  placeholder='Youtube or Vimeo Video Link ' />
          </div>
          <div>
            <Input focus   placeholder='Youtube or Vimeo Video Link ' />
          </div>
          <div>
            <Input focus  placeholder='Youtube or Vimeo Video Link ' />
          </div>
          <div>
            <Button onClick={this.submitButton} content='Submit Links' primary />
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