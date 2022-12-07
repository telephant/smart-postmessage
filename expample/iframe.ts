import { MessageStructure } from '../src/message-handler';
import SmartPostMessage from '../src/index';
import { MessageMethod } from '../src/message-method';

const init = async () => {
  if (!window.parent.window) {
    return null;
  }

  const smartPM = new SmartPostMessage({
    targetOrigin: '*',
    targetWindow: window.parent.window,
    currentWindow: window,
  });

  smartPM.observe(MessageMethod.sayHello, (message: MessageStructure) => {
    const newObj = {
      content: `hello, ${message.data.name}!`,
      from: 'user 1',
      msg: 'I am iframe',
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {

      }, 5000);
    });
    return newObj;
  });

  setTimeout(() => {
    smartPM.notify(MessageMethod.pwdChange, { newPwd: 'new111' });
  }, 3000);
}

init();

export { };