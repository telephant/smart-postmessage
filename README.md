# Smart Postmesage
`smart postmessage` is a tool to help you make a connection with iframe through `postmessage`.

Simplified Communication
  
- **🍜 Allowing users to use requests as promises** makes it more user-friendly.
- **📡 Establishing secure communication channels** between parent and child windows, support to set timeout and retry gap.
- **📮 Request and Respond** for Method Invocation
- **📢 Subscribing to and notify events**.
- **✨ Clean and easy-to-use API**.

## Installation
via npm
```bash
  npm i smart-postmessage
```

via yarn
```bash
  yarn add smart-postmessage
```

## Usage

Initiate
```js
import SmartPostMessage, { MethodMap } from 'smart-post-message';

// Define the method map for observed and requested methods
interface ObservedMethods extends MethodMap {
  getData: (data: number) => number;
  userLoggedIn: () => boolean;
}

// Define the method map for notify and subscribe methods
interface NotifyMethods extends MethodMap {
  somebodyJoined: () => { userId: string };
}

// Create an instance of SmartPostMessage
// You can configure communication timeouts and retries
const smartPostMessage = new SmartPostMessage<NotifyMethods, ObservedMethods>({
  currentWindow: window,
  targetWindow: targetWindow,
  targetOrigin: 'https://example.com',
  establishTimeout: 30000,
  establishInterval: 3000,
});

// Establish a communication channel
await smartPostMessage.establish(true).then(() => {
}).catch(() => {
  // Communication failed
});

// Communication is established
// You can now send and receive messages
// ...
```


## Requester and Responder

Initiates communication with `smartPostMessage.request()`.
```js
// Trigger the 'userLoggedIn' event in the server window
await smartPostMessage.request('userLoggedIn'); // return boolean.

```
  
Listens and responds with `smartPostMessage.observe()`.
```js
// Observe an event (e.g., 'userLoggedIn')
smartPostMessage.observe('userLoggedIn', () => {
  // Handle the event (e.g., perform some action when a user logs in)
  return true;
});

```

## Notifying and Subscribing to Events

You can use the "notify" and "subscribe" pair for event notification:


Broadcast events using smartPostMessage.notify().
```js
// In the notifier window
smartPostMessage.notify('somebodyJoined', { userId: 'userA' });
```

Listen and react to events with smartPostMessage.subscribe().
```js
// In the subscriber window
const unsubscribe = smartPostMessage.subscribe('somebodyJoined', (data) => {
  // Handle the event data
  console.log(data);
  // { userId: 'userA' }
});

// Don't forget to unsubscribe when no longer needed
unsubscribe();
```

## Finish the communication
```js
smartPostMessage.finish();
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
