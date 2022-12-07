'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const generateUniqueId = (len) => {
    const uuidBuf = new Uint8Array(len);
    window.crypto.getRandomValues(uuidBuf);
    const uuid = buf2Hex(uuidBuf);
    return uuid;
};
const buf2Hex = (buffer) => {
    // create a byte array (Uint8Array) that we can use to read the array buffer
    const byteArray = new Uint8Array(buffer);
    // for each element, we want to get its two-digit hexadecimal representation
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i++) {
        // convert value to hexadecimal
        const hex = byteArray[i].toString(16);
        // pad with zeros to length 2
        const paddedHex = (`00${hex}`).slice(-2);
        // push to array
        hexParts.push(paddedHex);
    }
    // join all the hex values of the elements into a single string
    return hexParts.join('');
};

var MessageType;
(function (MessageType) {
    MessageType["Req"] = "Req";
    MessageType["Resp"] = "Resp";
    MessageType["Notify"] = "Notify";
})(MessageType || (MessageType = {}));
class MessageHandler {
    static createReq(method, params) {
        const msgId = generateUniqueId(16);
        return {
            msgId,
            method,
            data: params,
            type: MessageType.Req,
        };
    }
    static createResp(method, msgId, params) {
        return {
            msgId,
            method,
            data: params,
            type: MessageType.Resp,
        };
    }
    static createNotify(method, params) {
        const msgId = generateUniqueId(16);
        return {
            msgId,
            method,
            data: params,
            type: MessageType.Notify,
        };
    }
}

class SmartPostMessage {
    constructor(spec) {
        this._requestedMap = new Map();
        this._subscribeFunc = new Map();
        this._observeFunc = new Map();
        this._targetOrigin = spec.targetOrigin;
        this._currentWindow = spec.currentWindow;
        this._targetWindow = spec.targetWindow;
        this._name = spec.name;
        this._currentWindow.addEventListener('message', (event) => {
            this.handleSubscription(event);
        });
    }
    _send(msg) {
        this._targetWindow.postMessage(msg, this._targetOrigin);
    }
    request(method, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = MessageHandler.createReq(method, args);
            return new Promise((resolve, reject) => {
                // store in requestedMap.
                this._requestedMap.set(msg.msgId, {
                    data: msg,
                    reject,
                    resolve,
                });
                this._send(msg);
            });
        });
    }
    notify(method, args) {
        const msg = MessageHandler.createNotify(method, args);
        this._send(msg);
    }
    subscribe(method, cb) {
        var _a;
        const existCbs = (_a = this._subscribeFunc.get(method)) !== null && _a !== void 0 ? _a : [];
        const index = existCbs.length;
        this._subscribeFunc.set(method, [...existCbs, cb]);
        return () => {
            const cbs = this._subscribeFunc.get(method);
            if (cbs) {
                delete cbs[index];
            }
        };
    }
    unsubscribe(method) {
        this._subscribeFunc.delete(method);
    }
    observe(method, cb) {
        this._observeFunc.set(method, cb);
        console.log('🚀 ===== handleReq ===== cb', this._observeFunc.entries());
    }
    unobserve(method) {
        this._observeFunc.delete(method);
    }
    handleSubscription(event) {
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
    handleReq(event) {
        const { msgId, method } = event;
        const cb = this._observeFunc.get(method);
        if (!cb) {
            return;
        }
        const res = cb(event);
        const msg = MessageHandler.createResp(method, msgId, res);
        this._send(msg);
    }
    handleResp(event) {
        const { msgId } = event;
        const respData = this._requestedMap.get(msgId);
        if (!respData) {
            return;
        }
        respData.resolve(event.data);
        this._requestedMap.delete(msgId);
    }
    handleNotify(event) {
        const { method } = event;
        const cbs = this._subscribeFunc.get(method);
        if (!cbs || cbs.length === 0) {
            return;
        }
        for (let i = 0; i < (cbs === null || cbs === void 0 ? void 0 : cbs.length); i++) {
            cbs[i](event);
        }
    }
}

var MessageMethod;
(function (MessageMethod) {
    MessageMethod["sayHello"] = "sayHello";
    MessageMethod["pwdChange"] = "pwdChange";
})(MessageMethod || (MessageMethod = {}));

const test = () => __awaiter(void 0, void 0, void 0, function* () {
    const iframe = document.createElement('iframe');
    iframe.src = '../iframe.html';
    document.body.appendChild(iframe);
    iframe.onload = () => __awaiter(void 0, void 0, void 0, function* () {
        const targetWindow = iframe.contentWindow;
        if (!targetWindow) {
            return null;
        }
        const smartPM = new SmartPostMessage({
            targetOrigin: '*',
            targetWindow,
            currentWindow: window,
            name: 'parent',
        });
        smartPM.subscribe(MessageMethod.pwdChange, (message) => {
            console.log('🚀 ===== smartPM.subscribe ===== message', message);
        });
        console.log('resp start');
        const resp = yield smartPM.request(MessageMethod.sayHello, { name: 'yetao' });
        console.log(resp);
        alert(JSON.stringify(resp));
    });
});
test();
