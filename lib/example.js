'use strict';

var MessageType;
(function (MessageType) {
    MessageType[MessageType["Req"] = 0] = "Req";
    MessageType[MessageType["Resp"] = 1] = "Resp";
    MessageType[MessageType["Notify"] = 2] = "Notify";
})(MessageType || (MessageType = {}));

var MessageMethod;
(function (MessageMethod) {
    MessageMethod[MessageMethod["sayHello"] = 0] = "sayHello";
    MessageMethod[MessageMethod["pwdChange"] = 1] = "pwdChange";
})(MessageMethod || (MessageMethod = {}));
