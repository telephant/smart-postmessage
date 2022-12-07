import { generateUniqueId } from './utils';
import {
  MsgReqMethod,
  MsgNotifyMethod,
} from './message-method';

export enum MessageType {
  Req = 'Req',
  Resp = 'Resp',
  Notify = 'Notify',
}

export interface MessageStructure<M = MsgReqMethod | MsgNotifyMethod> {
  msgId: string;
  method: M;
  data: any;
  type: MessageType;
}

export default class MessageHandler {
  static createReq(method: MsgReqMethod, params: any) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Req,
    };
  }

  static createResp(method: MsgReqMethod, msgId: string, params: any) {
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Resp,
    };
  }

  static createNotify(method: MsgNotifyMethod, params: any) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Notify,
    };
  }
}
