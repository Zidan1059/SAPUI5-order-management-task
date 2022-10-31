sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/f/library",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Popup",
        "sap/project/controller/BaseController",
        "sap/ui/model/type/Float",
    ],
    function (
        Controller,
        fioriLibrary,
        JSONModel,
        Fragment,
        Filter,
        FilterOperator,
        Popup,
        BaseController
    ) {
        "use strict";

        return BaseController.extend("sap.project.controller.Detail", {
            onInit: async function () {
                this.oView = this.getView();
                console.log("rowData", this.getData());

                var oModel = new JSONModel(
                    sap.ui.require.toUrl("sap/project/helper.json")
                );
                await this.getView().setModel(oModel);
                let countryCityLocal = {
                    countryList: [
                        {
                            countryId: "1",
                            countryName: "Bangladesh",
                            cityList: [
                                {
                                    cityId: "1",
                                    cityName: "Dhaka",
                                },
                                {
                                    cityId: "2",
                                    cityName: "Mymensingh",
                                },
                                {
                                    cityId: "3",
                                    cityName: "Rajshahi",
                                },
                                {
                                    cityId: "4",
                                    cityName: "Sylhet",
                                },
                            ],
                        },
                        {
                            countryId: "2",
                            countryName: "Russia",
                            cityList: [
                                {
                                    cityId: "5",
                                    cityName: "Moskov",
                                },
                                {
                                    cityId: "6",
                                    cityName: "Kazan",
                                },
                                {
                                    cityId: "7",
                                    cityName: "Samara",
                                },
                                {
                                    cityId: "8",
                                    cityName: "Sochi",
                                },
                            ],
                        },
                        {
                            countryId: "3",
                            countryName: "USA",
                            cityList: [
                                {
                                    cityId: "9",
                                    cityName: "New York",
                                },
                                {
                                    cityId: "10",
                                    cityName: "Miami",
                                },
                                {
                                    cityId: "11",
                                    cityName: "Las Vegas",
                                },
                            ],
                        },
                    ],
                };
                var oCountry = new JSONModel(countryCityLocal);
                localStorage.setItem(
                    "cityLists",
                    JSON.stringify(countryCityLocal)
                );
                await this.getView().setModel(oCountry, "oCountry");
                console.log("abasal", this.getView().getModel("oCountry"));

                // const random = Math.floor(Math.random() * 10000);
                // this.byId("app_input_orderno").setValue(random);

                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                // this.oRouter.attachRouteMatched(this.onItemRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
                oEvent.getParameter("arguments");
                let itemBinding = [];

                if (oEvent.getParameter("arguments").orderid == "create") {
                    let oEditModel = new JSONModel({
                        editmode: false,
                    });
                    this.getView().setModel(oEditModel, "editModel");
                    let oSaveModel = new JSONModel({
                        saveMode: true,
                    });
                    this.getView().setModel(oSaveModel, "oSaveModel");
                    const random = Math.floor(Math.random() * 10000);
                    this.byId("app_input_orderno").setValue(random);
                    this.byId("app_input_customername").setValue("");
                    this.getView()
                        .byId("app_input_country")
                        .setSelectedItem(null);
                    this.getView().byId("app_input_city").setSelectedItem(null);
                    this.byId("app_input_date").setValue("");
                } else {
                    let oLocalStorage = JSON.parse(
                        localStorage.getItem("ordersLocal")
                    );
                    let itemId = oEvent.getParameter("arguments").orderid;

                    let filterdData = oLocalStorage.orderList.filter((item) => {
                        return item.orderid == itemId;
                    });
                    if (filterdData.length != 0) {
                        console.log("item Filter", filterdData);
                        this.byId("app_input_orderno").setValue(
                            filterdData[0].orderid
                        );
                        this.byId("app_input_customername").setValue(
                            filterdData[0].customerName
                        );
                        this.byId("app_input_date").setValue(
                            filterdData[0].orderDate
                        );
                        let city = filterdData[0].address.substr(
                            0,
                            filterdData[0].address.indexOf(",")
                        );
                        let country = filterdData[0].address
                            .substr(filterdData[0].address.indexOf(","))
                            .slice(1);
                        console.log("city", city);
                        console.log("country", country);

                        let countryData = JSON.parse(
                            localStorage.getItem("cityLists")
                        ).countryList;
                        console.log("countryData", countryData);
                        const cityListByCountry = countryData.filter(
                            (item) => item.countryName == country
                        );

                        let oCityModel = new JSONModel({
                            cityLists: cityListByCountry[0].cityList,
                        });

                        this.getView().setModel(oCityModel, "oCityModel");
                        console.log("cityListByCountry", cityListByCountry);

                        this.getView()
                            .byId("app_input_country")
                            .setSelectedKey(country);
                        this.getView()
                            .byId("app_input_city")
                            .setSelectedKey(city);
                    }

                    let oEditModel = new JSONModel({
                        editmode: true,
                    });
                    this.getView().setModel(oEditModel, "editModel");
                    let oSaveModel = new JSONModel({
                        saveMode: false,
                    });
                    this.getView().setModel(oSaveModel, "oSaveModel");
                }
            },

            onItemRouteMatched: function (oEvent) {},

            onCancelPressed() {
                this.oRouter.navTo("detail", {
                    layout: fioriLibrary.LayoutType.OneColumn,
                    orderid: 0,
                });
                this.byId("app_input_orderno").setValue("");
            },
            onUpdatePressed() {
                // let editID = window.location.hash.split("/")[2];
                // console.log("object", editID);

                let localStoragedata = JSON.parse(
                    localStorage.getItem("ordersLocal")
                ).orderList;
                console.log("localStoragedata", localStoragedata);
                const found = localStoragedata.find(
                    (element) =>
                        element.orderid ==
                        this.byId("app_input_orderno").getValue()
                );
                console.log("found", found);

                found.customerName = this.byId(
                    "app_input_customername"
                ).getValue();

                var countryName = this.getView()
                    .byId("app_input_country")
                    .getSelectedItem()
                    .getText();

                var cityName = this.getView()
                    .byId("app_input_city")
                    .getSelectedItem()
                    .getText();
                found.address = `${cityName},${countryName}`;
                found.orderDate = this.byId("app_input_date").getValue();
                var editedArr = {
                    orderList: localStoragedata,
                };
                localStorage.setItem("ordersLocal", JSON.stringify(editedArr));
                this.oRouter.navTo("orderpage", {
                    layout: fioriLibrary.LayoutType.OneColumn,
                });
            },
            handleValueHelp: function () {
                var oView = this.getView();
                // console.log("oView", oView);
                if (!this._pValueHelpDialogs) {
                    this._pValueHelpDialogs = Fragment.load({
                        id: oView.getId(),
                        name: "sap.project.view.fragment.ValueHelp",
                        controller: this,
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialogs.then(
                    function (oValueHelpDialog) {
                        oValueHelpDialog.open();
                        this._configValueHelpDialog();
                    }.bind(this)
                );
            },
            onCloseDialog(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.byId("app_input_customername");
                console.log("oSelectedItem", oSelectedItem);

                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }

                oInput.setValue(oSelectedItem.getCells()[1].getTitle());
            },
            _configValueHelpDialog: function () {
                var sInputValue = this.byId(
                        "app_input_customername"
                    ).getValue(),
                    oModel = this.getView().getModel(),
                    aProducts = oModel.getProperty("/helpList");
                console.log("sInputValue", aProducts);

                aProducts.forEach(function (oProduct) {
                    oProduct.selected = oProduct.customerName === sInputValue;
                });
                console.log("sInputValue", sInputValue);
                oModel.setProperty("/helpList", aProducts);
                //console.log("sInputValue", selected);
            },
            handleSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                var oFilter = new Filter(
                    "customerName",
                    FilterOperator.Contains,
                    sValue
                );
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            onCountryChange: function (oEvent) {
                let cityIndex = parseInt(
                    oEvent.getParameters().selectedItem.sId.slice(-1)
                );
                console.log("cityIndex", cityIndex);
                let cityData = this.getView().getModel("oCountry").getData()
                    .countryList[cityIndex].cityList;

                let oCityModel = new JSONModel({
                    cityLists: cityData,
                });

                this.getView().setModel(oCityModel, "oCityModel");
            },
            onSubmitPressed: function () {
                //this._onSubmitCheck();
                var orderNo = this.byId("app_input_orderno").getValue();

                var customerName = this.byId(
                    "app_input_customername"
                ).getValue();

                var country = this.getView()
                    .byId("app_input_country")
                    .getSelectedItem()
                    .getText();

                var city = this.getView()
                    .byId("app_input_city")
                    .getSelectedItem()
                    .getText();

                var date = this.byId("app_input_date").getValue();
                console.log("date", orderNo, customerName, country, city, date);
                let newEntry = {
                    orderid: orderNo,
                    customerName: customerName,
                    address: `${city},${country}`,
                    orderDate: date,
                    status: false,
                    delBtnVisible: true,
                };
                if (!localStorage.getItem("ordersLocal")) {
                    var orderJsondata = {
                        orderList: [newEntry],
                    };
                    localStorage.setItem(
                        "ordersLocal",
                        JSON.stringify(orderJsondata)
                    );
                } else {
                    const localStoragedata = JSON.parse(
                        localStorage.getItem("ordersLocal")
                    );

                    localStoragedata.orderList.push(newEntry);
                    localStorage.setItem(
                        "ordersLocal",
                        JSON.stringify(localStoragedata)
                    );
                }

                this.oRouter.navTo("orderpage", {
                    layout: fioriLibrary.LayoutType.OneColumn,
                });

                let oCityModel = new JSONModel({});

                this.getView().setModel(oCityModel, "oCityModel");
                this.byId("app_input_orderno").setValue("");
                this.byId("app_input_customername").setValue("");
                this.getView().byId("app_input_country").setSelectedItem(null);
                this.getView().byId("app_input_city").setSelectedItem(null);
                this.byId("app_input_date").setValue("");
            },
        });
    }
);
