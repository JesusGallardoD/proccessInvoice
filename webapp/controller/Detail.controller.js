sap.ui.define([
 	"sap/ui/core/mvc/Controller",
 	"sap/ui/core/routing/History",
 	"sap/ui/model/json/JSONModel",
 	"sap/m/MessageBox",
 	"sap/m/Button",
 	"sap/ui/commons/FileUploader"
 ], function(Controller, History, JSONModel, MessageBox, Button, FileUploader) {
 	"use strict";

 	return Controller.extend("com.gmexico.sup.invproccessInvoice.controller.Detail", {
 		onInit: function() {
 			var oModel = sap.ui.getCore().getModel();
 			this.getView().setModel(oModel);

 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 			oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);

 			//sketchy code
 			var oTable = this.getView().byId("detailTable");

 			oTable.addDelegate({
 				onAfterRendering: function() {
 					var header = this.$().find('thead');
 					var selectAllCb = header.find('.sapMCb');
 					selectAllCb.remove();

 					this.getItems().forEach(function(r) {
 						var obj = r.getBindingContext().getObject();
 						var status = obj.Invoiced;
 						var cb = r.$().find('.sapMCb');
 						var oCb = sap.ui.getCore().byId(cb.attr('id'));
 						if (status === "True") {
 							oCb.setEnabled(false);
 						} else {
 							oCb.setEnabled(true);
 						}
 					});
 				}
 			}, oTable);
 		},
 		onObjectMatched: function(params) {
 			var id = params.getParameter("arguments").invoiceId;
			
			//create view
 			var oModel = sap.ui.getCore().getModel();
 			var data = oModel.getProperty("/PurchaseOrders");
 			
 			this.getView().byId("detailPage").setTitle("Orden de Compra: #" + String(id));

 			this.index = $.inArray(id, $.map(data, function(n) {
 				return n.Id;
 			}));

 			var panel = this.getView().byId("detailPanel");

 			panel.destroyContent();
 			panel.addContent(new sap.m.HBox({
 				items: [new sap.m.Label({
 						text: "Total: ",
 						design: "Bold"
 					}),
 					new sap.m.Label({
 						text: {
 							path: "/PurchaseOrders/" + String(this.index) + "/Total",
 							formatter: function(oVal) {
 								var formatter = new Intl.NumberFormat("en-US", {
 									style: "currency",
 									currency: "USD"
 								});

 								return formatter.format(oVal);
 							}
 						}
 					})
 				]
 			}));

 			panel.addContent(new sap.m.HBox({
 				items: [new sap.m.Label({
 						text: "Fecha: ",
 						design: "Bold"
 					}),
 					new sap.m.Label({
 						text: "{/PurchaseOrders/" + String(this.index) + "/Date}"
 					})
 				]
 			}));

 			var oTable = this.getView().byId("detailTable");

 			oTable.bindItems("/PurchaseOrders/" + String(this.index) + "/items", new sap.m.ColumnListItem({
 				cells: [
 					new sap.m.Text({
 						text: "{Product}"
 					}),
 					new sap.m.Text({
 						text: "{Quantity}"
 					}),
 					new sap.m.Text({
 						text: {
 							path: "UnitPrice",
 							formatter: function(oVal) {
 								var formatter = new Intl.NumberFormat("en-US", {
 									style: "currency",
 									currency: "USD"
 								});

 								return formatter.format(oVal);
 							}
 						}
 					}),
 					new sap.m.Text({
 						text: {
 							parts: [{
 								path: "UnitPrice"
 							}, {
 								path: "Quantity"
 							}],

 							formatter: function(unitPrice, quantity) {
 								var total = unitPrice * quantity;

 								var formatter = new Intl.NumberFormat("en-US", {
 									style: "currency",
 									currency: "USD"
 								});

 								return formatter.format(total);
 							}
 						}
 					})
 				]
 			}));
 		},
 		onNavBack: function() {
 			var oHistory = History.getInstance();
 			var sPreviousHash = oHistory.getPreviousHash();

 			if (sPreviousHash !== undefined) {
 				window.history.go(-1);
 			} else {
 				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 				oRouter.navTo("main");
 			}
 		},
 		toInvoice: function(evt) {
 			this.selected = this.getView().byId("detailTable").getSelectedItems();

 			if (this.selected.length === 0) {
 				MessageBox.information("No realizo ninguna seleccion o todas las posiciones se encuentran facturadas");
 			} else {
 				var that = this;
 				if (!that.pressDialog) {
 					that.pressDialog = new sap.m.Dialog("dialog", {
 						title: "Subir Factura",
 						content: new FileUploader({
 							fileType: ["xml"],
 							typeMissmatch: function(oEvent) {
 								MessageBox.error("Incorrect file type");
 							},
 							placeholder: "Seleccione facturas"
 						}).addStyleClass("sapUiSmallMarginBeginEnd"),
 						beginButton: new Button({
 							text: "Subir",
 							type: "Accept",
 							press: function() {
 								that.showX(5000);
 								that.pressDialog.close();
 							}
 						}),
 						endButton: new Button({
 							text: "Cerrar",
 							type: "Reject",
 							press: function() {
 								that.pressDialog.close();
 							}
 						})
 					});

 					//to get access to the global model
 					this.getView().addDependent(that.pressDialog);
 				}

 				that.pressDialog.open();
 			}
 		},
 		markSelected: function(selected) {
 			var products = "";

 			var oModel = sap.ui.getCore().getModel();

 			for (var i = 0; i < selected.length; i++) {
 				products = products + selected[i].getBindingContext().getObject().Product + ", ";
 				selected[i].getBindingContext().getObject().Invoiced = "True";
 			}

 			var fac = oModel.getProperty("/PurchaseOrdersStats/0/Facturados") + 1;
 			oModel.setProperty("/PurchaseOrdersStats/0/Facturados", fac);

 			var noFac = oModel.getProperty("/PurchaseOrdersStats/0/No_Facturados") - 1;
 			oModel.setProperty("/PurchaseOrdersStats/0/No_Facturados", noFac);

 			oModel.setProperty("/PurchaseOrders/" + String(this.index) + "/InvoiceLevel", 1);

 			var that = this;

 			MessageBox.success("Productos Facturados: " + products.substring(0, products.length - 2), {
 				onClose: function(oAction) {
 					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
 					oRouter.navTo("main");
 				}
 			});
 		},
 		hideBusyIndicator: function() {
 			sap.ui.core.BusyIndicator.hide();
 			this.markSelected(this.selected);
 		},
 		showBusyIndicator: function(iDuration, iDelay) {
 			sap.ui.core.BusyIndicator.show(iDelay);

 			if (iDuration && iDuration > 0) {
 				if (this._sTimeoutId) {
 					jQuery.sap.clearDelayedCall(this._sTimeoutId);
 					this._sTimeoutId = null;
 				}

 				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
 					this.hideBusyIndicator();
 				});
 			}
 		},
 		showX: function(time) {
 			this.showBusyIndicator(time);
 		}
 	});
 });