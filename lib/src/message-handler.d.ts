import { MsgReqMethod, MsgNotifyMethod } from './message-method';
export declare enum MessageType {
    Req = "Req",
    Resp = "Resp",
    Notify = "Notify"
}
export interface MessageStructure<M = MsgReqMethod | MsgNotifyMethod> {
    msgId: string;
    method: M;
    data: any;
    type: MessageType;
}
export default class MessageHandler {
    static createReq(method: MsgReqMethod, params: any): {
        msgId: string;
        method: MsgReqMethod;
        data: any;
        type: MessageType;
    };
    static createResp(method: MsgReqMethod, msgId: string, params: any): {
        msgId: string;
        method: MsgReqMethod;
        data: any;
        type: MessageType;
    };
    static createNotify(method: MsgNotifyMethod, params: any): {
        msgId: string;
        method: MsgNotifyMethod;
        data: any;
        type: MessageType;
    };
}
//# sourceMappingURL=message-handler.d.ts.map