import React from 'react';
import { Button} from 'semantic-ui-react'
import { abi, contractAddress } from './abi';
import Game from './tictactoe'

const celer = require('celer-web-sdk');

const TIMEOUT = 20 * 1000
const account2 = '0xFdd84739339221cd7cDae571CcCBB58f96a899f1'
const account4 = '0x44f6e43Fb204A43fC4532b0B981ca34426B259E2'
const num = '1'

const player1 = new celer.Client('http://localhost:29979');
const player2 = new celer.Client('http://localhost:29980');

class Page3 extends React.Component {

  render() {
    return (
      <div style={{padding:40 }} >
        <Game player1={player1} player2={player2} address1={account2} address2={account4} />
      </div>
    );
  }
}

export default Page3;

