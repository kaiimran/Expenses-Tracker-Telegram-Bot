var token = "<your bot token from BotFather>";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "<click publish tab, deploy as app and copy the full https://script.google.com/macros/s/...>";

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

function sendMessage(id, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var id = contents.message.from.id;
  var text = contents.message.text;
  var first_name = contents.message.from.first_name;
  if(id === <search userinfobot in telegram to get your UserID>) {
    var ssId = "<get your spreadsheet id after https://docs.google.com/spreadsheets/d/...>";
    var expenseSheet = SpreadsheetApp.openById(ssId).getSheetByName("Sheet1");
      
    if (text == "Budget") {
      var budget = expenseSheet.getDataRange().getCell(1,2).getValue();
      sendMessage(id, "Hi " + first_name + ", your allocated budget is RM" + budget);
    }
    else if(text.substring(0, 8) == "Budget +") {
      var item = text.split("+");
      if( !isNaN(parseFloat(item[1])) && !isNaN(item[1] - 0) ) {
        var budget = expenseSheet.getDataRange().getCell(1,2).getValue();
        var newBudget = parseFloat(budget) + parseFloat(item[1]);
        var budgetCell = expenseSheet.getRange("B1");
        budgetCell.clearContent();
        budgetCell.setValue(newBudget);
        sendMessage(id, "Budget updated from RM" + budget + " to RM" + newBudget);
      }
      else {
        sendMessage(id, "Budget + " + "[amount] where [amount] must be a number");
      }
    }
    else if (text == "Expenses") {
      var expenses = expenseSheet.getDataRange().getCell(2,2).getValue();
      sendMessage(id, "Total expenses = RM" + expenses);
    }
    else if (text == "Balance") {
      var balance = expenseSheet.getDataRange().getCell(3,2).getValue();
      sendMessage(id, "Balance left = RM" + balance);
    }
    else if (text == "Delete last") {
      var lastRow = expenseSheet.getLastRow();
      if (lastRow > 4.0) {
        var lastRowValues = expenseSheet.getRange(lastRow, 2, 1, 2);
        sendMessage(id, "Deleting: " + lastRowValues.getValues() );
        expenseSheet.deleteRow(lastRow);
      }
      else {
        sendMessage(id, "No more item the sheet.");
      }
    }
    else {
      if(text.indexOf("-") !== -1) {
        var nowDate = new Date;
        var reformatedDate = nowDate.getDate() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getFullYear() ;
        var item = text.split("-");
        if( !isNaN(parseFloat(item[1])) && !isNaN(item[1] - 0) ) {
          expenseSheet.appendRow([reformatedDate, item[0], item[1]]);
        }
        else {
          sendMessage(id, "Format: [item] - [price] where [price] must be a number");
        }
      }
      else {
        sendMessage(id, "Please send using this format: [item] - [price]");
      }
    }
  }
  else {
    sendMessage(id, "Hi " + first_name + ", you are not authorized to use this bot.");
  }
}
