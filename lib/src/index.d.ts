import { MessageStructure } from './message-handler';
import { MsgReqMethod, MsgNotifyMethod } from './message-method';
export interface RequestItem<R> {
    data: MessageStructure;
    resolve: (value?: R) => void;
    reject: (reason: any) => void;
}
interface SmartPostMessageSpecs {
    currentWindow: Window;
    targetWindow: Window;
    targetOrigin: string;
}
declare class SmartPostMessage {
    private _currentWindow;
    private _targetWindow;
    private _targetOrigin;
    private _requestedMap;
    private _subscribeFunc;
    private _observeFunc;
    constructor(spec: SmartPostMessageSpecs);
    _send(msg: MessageStructure): void;
    request<R>(method: MsgReqMethod, args: any): Promise<R>;
    notify(method: MsgNotifyMethod, args: any): void;
    subscribe(method: MsgNotifyMethod, cb: (m: MessageStructure) => void): () => void;
    unsubscribe(method: MsgNotifyMethod): void;
    observe(method: MsgReqMethod, cb: (m: MessageStructure) => void): void;
    unobserve(method: MsgReqMethod): void;
    handleSubscription(event: MessageEvent): void;
    handleReq(event: MessageStructure<MsgReqMethod>): void;
    handleResp(event: MessageStructure<MsgReqMethod>): void;
    handleNotify(event: MessageStructure<MsgNotifyMethod>): void;
}
export default SmartPostMessage;
//# sourceMappingURL=index.d.ts.map