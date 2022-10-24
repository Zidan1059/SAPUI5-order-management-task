/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
    [
        "sap/ui/core/UIComponent",

        "sap/ui/model/resource/ResourceModel",
        "sap/ui/model/json/JSONModel",
        "sap/f/library",
    ],
    function (UIComponent, ResourceModel, JSONModel, fioriLibrary) {
        "use strict";

        return UIComponent.extend("sap.project.Component", {
            metadata: {
                manifest: "json",
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oModel, oProductsModel, oRouter;
                // call the base component's init function
                var oOrdersModel;
                oModel = new JSONModel();
                this.setModel(oModel);

                UIComponent.prototype.init.apply(this, arguments);
                oModel = new JSONModel();
                this.setModel(oModel);

                // set products demo model on this sample

                var oCustModel = new JSONModel(
                    sap.ui.require.toUrl("sap/project/helper.json")
                );
                oCustModel.setSizeLimit(1000);
                this.setModel(oCustModel, "cust");

                var i18nModel = new ResourceModel({
                    bundleName: "sap.project.i18n.i18n",
                    bundleUrl: "i18n/i18n.properties",
                    supportedLocales: ["", "de"],
                    fallbackLocale: "",
                });
                this.setModel(i18nModel, "i18n");
                oRouter = this.getRouter();
                oRouter.attachBeforeRouteMatched(
                    this._onBeforeRouteMatched,
                    this
                );
                oRouter.initialize();
            },
            _onBeforeRouteMatched: function (oEvent) {
                var oModel = this.getModel(),
                    sLayout = oEvent.getParameters().arguments.layout;

                // If there is no layout parameter, set a default layout (normally OneColumn)
                if (!sLayout) {
                    sLayout = fioriLibrary.LayoutType.OneColumn;
                }

                oModel.setProperty("/layout", sLayout);
            },
        });
    }
);
