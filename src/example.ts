import { MessageStructure } from './message-handler';
import SmartPostMessage from './index';
import { MessageMethod } from './message-method';

const test = async () => {
  const iframe1 = document.createElement('iframe');
  const iframe2 = document.createElement('iframe');
  const targetWindow1 = iframe1.contentWindow;
  const targetWindow2 = iframe2.contentWindow;
  if (!targetWindow1 || !targetWindow2) {
    return null;
  }

  const smartPM1 = new SmartPostMessage({
    targetOrigin: '*',
    targetWindow: targetWindow1,
  });

  smartPM1.observe(MessageMethod.sayHello, (message: MessageStructure) => {
    const newObj = {
      content: `hello, ${message.data}!`,
      from: 'user 1',
    };
    return newObj;
  });

  const smartPM2 = new SmartPostMessage({
    targetOrigin: '*',
    targetWindow: targetWindow1,
  });
  const resp = await smartPM2.request<{ content: string, from: string }>(MessageMethod.sayHello, { name: 'yetao' })
  console.log(resp);
  alert(resp);
}

export {};
