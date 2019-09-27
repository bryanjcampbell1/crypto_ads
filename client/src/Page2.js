
import React from 'react';
import { Button} from 'semantic-ui-react'
import { abi, contractAddress } from './abi';
const celer = require('celer-web-sdk');

const TIMEOUT = 20 * 1000
const account2 = '0xFdd84739339221cd7cDae571CcCBB58f96a899f1'
const account4 = '0x44f6e43Fb204A43fC4532b0B981ca34426B259E2'
const num = '1'

const player1 = new celer.Client('http://localhost:29979');
const player2 = new celer.Client('http://localhost:29980');


class Page2 extends React.Component {
  state = {
    account: '',
    balance: '',
  }

  componentDidMount() {

  }

  handleClick1 = () => {
    this.props.history.push('/')
    
  }

  handleClick2 = () => {
    
    
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
          <div style={{padding:40 }} >
            <Game player1={player1} player2={player2} address1={account2} address2={account4} />
          </div>
      </div>
    );
  }
}

export default Page2;


