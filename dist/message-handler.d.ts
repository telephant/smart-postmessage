export declare enum MessageType {
    Req = "Req",
    Resp = "Resp",
    RespError = "RespError",
    Notify = "Notify"
}
export interface MessageStructure<T = any> {
    msgId: string;
    method: string;
    data: T;
    error?: any;
    type: MessageType;
    pathname: string;
}
export default class MessageHandler {
    static createReq<T>(method: string, params: T | null): {
        msgId: string;
        method: string;
        data: T | null;
        type: MessageType;
        pathname: string;
    };
    static createResp(method: string, msgId: string, params: any): {
        msgId: string;
        method: string;
        data: any;
        type: MessageType;
        pathname: string;
    };
    static createRespError(method: string, msgId: string, error: any): {
        msgId: string;
        method: string;
        data: {};
        error: any;
        type: MessageType;
        pathname: string;
    };
    static createNotify<T>(method: string, params: T | null): {
        msgId: string;
        method: string;
        data: T | null;
        type: MessageType;
        pathname: string;
    };
}
