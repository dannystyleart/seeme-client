# seeme-client
A nodejs client library for SMS gateway provided by [seeme.hu][seeme-link-site]

## Prerequisite & Installing
To use the SMS Gateway service you must have an API key that can be generated at the [Gateway settings page][seeme-link-api-settings]

Module can be installed via npm
```bash
npm install seeme-client
```
or via yarn
```bash
yarn add seeme-client
```
### Using the client
The client can be created by passing the SeeMeClientOptions to the exported createClient function
 
#### ES6
```javascript
const { createClient } = require('../lib');

const options = {
  apiKey: '<your-api-key>'
};

// Creating the client
const seeMeClient = createClient(options);

// Getting account balance
seeMeClient.getBalance()
  .then(console.log)
  .catch(console.error)

// Setting whitelisted IP address
seeMeClient.setIP('255.255.255')
  .then(console.log)
  .catch(console.error)
```

#### Typescript
```typescript
import { createClient, SeeMeClientOptions, SeeMeClient } from 'seeme-client';

const options: SeeMeClientOptions = {
    apiKey: '<your-api-key>'
}

// Creating the client
const seeMeClient: SeeMeClient = createClient(options);

// Getting account balance
const balanceResult = await seeMeClient.getBalance();

// Setting whitelisted IP address
const setIpResult = await seeMeClient.setIP('255.255.255');
```

### Source
You can build the project via
```bash
npm run build
```

Tests can be ran via
```bash
npm run test
```

### Disclosure
This is not an official client application / sdk for the services provided by [seeme.hu][seeme-link-site]
therefore it is not guaranteed to consume the SMS Gateway api correctly by the time of use.
The library was created using publicly available documentation at the time of development.

[seeme-link-site]: https://seeme.hu
[seeme-link-api-settings]: https://seeme.hu/sms-gateway-beallitasok
