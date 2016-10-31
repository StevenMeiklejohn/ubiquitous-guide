var calculator = calculator || {};

calculator.initialize = function() {
  calculator.previousOperator = null; // the last operator the user cliced
  calculator.previousTotal = 0;       // the total of the previous operation
  calculator.newTotal = true;         // whether the previous operation has just been calculated
  calculator.runningTotal = 0;        // the current value to operate on the previous total

  calculator.add = function(number){
    calculator.runningTotal = parseFloat(calculator.previousTotal) + parseFloat(number);
  };

  calculator.subtract = function(number){
    calculator.runningTotal = parseFloat(calculator.previousTotal) - parseFloat(number);
  };

  calculator.multiply = function(number){
    calculator.runningTotal = parseFloat(calculator.previousTotal) * parseFloat(number);
  };

  calculator.divide = function(number){
    if (number===0) {calculator.runningTotal='error'}
      else{
    calculator.runningTotal = parseFloat(calculator.previousTotal) / parseFloat(number)};
  };

  calculator.numberClick = function(number) {
    // when a number is clicked, if a previous operation has just been completed,
    // or there is a zero in the running total, clear the running total, and reset
    // the `newTotal` flag
    if (calculator.runningTotal == 0 || calculator.newTotal) {
      calculator.runningTotal = '';
      calculator.newTotal = false;
    }
    // concatenate the clicked number to the running total
    calculator.runningTotal = parseFloat('' + calculator.runningTotal + number);
  };

  calculator.operatorClick = function(operator) {
    // if there was a previous operator recorded as having been clicked, perform
    // the operation for the previous operator
    if (calculator.previousTotal && calculator.previousOperator) {
      switch (calculator.previousOperator) {
        case ('+'):
        calculator.add(calculator.runningTotal);
        break;
        case ('-'):
        calculator.subtract(calculator.runningTotal);
        break;
        case ('*'):
        calculator.multiply(calculator.runningTotal);
        break;
        case ('/'):
        calculator.divide(calculator.runningTotal);
        break;
      }
    }

    // if the 'equals' button was clicked, clear the previous operator, otherwise
    // record what the previous operator was
    if (operator == '=') {
      calculator.previousOperator = null;
    } else {
      calculator.previousOperator = operator;
    }
    // replace the previous total with the current running total and flag that a
    // new total has been calculated
    calculator.previousTotal = calculator.runningTotal;
    calculator.newTotal = true;
  };

  calculator.clearClick = function() {
    if (calculator.runningTotal == 0) {
      calculator.previousOperator = null;
      calculator.previousTotal = null;
    }
    calculator.runningTotal = 0;
  };

};


$(function(){
  calculator.initialize();

  function updateView() {
    $('#running_total').val(calculator.runningTotal);
  };

  // iterate all the elements with a class of 'number' and bind the `numberClick`
  // function to them being clicked
  var numbers = $('.number');
  numbers.each(function(i, number) {
    $(number).click(function(e) {
      calculator.numberClick(e.originalEvent.srcElement.innerText);
      updateView();
    });
  });

  // iterate all the elements with a class of 'operator' and bind the `operatorClick`
  // function to them being clicked
  var operators = $('.operator');
  for (var i = operators.length - 1; i >= 0; --i) {
    operators[i].addEventListener('click', function(e) {
      operator = (e.srcElement.innerText);
      calculator.operatorClick(operator);
      updateView();
    });
  };

  // handle clicking of the 'clear' button
  $('#clear').click(function() {
    calculator.clearClick();
    updateView();
  });
});

