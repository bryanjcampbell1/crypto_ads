const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();
var db = admin.database();


var ethers = require('ethers');
let provider = ethers.getDefaultProvider('ropsten');

exports.payout2 = functions.https.onRequest((req, res) => {
cors(req, res, () => {

	let clientWallet = req.query.ClientWalletAddress;
  	let adWalletPublic = req.query.AdWalletPublic;

  	//let testWallet = '0x830c5D312D507DdB066192d34dD6441737e127C8';
    //let testAdWallet = '0x41C28B83D860119c1e0a4e38938C5Ee4F1348363';

    var ref = db.ref('keypairs/' + adWalletPublic);
    //var ref = db.ref('keypairs/' + testAdWallet);

    ref.on("value", function(snapshot) {
      	console.log(snapshot.val().privateKey);

    
        var wallet = new ethers.Wallet(snapshot.val().privateKey,provider);

        let amount = ethers.utils.parseEther('1.0');

        let tx = {
          to: String(clientWallet) ,
          //to: testWallet,
          value: amount
        };

        let sendPromise = wallet.sendTransaction(tx);

        sendPromise.then((tx) => {
          console.log(tx);
        }).then(() => {
          console.log("here3");
          //res.send('Success');
        });

		//res.send('Success');

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });



	 //console.log('yo');
     res.status(200).send('Success');
   })
});

