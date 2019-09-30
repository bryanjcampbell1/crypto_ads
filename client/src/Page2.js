
import React from 'react';
import { Button} from 'semantic-ui-react'


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


