/* global xml2json:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"../libs/xml2json"
], function(Controller,MessageBox,MessageToast,xmlTojsonjs) {
	"use strict";

	return Controller.extend("com.gmexico.sup.invproccessInvoice.controller.UploadFile", {
		handleUploadPDFComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] === "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}
				MessageToast.show(sMsg);
			}
		},
		handleUploadXMLComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] === "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}
				MessageToast.show(sMsg);
			}
		},
		onPress: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");
		},

		handleUploadPress: function(oEvent) {
			var oFileUploaderPDF = this.getView().byId("fileUploaderPDF");
			var oFileUploaderXML = this.getView().byId("fileUploaderXML");
			var xmlFile = this.getView().byId("fileUploaderXML").oFileUpload.files[0];
			if (!oFileUploaderPDF.getValue() && !oFileUploaderXML.getValue()) {
				MessageToast.show("Choose a file first");
				return;
			}else{
				this.handleFileSelection();
				oFileUploaderPDF.upload();
				oFileUploaderXML.upload();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("DocumentReview");
			}
		},
		waitForTextReadComplete: function (reader) {
			reader.onloadend = function(event) {
		    var xmlData = event.target.result;
		    var parser  = new DOMParser(),
		    xmlDom = parser.parseFromString(xmlData, "text/xml");
    		var json = xml2json().xml2json(xmlDom);
			var oModel = new sap.ui.model.json.JSONModel((json));
			sap.ui.getCore().setModel("invoiceXML",oModel);
		  };
		},
		handleFileSelection: function () {
			var file = this.getView().byId("fileUploaderXML").oFileUpload.files[0];
			var reader = new FileReader();
			this.waitForTextReadComplete(reader);
			reader.readAsText(file);
		},
		handlePDFTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose one of the following types: " +
									sSupportedFileTypes);
		},
		handleXMLTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose one of the following types: " +
									sSupportedFileTypes);
		}
	});
});