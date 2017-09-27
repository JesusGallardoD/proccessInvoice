sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller,MessageToast,MessageBox) {
	"use strict";

	return Controller.extend("com.gmexico.sup.invproccessInvoice.controller.UserValidation", {
		onPress: function(oEvent){
			var User = this.getView().byId("user").getValue();       
			var BlackList = sap.ui.getCore().getModel("blackListModel");
			var List =JSON.parse(BlackList.getJSON());
			var validated = true;
			for(var i = 0; i<List.BlackList.length;i++)
			{
				if(User===List.BlackList[i].name){
					validated = false;
				}
			}
			if(validated)
			{
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("UploadFile");
			}else
			{
				MessageToast.show("The user its not allowed to enter to the portal");
			}
		}
	});
});