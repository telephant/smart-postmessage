export declare enum MessageType {
    Req = "Req",
    Resp = "Resp",
    Notify = "Notify"
}
export interface MessageStructure {
    msgId: string;
    method: string;
    data: any;
    type: MessageType;
}
export default class MessageHandler {
    static createReq(method: string, params: any): {
        msgId: string;
        method: string;
        data: any;
        type: MessageType;
    };
    static createResp(method: string, msgId: string, params: any): {
        msgId: string;
        method: string;
        data: any;
        type: MessageType;
    };
    static createNotify(method: string, params: any): {
        msgId: string;
        method: string;
        data: any;
        type: MessageType;
    };
}
//# sourceMappingURL=message-handler.d.ts.map