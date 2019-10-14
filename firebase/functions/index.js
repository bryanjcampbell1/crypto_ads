const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

var ethers = require('ethers');
let provider = ethers.getDefaultProvider('ropsten');

var publicKey = '0x7002c6A71E64ffb7C65b0f8643348860Bd673261';
var privateKey = '6b866d98d0312d1460ebacda6cdb0166ad9ab9bcbbf0e1891e5d709748713627';
var wallet = new ethers.Wallet(privateKey,provider);



exports.payout = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

  	let clientWallet = req.query.ClientWalletAddress;

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

  });
});

/*
import * as cors from 'cors';
const corsHandler = cors({origin: true});

export const pingFunctionWithCorsAllowed = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    response.send(`Ping from Firebase (with CORS handling)! ${new Date().toISOString()}`);
  });
});





// The Firebase Admin SDK to access the Firebase Realtime Database.



exports.payout = functions.https.onRequest(async (req, res) => {


	let clientWallet = req.query.ClientWalletAddress;

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

  }

);

*/
