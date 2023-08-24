import { generateUniqueId } from './utils';

export enum MessageType {
  Req = 'Req',
  Resp = 'Resp',
  RespError = 'RespError',
  Notify = 'Notify',
}

export interface MessageStructure<T = any> {
  msgId: string;
  method: string;
  data: T;
  error?: any,
  type: MessageType;
  pathname: string;
}

export default class MessageHandler {
  static createReq<T>(method: string, params: T | null) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Req,
      pathname: location.pathname
    };
  }

  static createResp(method: string, msgId: string, params: any) {
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Resp,
      pathname: location.pathname
    };
  }

  static createRespError(method: string, msgId: string, error: any) {
    return {
      msgId,
      method,
      data: {},
      error,
      type: MessageType.RespError,
      pathname: location.pathname
    };
  }

  static createNotify<T>(method: string, params: T | null) {
    const msgId = generateUniqueId(16);
    return {
      msgId,
      method,
      data: params,
      type: MessageType.Notify,
      pathname: location.pathname
    };
  }
}
