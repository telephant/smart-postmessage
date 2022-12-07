import { generateUniqueId } from './utils';
import { MessageMethod } from './message-method';

export enum MessageType {
  Req = 'Req',
  Resp = 'Resp',
  Notify = 'Notify',
}

export interface MessageStructure {
  msgId: string;
  method: MessageMethod;
  data: any;
  type: MessageType;
}

export default class MessageHandler {
  static createReq(method: MessageMethod, params: any) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Req,
    };
  }

  static createResp(method: MessageMethod, msgId: string, params: any) {
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Resp,
    };
  }

  static createNotify(method: MessageMethod, params: any) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Notify,
    };
  }
}
