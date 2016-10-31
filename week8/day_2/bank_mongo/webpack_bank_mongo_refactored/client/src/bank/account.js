var Account = function(params){
  this.owner = params.owner;
  this.amount = params.amount;
  this.type = params.type;
};

Account.prototype = {
  save: function(){
    var url = 'http://localhost:3000/accounts';
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function(){
      if(request.status === 200){
      }
    }
    request.send(JSON.stringify(this));
  }
}

module.exports = Account;
