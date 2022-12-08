import { MessageStructure } from '../src/message-handler';
import SmartPostMessage from '../src/index';

const msgReqMethod = {
  sayHello: 'sayHello',
};

const msgNotifyMethod = {
  pwdChange: 'pwdChange',
};

const test = async () => {
  const iframe = document.createElement('iframe');

  iframe.src = '../iframe.html';

  document.body.appendChild(iframe);

  iframe.onload = async () => {

    const targetWindow = iframe.contentWindow;
    if (!targetWindow) {
      return null;
    }

    const smartPM = new SmartPostMessage({
      targetOrigin: '*',
      targetWindow,
      currentWindow: window,
    });

    smartPM.subscribe(msgNotifyMethod.pwdChange, (message: MessageStructure) => {
      console.log('🚀 ===== smartPM.subscribe ===== message', message);
    });

    console.log('resp start');
    const resp = await smartPM.request<{ content: string, from: string }>(msgReqMethod.sayHello, { name: 'yetao' })
    console.log(resp);
    alert(JSON.stringify(resp));
  }
}

test();

export { };
