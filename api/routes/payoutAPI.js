var express = require('express')
var router = express.Router();


var ethers = require('ethers');
let provider = ethers.getDefaultProvider('ropsten');

//random pk hard coded for now
//this would be the pk for the advertisors account
//obviously need to find a way to protect this


var publicKey = '0x7002c6A71E64ffb7C65b0f8643348860Bd673261';
var privateKey = '6b866d98d0312d1460ebacda6cdb0166ad9ab9bcbbf0e1891e5d709748713627';
var wallet = new ethers.Wallet(privateKey,provider);

router.get('/:ClientWalletAddress', function (req, res) {

	console.log(req.params.ClientWalletAddress);

	let clientWallet = req.params.ClientWalletAddress;

	let amount = ethers.utils.parseEther('1.0');

	let tx = {
	    to: String(clientWallet) ,
	    value: amount
	};

	let sendPromise = wallet.sendTransaction(tx);

	sendPromise.then((tx) => {
	    console.log(tx);
	});

  res.send('Success')
})

module.exports = router;