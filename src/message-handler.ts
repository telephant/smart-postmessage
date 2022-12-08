import { generateUniqueId } from './utils';

export enum MessageType {
  Req = 'Req',
  Resp = 'Resp',
  Notify = 'Notify',
}

export interface MessageStructure {
  msgId: string;
  method: string;
  data: any;
  type: MessageType;
}

export default class MessageHandler {
  static createReq(method: string, params: any) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Req,
    };
  }

  static createResp(method: string, msgId: string, params: any) {
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Resp,
    };
  }

  static createNotify(method: string, params: any) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Notify,
    };
  }
}
