import { MessageStructure } from './message-handler';
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
declare class SmartPostMessage<R, N> {
    private _currentWindow;
    private _targetWindow;
    private _targetOrigin;
    private _requestedMap;
    private _subscribeFunc;
    private _observeFunc;
    constructor(spec: SmartPostMessageSpecs);
    _send(msg: MessageStructure): void;
    request<R>(method: string, args: any): Promise<R>;
    notify(method: string, args: any): void;
    subscribe(method: string, cb: (m: MessageStructure) => void): () => void;
    unsubscribe(method: string): void;
    observe(method: string, cb: (m: MessageStructure) => void): void;
    unobserve(method: string): void;
    handleSubscription(event: MessageEvent): void;
    handleReq(event: MessageStructure): void;
    handleResp(event: MessageStructure): void;
    handleNotify(event: MessageStructure): void;
}
export default SmartPostMessage;
//# sourceMappingURL=index.d.ts.map