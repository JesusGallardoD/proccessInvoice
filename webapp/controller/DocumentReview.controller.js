sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"com.gmexico.sup.invproccessInvoice/libs/xml2json.js"
], function(Controller,MessageToast,MessageBox,x2j) {
	"use strict";

	return Controller.extend("com.gmexico.sup.invproccessInvoice.controller.UserValidation", {
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("xmlInvoice",oModel));
			 var invoice = JSON.parse(oModel.getJSON());
			 this.getView().byId("xmlx").setValue(( invoice.Comprobante.Addenda._xmlx === undefined ) ? "" : invoice.Comprobante.Addenda._xmlx);
			 this.getView().byId("office").setValue(( invoice.Comprobante.Addenda._oficinadepago === undefined ) ? "" : invoice.Comprobante.Addenda._oficinadepago);
			 this.getView().byId("provider").setValue(( invoice.Comprobante.Addenda._proveedor === undefined ) ? "" : invoice.Comprobante.Addenda._proveedor);
			 this.getView().byId("kindDocument").setValue(( invoice.Comprobante.Addenda._tipodocumento === undefined ) ? "" : invoice.Comprobante.Addenda._tipodocumento);
			 this.getView().byId("email").setValue(( invoice.Comprobante.Addenda._emailconfirmacion === undefined ) ? "" : invoice.Comprobante.Addenda._emailconfirmacion);
			 this.getView().byId("category").setValue(( invoice.Comprobante.Addenda._categoria === undefined ) ? "" : invoice.Comprobante.Addenda._categoria);
			 this.getView().byId("order").setValue(( invoice.Comprobante.Addenda._pedido === undefined ) ? "" : invoice.Comprobante.Addenda._pedido);
		},		
		onPress: function(oEvent){
			var xmlx = this.getView("xmlx").getValue();
			var office = this.getView("office").getValue();
			var provider = this.getView("provider").getValue();
			var kindDocument = this.getView("kindDocument").getValue();
			var email = this.getView("email").getValue();
			var category = this.getView("category").getValue();
			var order = this.getView("order").getValue();
			if(xmlx !== "" && office!=="" &&  provider!=="" && kindDocument !=="" && email!=="" && category!=="" && order!=="")
			{
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("main");
			}else{
				MessageToast.show("campos incompletos, por favor completa la forma");
			}
		}
	});
});