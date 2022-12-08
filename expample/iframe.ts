import { MessageStructure } from '../src/message-handler';
import SmartPostMessage from '../src/index';

const msgReqMethod = {
  sayHello: 'sayHello',
};

const msgNotifyMethod = {
  pwdChange: 'pwdChange',
};

const init = async () => {
  if (!window.parent.window) {
    return null;
  }

  const smartPM = new SmartPostMessage({
    targetOrigin: '*',
    targetWindow: window.parent.window,
    currentWindow: window,
  });

  smartPM.observe(msgReqMethod.sayHello, (message: MessageStructure) => {
    const newObj = {
      content: `hello, ${message.data.name}!`,
      from: 'user 1',
      msg: 'I am iframe',
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {

      }, 5000);
    });
  });

  setTimeout(() => {
    smartPM.notify(msgNotifyMethod.pwdChange, { newPwd: 'new111' });
  }, 3000);
}

init();

export { };
