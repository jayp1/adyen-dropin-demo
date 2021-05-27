require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const uuid = require('uuid');

const app = express();

//Parses json payloads into an object.
app.use(express.json());
//Parses urlencoded payloads - Strings and arrays.
app.use(express.urlencoded());

if (process.env.NODE_ENV !== 'dev') {
    app.use(express.static(path.join(__dirname, "checkout-client/build")));
}

console.log("Environment: " + process.env.NODE_ENV);


/* ##########################
    
   Adyen API Request Methods

   ########################## 
*/

//Request available payment methods from Adyen.
async function paymentMethods(formData) {
    const response = await axios({
        method: 'POST',
        url: 'https://checkout-test.adyen.com/v66/paymentMethods',
        headers: {
            "X-API-Key": process.env.API_KEY,
            "Content-type": "application/json"
        },
        data: {
            "merchantAccount": process.env.MERCHANT_ACC,
            "channel": 'Web',
            "additionalData": { "allow3DS2": true, "executeThreeD": true },
            "amount": { currency: formData.country, value: formData.payment_amount * 100 },
        },
    });
    
    return response.data;
};

//Need to store payment data - (Usually this would be the DB)
const paymentData = {};

// Initiate a payment request to Adyen
const paymentRequest = async (data) => {

    const formData = { ...data.formData };

    const response = await axios({
        method: 'POST',
        url: 'https://checkout-test.adyen.com/v66/payments',
        headers: {
            "X-API-Key": process.env.API_KEY,
            "Content-type": "application/json"
        },
        data: {
            "merchantAccount": process.env.MERCHANT_ACC,
            "amount": { currency: formData.country, value: formData.payment_amount * 100 },
            "reference": data.payment_ref,
            "paymentMethod": data.paymentMethod,
            "returnUrl": `http:localhost:8000/api/handleRedirect?orderRef=${data.payment_ref}`,
            "channel": "Web",
            "browserInfo": data.browserInfo,
            "origin": `http://localhost:8000`,
            "shopperEmail": formData.email,
        },
    });
    
    
    return response.data;
}

/* End of Adyen API REQUEST METHODS */


/*  #####################################
    
    Start - Internal API Request Handlers 

    ##################################### 
*/

// Return to client all available payment methods.
app.post('/api/paymentMethods', async (req, res, next) => {
    try {
        const paymentMethod = await paymentMethods(req.body);
        const response = { response: paymentMethod, clientKey: process.env.CLIENT_KEY };
        res.send(response);
    } catch (err) {

        console.error(err);
    }
});

/**
 * Make Adyen payment request with state.data
 */
app.post('/api/paymentRequest', async (req, res) => {

    try {
        const payment_ref = uuid.v1();
        req.body['payment_ref']= payment_ref;
        
        const paymentResponse = await paymentRequest(req.body);

        // If action is redirect then store the paymentData in the data store.
        if (paymentResponse.action) {

            if (paymentResponse.action.type === 'redirect') {
                paymentData[payment_ref] = paymentResponse.action.paymentData;
            }
        }

        res.send({ resultCode: paymentResponse.resultCode, action: paymentResponse.action })
    
    } catch (error) {
        console.error(error.response);

    }
});

/**
     * Make an Adyen Request for additional payment details.
     * More info on Adyen documentation.
*/

app.all('/api/handleRedirect', async (req, res) => {
    const payload = {};
    payload["details"] = req.method === 'GET' ? req.query : req.body;

    const orderRef = req.query.orderRef;
    payload["paymentData"] = paymentData[orderRef];
    delete payload.details["orderRef"];
    delete paymentData[orderRef];

    try {
        const response = await axios({
            method: 'POST',
            url: "https://checkout-test.adyen.com/v66/payments/details",
            headers: {
                "X-API-Key": process.env.API_KEY,
                "Content-type": "application/json"
            },
            data: payload,
        });
        console.log(response.data);
        
        switch (response.data.resultCode) {
            case 'Authorised':
                res.redirect('http://localhost:8000/success');
                break;
            /* Handle cases --
            case 'Pending':
            case 'Received':
                res.redirect('http://localhost:3000/received');
                break;
            case 'Refused':
                res.redirect('http://localhost:3000/refused');
                break;*/
            default:
                res.redirect('http://localhost:8000/error');
                return;
        }


    } catch (error) {
        console.error(error.response.data);

    }
});

/**
 * Submit additional details if required by front-end state.
 */
app.post('/api/submitAdditionalDetails', async (req, res) => {
    const payload = {};

    payload["details"] = req.body.details;
    payload["paymentData"] = req.body.paymentData;

    try {
        const response = await axios({
            method: 'POST',
            url: "https://checkout-test.adyen.com/v66/payments/details",
            headers: {
                "X-API-Key": process.env.API_KEY,
                "Content-type": "application/json"
            },
            data: payload,
        });

        let resultCode = response.resultCode;
        let action = response.action || null;

        res.send({ resultCode, action });

    } catch (error) {
        console.error(error);
    }
});

if (process.NODE_ENV !== 'dev') {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "checkout-client/build", "index.html"));
    });

}


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on port : ${PORT}`));