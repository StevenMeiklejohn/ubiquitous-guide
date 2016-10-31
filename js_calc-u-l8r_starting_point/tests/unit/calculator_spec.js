describe('calculator', function () {
  beforeEach(function () {
    calculator.initialize();
    calculator.previousTotal = 10;
    calculator.previousOperator = '+';
    calculator.runningTotal = 2;
  });

  // write unit tests here in the form of "it should do something..."


  // - calculator.clearClick()

 it('should be able to add a number', function(){calculator.add(5);
    expect(15).toBe(calculator.runningTotal)});

 it('should be able to subtract a number', function(){calculator.subtract(5);
    expect(5).toBe(calculator.runningTotal)});

 it('should be able to multiply numbers', function(){calculator.multiply(5);
    expect(50).toBe(calculator.runningTotal)});

 it('should be able to divide', function(){calculator.divide(2);
    expect(5).toBe(calculator.runningTotal)});

 it('should perform number click', function(){calculator.numberClick(20);
    expect(20).toBe(calculator.runningTotal)});

 it('should perform operator click', function(){calculator.operatorClick('-');
    expect(12).toBe(calculator.runningTotal)});

 it('should perform clear click', function(){calculator.clearClick();
    expect(0).toBe(calculator.runningTotal)});

});
