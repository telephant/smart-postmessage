import { MessageMethod } from './message-method';
export declare enum MessageType {
    Req = "Req",
    Resp = "Resp",
    Notify = "Notify"
}
export interface MessageStructure {
    msgId: string;
    method: MessageMethod;
    data: any;
    type: MessageType;
}
export default class MessageHandler {
    static createReq(method: MessageMethod, params: any): {
        msgId: string;
        method: MessageMethod;
        data: any;
        type: MessageType;
    };
    static createResp(method: MessageMethod, msgId: string, params: any): {
        msgId: string;
        method: MessageMethod;
        data: any;
        type: MessageType;
    };
    static createNotify(method: MessageMethod, params: any): {
        msgId: string;
        method: MessageMethod;
        data: any;
        type: MessageType;
    };
}
//# sourceMappingURL=message-handler.d.ts.map