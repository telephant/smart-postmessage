import { generateUniqueId } from './utils';
import { MessageMethod } from './message-method';

export enum MessageType {
  Req,
  Resp,
  Notify,
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

  static createNotification(method: MessageMethod, msgId: string, params: any) {
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Resp,
    };
  }
}
