import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

async function getPaymentMethods(formData) {
    try {

        const response = await fetch('/api/paymentMethods', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ ...formData }),
        });

        return response.json();

    } catch (e) {
        console.error(e);
    }
}

async function initDropIn(form) {
    try {

        const paymentMethodsResponse = await getPaymentMethods(form);
        const clientKey = paymentMethodsResponse.clientKey;
        const paymentMethods = paymentMethodsResponse.response;

        const config = {
            paymentMethodsResponse: paymentMethods,
            clientKey: clientKey,
            locale: "en_US",
            environment: "test",
            onSubmit: (state, dropin) => {
                if (state.isValid) {
                    state.data.formData = { ...form };
                    initiatePayment(state, dropin, "/api/paymentRequest");
                }
            },
            onAdditionalDetails: (state, dropin) => {
                console.log('additional');
                additionalDetails(state, dropin, "/api/submitAdditionalDetails");
            },
            amount: { value: form.payment_amount * 100, currency: form.country },
            paymentMethodsConfiguration: {
                card: {
                    hasHolderName: true,
                    holderNameRequired: true,
                    name: 'Credit or debit card',
                    billingAddressRequired: true
                }
            }
        };

        const checkout = new AdyenCheckout(config);
        checkout.create("dropin").mount(document.getElementById("dropin-container"));
    } catch (error) {
        console.error(error);
    }
}

async function initiatePayment(state, dropin) {
    try {
        const response = await fetch('/api/paymentRequest', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(state.data),
        });
        const result = await response.json();
        handleServerResponse(result, dropin);

    } catch (error) {
        console.error(error);
    }
}

async function additionalDetails(state, dropin) {
    try {
        
        const response = await fetch('/api/submitAdditionalDetails', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(state.data),
        });
        const result = await response.json();
        handleServerResponse(result, dropin);

    } catch (error) {
        console.error(error);
    }
}

function handleServerResponse(response, dropin) {

    if (response.action) {
        dropin.handleAction(response.action);
    } else {
        console.log(response.resultCode);
        
        switch (response.resultCode) {
            case 'Authorised':
                window.location.href = "/success";
                break;
            default:
                window.location.href = "/error";
                break;
        }
    }
}

export default initDropIn;