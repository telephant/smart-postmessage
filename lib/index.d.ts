import { MessageStructure } from './message-handler';
import { MessageMethod } from './message-method';
export interface RequestItem<R> {
    data: MessageStructure;
    resolve: (value?: R) => void;
    reject: (reason: any) => void;
}
interface SmartPostMessageSpecs {
    targetWindow: Window;
    targetOrigin: string;
}
declare class SmartPostMessage {
    private _targetWindow;
    private _targetOrigin;
    private _requestedMap;
    private _subscribeFunc;
    private _observeFunc;
    constructor(spec: SmartPostMessageSpecs);
    _send(msg: MessageStructure): void;
    request<R>(method: MessageMethod, ...args: any): Promise<R>;
    subscribe(method: MessageMethod, cb: () => void): () => void;
    unsubscribe(method: MessageMethod): void;
    observe(method: MessageMethod, cb: (m: MessageStructure) => void): void;
    unobserve(method: MessageMethod): void;
    handleSubscription(event: MessageEvent): void;
    handleReq(event: MessageStructure): void;
    handleResp(event: MessageStructure): void;
    handleNotify(event: MessageStructure): void;
}
export default SmartPostMessage;
//# sourceMappingURL=index.d.ts.map