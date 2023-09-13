declare enum MessageType {
    Req = "Req",
    Resp = "Resp",
    RespError = "RespError",
    Notify = "Notify"
}
interface MessageStructure<T = any> {
    msgId: string;
    method: string;
    data: T;
    error?: any;
    type: MessageType;
    pathname: string;
}

interface RequestItem<R> {
    data: MessageStructure;
    resolve: (value?: R) => void;
    reject: (reason: any) => void;
}
interface SmartPostMessageSpecs {
    currentWindow: Window;
    targetWindow: Window;
    targetOrigin: string;
    targetPathname?: string;
    logPrefix?: string;
    establishTimeout?: number;
    establishInterval?: number;
}
type MethodMap = {
    [key: string]: (...args: any[]) => any;
};
declare class SmartPostMessage<SMap extends MethodMap, OMap extends MethodMap, RMap extends MethodMap> {
    private _establishTimeout;
    private _establishInterval;
    private _logPrefix;
    private _currentWindow;
    private _targetWindow;
    private _targetOrigin;
    private _targetPathname;
    private _requestedMap;
    private _subscribeFunc;
    private _observeFunc;
    private _closed;
    constructor(spec: SmartPostMessageSpecs);
    establish(isParent: boolean): Promise<unknown>;
    private _sonEstablish;
    private _parentEstablish;
    _send(msg: MessageStructure): void;
    request<T extends keyof RMap>(method: string, args?: Parameters<RMap[T]> | null): Promise<ReturnType<RMap[T]>>;
    notify<T>(method: string, args?: T | null): void;
    subscribe<S extends keyof SMap>(method: S, cb: SMap[S]): () => void;
    unsubscribe<S extends keyof SMap>(method: S): void;
    observe<O extends keyof OMap>(method: O, cb: OMap[O]): void;
    unobserve<O extends keyof OMap>(method: O): void;
    handleSubscription(event: MessageEvent): void;
    handleReq(event: MessageStructure): Promise<void>;
    handleResp(event: MessageStructure): void;
    handleNotify(event: MessageStructure): void;
    finish(): Promise<void>;
}

export { type MethodMap, type RequestItem, SmartPostMessage as default };
