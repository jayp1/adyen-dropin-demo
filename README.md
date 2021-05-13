# Adyen web dropin integration
This repository includes an example Adyen web dropin integration using an Express server and React client. This is a basic demonstration of a checkout experience.

## Requirements
Node.js 8+

## Installation

1. Clone this repo:

```
git clone https://github.com/jayp1/adyen-dropin-demo.git
```

2. Navigate to the root directory and install dependencies for the server and client:

```
npm run install-dependencies
```

## Usage

1. Create a `./.env` file and add the following environment variables:

```
API_KEY="your_API_key_here"
MERCHANT_ACC="your_merchant_account_here"
CLIENT_KEY="your_client_key_here"
```

2. Build & Start the server:

This will create a React production build and start the express server

```
npm run start
```

3. Visit [http://localhost:8000/](http://localhost:8000/).

To try out integrations with test card numbers and payment method details, see [Test card numbers](https://docs.adyen.com/development-resources/test-cards/test-card-numbers).

## Contributing

We commit all our new features directly into our GitHub repository. Feel free to request or suggest new features or code changes yourself as well!
