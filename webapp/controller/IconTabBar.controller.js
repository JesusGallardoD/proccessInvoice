sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"
], function(Controller, Filter, JSONModel) {
	"use strict";

	return Controller.extend("com.gmexico.sup.invproccessInvoice.controller.IconTabBar", {
		onInit: function() {
			this.getView().setModel(sap.ui.getCore().getModel());
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("main").attachPatternMatched(this.onObjectMatched, this);
		},
		onObjectMatched: function() {
			this.getView().byId("FacturadosFilter").getModel().refresh(true);
			this.getView().byId("NoFilter").getModel().refresh(true);
		},
		onRowPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				invoiceId: oEvent.getSource().getBindingContext().getObject().Id
			});
		},
		handleIconTabBarSelect: function(oEvent) {
			var oBinding = this.getView().byId("mainTable").getBinding("items");
			var sKey = oEvent.getParameter("key");
			var oFilter;

			if (sKey === "1" || sKey === "3") {
				oFilter = new Filter("InvoiceLevel", "EQ", sKey);
				oBinding.filter([oFilter]);
			} else {
				oBinding.filter([]);
			}
		},
		handleLogOut: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("UploadFile");
		}
	});
});