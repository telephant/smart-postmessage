import { MessageStructure } from '../src/message-handler';
import SmartPostMessage from '../src/index';
import { MessageMethod } from '../src/message-method';

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

    smartPM.subscribe(MessageMethod.pwdChange, (message: MessageStructure) => {
      console.log('🚀 ===== smartPM.subscribe ===== message', message);
    });

    console.log('resp start');
    const resp = await smartPM.request<{ content: string, from: string }>(MessageMethod.sayHello, { name: 'yetao' })
    console.log(resp);
    alert(JSON.stringify(resp));
  }
}

test();

export {};
