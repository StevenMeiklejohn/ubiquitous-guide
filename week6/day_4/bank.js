var Bank = function(){
  this.accounts = [100,200,300,400];
  this.total = 0;
}

Bank.prototype ={
  setTotal: function(){
    this.total = 0;
    this.accounts.forEach(function(account){
      // while this callback function is off being performed in node land, the 'this.total' is no longer reffering to the bank. In node land this is a global object, so using 'this.total' here calls the total of every global variable.
      this.total += account;
      console.log(this);
      // we avoid this by using the .bind(this) command to bind function to the bank.
      // we could also avoid the issue by using a 'this = that' then replacing 'this' with 'that' in the callback function.
     }.bind(this));
  }
}

var hsbc = new Bank();
console.log('hsbc total =', hsbc.total);
hsbc.setTotal();
console.log('total after=', hsbc.total);