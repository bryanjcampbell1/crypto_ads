
import React from 'react';
import { Button} from 'semantic-ui-react'
import queryString from 'query-string'



/*

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


*/


class Page2 extends React.Component {

  constructor(props) {
    super(props);

    const values = queryString.parse(this.props.location.search);

    this.state = {
      adWalletAddress: values.adWalletAddress,
      account: '', 
      balance: '',
      apiResponse: "" 
    };

  }

  componentDidMount() {
    //this.loadUserWallet();
    const values = queryString.parse(this.props.location.search)

    //task 1 --> get ad wallet 
    //task 2 --> get user id 


  }

  callAPI() {
    const values = queryString.parse(this.props.location.search)

    let fetchStringWithWalletAddress = "https://us-central1-cryptoads-77142.cloudfunctions.net/payout2?ClientWalletAddress=" + this.state.account + "&AdWalletPublic=" + values.adWalletAddress;

    if(values.adWalletAddress == null ){
        fetchStringWithWalletAddress = "https://us-central1-cryptoads-77142.cloudfunctions.net/payout2?ClientWalletAddress=" + this.state.account + "&AdWalletPublic=0x619e4bc22CB5079D154640c1ba2fCC936A12606e";
      }

    fetch(fetchStringWithWalletAddress)
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }))
        .then(res => console.log(this.state.apiResponse))
        .then(  () => {
          if(this.state.apiResponse === "Success"){
            
          }
        });
  }

  loadUserWallet = async () => {
    
   //test account 
   await this.setState({ account: '0x830c5D312D507DdB066192d34dD6441737e127C8' });
   this.callAPI();
      
  }


  handleClick1 = () => {
    this.props.history.push('/page1/')
    
  }

  handleClick2 = () => {
    this.props.history.push('/page3/')
    
  }

  render() {
    return (
      <div style={{backgroundColor: '#282c34', height:100, textAlign:'center' }}>
        <h2 style={{padding:40, color:'white', fontSize:34}}>Congrats!</h2>
        <h2 style={{padding:40,  fontSize:30}}>$0.10 in ETH has been added to your account</h2>
        <div style={{padding:40 }} >
         <Button style={{ width: '50%'}} color='violet' size='huge' onClick={this.handleClick1}>Watch More Videos !</Button>
        </div>
        <div style={{padding:40 }} >
         <Button style={{ width: '50%'}} color='violet' size='huge' onClick={this.handleClick2}>Use $$ To Play Games!</Button>
        </div>
      </div>
    );
  }
}

export default Page2;


