import MessageHandler, {
  MessageType,
  MessageStructure,
} from './message-handler';
import { MessageMethod } from './message-method'

export interface RequestItem<R> {
  data: MessageStructure;
  resolve: (value?: R) => void;
  reject: (reason: any) => void;
}

interface SmartPostMessageSpecs {
  currentWindow: Window;
  targetWindow: Window;
  targetOrigin: string;
  name: string;
}

class SmartPostMessage {
  private _currentWindow: Window;

  private _targetWindow: Window;

  private _targetOrigin: string;

  private _requestedMap: Map<string, RequestItem<any>> = new Map();

  private _subscribeFunc: Map<MessageMethod, ((data: MessageStructure) => any)[]> = new Map();

  private _observeFunc: Map<MessageMethod, ((data: MessageStructure) => any)> = new Map();

  private _name: string;

  constructor(spec: SmartPostMessageSpecs) {
    this._targetOrigin = spec.targetOrigin;
    this._currentWindow = spec.currentWindow;
    this._targetWindow = spec.targetWindow;

    this._name = spec.name;

    this._currentWindow.addEventListener('message', (event: MessageEvent) => {
      this.handleSubscription(event);
    });
  }

  _send(msg: MessageStructure) {
    this._targetWindow.postMessage(msg, this._targetOrigin);
  }

  async request<R>(method: MessageMethod, args: any) {
    const msg = MessageHandler.createReq(method, args);

    return new Promise<R>((resolve, reject) => {
      // store in requestedMap.
      this._requestedMap.set(msg.msgId, {
        data: msg,
        reject,
        resolve,
      });
      this._send(msg);
    });
  }

  notify(method: MessageMethod, args: any) {
    const msg = MessageHandler.createNotify(method, args);
    this._send(msg);
  }

  subscribe(method: MessageMethod, cb: (m: MessageStructure) => void) {
    const existCbs = this._subscribeFunc.get(method) ?? [];
    const index = existCbs.length;
    this._subscribeFunc.set(method, [...existCbs, cb]);

    return () => {
      const cbs = this._subscribeFunc.get(method);
      if (cbs) {
        delete cbs[index];
      }
    };
  }

  unsubscribe(method: MessageMethod) {
    this._subscribeFunc.delete(method);
  }

  observe(method: MessageMethod, cb: (m: MessageStructure) => void) {
    this._observeFunc.set(method, cb);
    console.log('🚀 ===== handleReq ===== cb', this._observeFunc.entries());
  }

  unobserve(method: MessageMethod) {
    this._observeFunc.delete(method);
  }

  handleSubscription(event: MessageEvent) {
    if (event.origin !== this._targetOrigin && this._targetOrigin !== '*') {
      return;
    }

    switch (event.data.type) {
      case MessageType.Req:
        this.handleReq(event.data);
        break;
      case MessageType.Resp:
        this.handleResp(event.data);
        break;
      case MessageType.Notify:
        this.handleNotify(event.data);
        break;
    }
  }

  handleReq(event: MessageStructure) {
    const { msgId, method } = event;
    const cb = this._observeFunc.get(method);
    if (!cb) {
      return;
    }
    const res = cb(event);
    const msg = MessageHandler.createResp(method, msgId, res);
    this._send(msg);
  }

  handleResp(event: MessageStructure) {
    const { msgId } = event;
    const respData = this._requestedMap.get(msgId);
    if (!respData) {
      return;
    }
    respData.resolve(event.data);
    this._requestedMap.delete(msgId);
  }

  handleNotify(event: MessageStructure) {
    const { method } = event;

    const cbs = this._subscribeFunc.get(method);
    if (!cbs || cbs.length === 0) {
      return;
    }

    for (let i = 0; i < cbs?.length; i++) {
      cbs[i](event);
    }
  }
}

export default SmartPostMessage;
