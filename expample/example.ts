import { MessageStructure } from '../src/message-handler';
import SmartPostMessage from '../src/index';
import {
  MsgReqMethod,
  MsgNotifyMethod,
} from '../src/message-method';

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

    smartPM.subscribe(MsgNotifyMethod.pwdChange, (message: MessageStructure) => {
      console.log('🚀 ===== smartPM.subscribe ===== message', message);
    });

    console.log('resp start');
    const resp = await smartPM.request<{ content: string, from: string }>(MsgReqMethod.sayHello, { name: 'yetao' })
    console.log(resp);
    alert(JSON.stringify(resp));
  }
}

test();

export {};
