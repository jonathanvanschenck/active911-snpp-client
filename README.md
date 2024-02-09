# active911-snpp-client
A simple SNPP Client for [Active911](https://active911.com/) Alert Generation

Get it now on npm!
```bash
npm install active911-snpp-client
```

## Basic Usage
```js
const { Alert } = require("active911-snpp-client");

// Create a new alert, using CADPage format (see below)
const alert = new Alert({
    call: "Car Crash",
    place: "Burgerville",
    address: "123 N 1st ST",
    city: "Pleasentville",
    priority: "HIGH",
    timeout: 10*1000, // 10 seconds
});

// Attach some non-CAD meta data
alert.set("META_DATA_FIELD_1", "More data")
alert.set("META_DATA_FIELD_2", "Even more data")

// Send the alert
await alert.send({
    host: "snpp.active911.com",
    port: 444,
    pager_id: `1234-abCdeAF`, // example only, this should be your custom alert email address; see below
})
```

## Active911 Reference
Active911's documentation for using SNPP [can be found here](https://active911.atlassian.net/wiki/spaces/AED/pages/259784881/Sending+call+data+to+Active911+using+SNPP).

Active911's documentation on messaging format [can be found here](https://active911.atlassian.net/wiki/spaces/AED/pages/160956457/Setting+up+Messaging+Formats).
