import debug from 'debug';
import MessageHandler, {
  MessageType,
  MessageStructure,
} from './message-handler';

export interface RequestItem<R> {
  data: MessageStructure;
  resolve: (value?: R) => void;
  reject: (reason: any) => void;
}

export interface SmartPostMessageSpecs {
  currentWindow: Window;
  targetWindow: Window;
  targetOrigin: string;
  targetPathname?: string;
  logPrefix?: string;
  establishTimeout?: number;
  establishInterval?: number;
}

export type MethodMap = {
  [key: string]: (...args: any[]) => any;
};

export type NotifyMap = {
  [key: string]: any;
};

class SmartPostMessage<
  SMap extends NotifyMap,
  OMap extends MethodMap,
  RMap extends MethodMap,
  NMap extends NotifyMap,
> {
  private _establishTimeout: number;

  private _establishInterval: number;

  private _logPrefix: string;

  private _currentWindow: Window;

  private _targetWindow: Window;

  private _targetOrigin: string;

  private _targetPathname: string;

  private _requestedMap: Map<string, RequestItem<any>> = new Map();

  // TODO: data type.
  private _subscribeFunc: Map<keyof SMap, ((data: any) => any)[]>;

  private _observeFunc: Map<keyof OMap, ((data: MessageStructure<keyof OMap>) => any)[]>;

  private _closed: boolean;

  private _logger: debug.Debugger = debug('smart-pmsg');

  private _startConnect: number;

  constructor(spec: SmartPostMessageSpecs) {
    this._establishTimeout = spec?.establishTimeout ?? 30000;
    this._establishInterval = spec?.establishInterval ?? 500;
    this._targetOrigin = spec.targetOrigin;
    this._targetPathname = spec.targetPathname || '*';
    this._currentWindow = spec.currentWindow;
    this._targetWindow = spec.targetWindow;
    this._logPrefix = spec.logPrefix ?? ' ✉️✉️✉️ ';

    this._subscribeFunc = new Map();
    this._observeFunc = new Map();

    this._logger == debug(this._logPrefix);

    this._closed = true;
    this._startConnect = 0;

    this.handleSubscription = this.handleSubscription.bind(this);

    this._currentWindow.addEventListener('message', this.handleSubscription);
  }

  setTimeout(timeout: number) {
    this._establishTimeout = timeout;
  }

  async establish(isParent: boolean) {
    this._startConnect = Date.now();
    return new Promise((resolve, reject) => {
      if (isParent) {
        return this._parentEstablish(resolve, reject);
      } else {
        return this._sonEstablish(resolve, reject);
      }
    });
  }

  private _sonEstablish(resolve: (value: any) => void, reject: (reason: any) => void) {
    let timer: NodeJS.Timeout | null = null;

    const sonCb = (event: MessageEvent) => {
      if (event.data === 'syncSent') {
        this._logger('ESTABLISH >> SON >> RECV: syncSent,  SEND: syncRecv');
        this._targetWindow.postMessage('syncRecv', this._targetOrigin);
        return;
      }

      if (event.data === 'establish') {
        this._logger('ESTABLISH >> SON >> ESTABLISH');
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        this._currentWindow.removeEventListener('message', sonCb);
        this._closed = false;
        resolve(1);
      }
    };

    this._currentWindow.addEventListener('message', sonCb);

    timer = setTimeout(() => {
      this._currentWindow.removeEventListener('message', sonCb);
      reject('connect failed');
    }, this._establishTimeout);
  }

  private _parentEstablish(
    resolve: (value: any) => void,
    reject: (reason: any) => void,
  ) {
    let timer: NodeJS.Timeout | null = null;
    let timeroutTimer: NodeJS.Timeout | null = null;

    const msgCb = (event: MessageEvent) => {
      if (event.data === 'syncRecv') {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (timeroutTimer) {
          clearTimeout(timeroutTimer);
          timer = null;
        }
        this._logger('ESTABLISH >> PARENT >> FINISH. NOTIFY: establish');
        this._targetWindow.postMessage('establish', this._targetOrigin);
        this._closed = false;
        resolve(1);
      }
    };

    // start a timeout timer.
    timeroutTimer = setTimeout(() => {
      this._currentWindow.removeEventListener('message', msgCb);
      reject('connect failed');
    }, this._establishTimeout);

    // start a timer.
    timer = setTimeout(() => {
      if (timeroutTimer) {
        clearTimeout(timeroutTimer);
        timer = null;
      }
      this._currentWindow.removeEventListener('message', msgCb);
      this._parentEstablish(resolve, reject);
    }, this._establishInterval);

    this._currentWindow.addEventListener('message', msgCb, { once: true });

    this._logger('ESTABLISH >> PARENT >> SEND: syncSent');
    this._targetWindow.postMessage('syncSent', this._targetOrigin);
  }

  _send(msg: MessageStructure) {
    this._targetWindow.postMessage(msg, '*');
  }

  async request<T extends keyof RMap>(method: string, args: Parameters<RMap[T]> | null = null) {
    this._logger(`[SEND-REQ] [${method}] | args`, args);

    if (this._closed) {
      throw new Error('postMessage has been closed.');
    }

    const msg = MessageHandler.createReq<Parameters<RMap[T]> | null>(method, args);

    return new Promise<ReturnType<RMap[T]>>((resolve, reject) => {
      // store in requestedMap.
      this._requestedMap.set(msg.msgId, {
        data: msg,
        reject,
        resolve,
      });
      this._send(msg);
    });
  }

  notify<N extends keyof NMap>(method: N, args: NMap[N] | null = null) {
    this._logger(`[SEND-NOTIFY] [${method as string}] | args`, args);

    const msg = MessageHandler.createNotify<N>(method as string, args);
    this._send(msg);
  }

  subscribe<S extends keyof SMap>(method: S, cb: (data: SMap[S]) => void) {
    if (!this._subscribeFunc.has(method)) {
      this._subscribeFunc.set(method, []);
    }

    // For sure that callbacks has value.
    const callbacks = this._subscribeFunc.get(method)!;
    callbacks.push(cb);

    return () => {
      const index = callbacks.indexOf(cb);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  unsubscribe<S extends keyof SMap>(method: S) {
    this._subscribeFunc.delete(method);
  }

  observe<O extends keyof OMap>(method: O, cb: OMap[O]) {
    if (!this._observeFunc.has(method)) {
      this._observeFunc.set(method, []);
    }

    // For sure that callbacks has value.
    const callbacks = this._observeFunc.get(method)!;
    callbacks.push(cb);
  }

  unobserve<O extends keyof OMap>(method: O) {
    this._observeFunc.delete(method);
  }

  handleSubscription(event: MessageEvent) {
    if (!event.data.method) {
      return;
    }

    if (event.origin !== this._targetOrigin && this._targetOrigin !== '*') {
      return;
    }
    if (event.data.pathname !== this._targetPathname && this._targetPathname !== '*') {
      return;
    }

    switch (event.data.type) {
      case MessageType.Req:
        this.handleReq(event.data);
        break;
      case MessageType.Resp:
      case MessageType.RespError:
        this.handleResp(event.data);
        break;
      case MessageType.Notify:
        this.handleNotify(event.data);
        break;
    }
  }

  async handleReq(event: MessageStructure) {
    const { msgId, method } = event;

    const callbacks = this._observeFunc.get((method as (keyof OMap)));
    if (!callbacks) {
      return;
    }
    this._logger(`[RECV-REQ] [${method}] | event`, event);

    for (const cb of callbacks) {
      try {
        const res = await cb(event);
        const msg = MessageHandler.createResp(method, msgId, res);
        this._send(msg);
      } catch (error) {
        const msg = MessageHandler.createRespError(method, msgId, error);
        this._send(msg);
      }
    }
  }

  handleResp(event: MessageStructure) {
    const { msgId } = event;
    const respData = this._requestedMap.get(msgId);
    if (!respData) {
      return;
    }
    this._logger('[RECV-RESP] | event', event);

    if (event.error) {
      respData.reject(event.error);
    } else {
      respData.resolve(event.data);
    }
    this._requestedMap.delete(msgId);
  }

  handleNotify(event: MessageStructure) {
    const { method } = event;

    const cbs = this._subscribeFunc.get((method as (keyof SMap)));
    if (!cbs || cbs.length === 0) {
      return;
    }
    this._logger(`[RECV-NOTIFY] [${method}]| event: `, event);

    for (let i = 0; i < cbs?.length; i++) {
      cbs[i](event.data);
    }
  }

  async finish() {
    this._logger('CONNECTION FINISHED.');
    this._currentWindow.removeEventListener('message', this.handleSubscription);
    this._closed = true;
  }
}

export default SmartPostMessage;
