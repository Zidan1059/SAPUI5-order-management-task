sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "sap/project/controller/BaseController",
        "sap/f/library",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/Label",
        "sap/m/MessageToast",
        "sap/m/Text",
        "sap/m/TextArea",
        "sap/m/library",
    ],
    function (
        JSONModel,
        BaseController,
        fioriLibrary,
        Dialog,
        Button,
        Label,
        MessageToast,
        Text,
        TextArea,
        mobileLibrary
    ) {
        "use strict";
        // var DialogType = mobileLibrary.DialogType;

        return BaseController.extend("sap.project.controller.OrderPage", {
            onInit: async function () {
                var oLocalStorage = JSON.parse(
                    localStorage.getItem("ordersLocal")
                );
                this.oView = this.getView();
                var oOrderModel = new JSONModel(oLocalStorage);

                await this.getView().setModel(oOrderModel, "oOrderModel");

                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
                var oLocalStorage = JSON.parse(
                    localStorage.getItem("ordersLocal")
                );
                console.log("LocalStorage", oLocalStorage);
                var oOrderModel = new JSONModel(oLocalStorage);

                this.getView().setModel(oOrderModel, "oOrderModel");

                this.getView().getModel().refresh();
            },
            onApproveDialogPress: function (id, status) {
                console.log("status", status);
                if (!status) {
                    localStorage.setItem("statusId", id);
                    var DialogType = mobileLibrary.DialogType;

                    if (!this.oStatusDialog) {
                        this.oStatusDialog = new Dialog({
                            type: DialogType.Message,
                            title: "Confirm",
                            content: new Text({
                                text: "Change the status this order?",
                            }),
                            beginButton: new Button({
                                text: "Yes",
                                press: function () {
                                    this.onStausChange();
                                    MessageToast.show("The status is changed");
                                    //  console.log("id of status", id);
                                    this.oStatusDialog.close();
                                    this.oRouter.navTo("orderpage", {
                                        layout: fioriLibrary.LayoutType
                                            .OneColumn,
                                    });
                                }.bind(this),
                            }),
                            endButton: new Button({
                                text: "No",
                                press: function () {
                                    this.oStatusDialog.close();
                                }.bind(this),
                            }),
                        });
                    }

                    this.oStatusDialog.open();
                }
            },
            onStausChange: function () {
                var statChageId = localStorage.getItem("statusId");
                let localStoragedata = JSON.parse(
                    localStorage.getItem("ordersLocal")
                ).orderList;

                const found = localStoragedata.find(
                    (element) => element.orderid == statChageId
                );

                found.status = true;
                found.visible = false;
                var editedArr = {
                    orderList: localStoragedata,
                };
                localStorage.setItem("ordersLocal", JSON.stringify(editedArr));
                let oData = new JSONModel({
                    orderList: localStoragedata,
                });
                this.getView().setModel(oData, "oOrderModel");
                this.getView().getModel().refresh();
            },

            onNewPressed(oEvent) {
                console.log("new Button");
                //var oFCL = this.oView.getParent().getParent();
                var input = this.byId("app_input_orderno");
                console.log("input", input);
                this.oRouter.navTo("detail", {
                    layout: fioriLibrary.LayoutType.TwoColumnsBeginExpanded,
                    orderid: "create",
                });
            },
            onItemSelected(oEvent) {
                if (oEvent.getParameter("rowContext")) {
                    let oData = oEvent.getParameter("rowContext").getObject();

                    console.log("sadasd", oData);

                    if (oData.status) {
                        MessageToast.show("Order already delivered");
                    } else {
                        this.setData(oData);

                        var productPath = oEvent.getSource();

                        // product = productPath.split("/").slice(-1).pop();
                        console.log("productPath", productPath);

                        this.oRouter.navTo("detail", {
                            layout: fioriLibrary.LayoutType
                                .TwoColumnsBeginExpanded,
                            orderid: oData.orderid,
                        });
                    }
                }
            },

            onDeleteButtonPressed: function (id) {
                var DialogType = mobileLibrary.DialogType;
                localStorage.setItem("deletedId", id);
                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Delete Order",
                        content: new Text({
                            text: "Do you want to delete this order?",
                        }),
                        beginButton: new Button({
                            text: "Yes",
                            press: function () {
                                let oLocalStorage = JSON.parse(
                                    localStorage.getItem("ordersLocal")
                                );
                                console.log(oLocalStorage);
                                var orderData = this.getView()
                                    .getModel("oOrderModel")
                                    .getData().orderList;

                                let filterdData =
                                    oLocalStorage.orderList.filter((item) => {
                                        return (
                                            item.orderid !=
                                            localStorage.getItem("deletedId")
                                        );
                                    });
                                console.log("filterdData", filterdData);
                                localStorage.setItem(
                                    "ordersLocal",
                                    JSON.stringify({ orderList: filterdData })
                                );
                                let oData = new JSONModel({
                                    orderList: filterdData,
                                });
                                this.getView().setModel(oData, "oOrderModel");
                                MessageToast.show("Order Deleted");
                                this.oApproveDialog.close();
                                this.getView().getModel().refresh();
                                this.oRouter.navTo("orderpage", {
                                    layout: fioriLibrary.LayoutType.OneColumn,
                                });
                            }.bind(this),
                        }),
                        endButton: new Button({
                            text: "No",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this),
                        }),
                    });
                }

                this.oApproveDialog.open();
            },
        });
    }
);
