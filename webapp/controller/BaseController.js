sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/base/Log",
        "sap/f/library",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
    ],
    function (Controller, History, Log, fioriLibrary, MessageToast, JSONModel) {
        "use strict";
        let data = {};
        return Controller.extend("sap.project.controller.BaseController", {
            setData: function (item) {
                data = item;
            },

            getData: function () {
                return data;
            },
        });
    }
);
