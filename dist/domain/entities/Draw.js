"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawVisibility = exports.DrawStatus = void 0;
var DrawStatus;
(function (DrawStatus) {
    DrawStatus["DRAFT"] = "DRAFT";
    DrawStatus["READY"] = "READY";
    DrawStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DrawStatus["COMPLETED"] = "COMPLETED";
    DrawStatus["ARCHIVED"] = "ARCHIVED";
})(DrawStatus || (exports.DrawStatus = DrawStatus = {}));
var DrawVisibility;
(function (DrawVisibility) {
    DrawVisibility["PUBLIC"] = "PUBLIC";
    DrawVisibility["SHARED"] = "SHARED";
    DrawVisibility["PRIVATE"] = "PRIVATE";
})(DrawVisibility || (exports.DrawVisibility = DrawVisibility = {}));
