describe('calculator functionality', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.get('http://0.0.0.0:8000');
});

  it('should update the display with number butons clicked', function() {
    element(by.id('number1')).click();
    element(by.id('number2')).click();
    element(by.id('number3')).click();
    element(by.id('number4')).click();
    element(by.id('number5')).click();
    element(by.id('number6')).click();
    element(by.id('number7')).click();
    element(by.id('number8')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('12345678');
  });

  it('should add numbers', function() {
    element(by.id('number1')).click();
    element(by.id('operator_add')).click();
    element(by.id('number6')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('7');
  });


  it('should subtract numbers', function() {
    element(by.id('number8')).click();
    element(by.id('operator_subtract')).click();
    element(by.id('number2')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('6');
  });

  it('should multiply numbers', function() {
    element(by.id('number5')).click();
    element(by.id('operator_multiply')).click();
    element(by.id('number3')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('15');
  });

  it('should divide numbers', function() {
    element(by.id('number8')).click();
    element(by.id('operator_divide')).click();
    element(by.id('number2')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('4');
  });

  it('should chain multiple operations together', function() {
    element(by.id('number8')).click();
    element(by.id('operator_divide')).click();
    element(by.id('number2')).click();
    element(by.id('operator_multiply')).click();
    element(by.id('number3')).click();
    element(by.id('operator_add')).click();
    element(by.id('number2')).click();
    element(by.id('operator_subtract')).click();
    element(by.id('number5')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('9');
  });

  it('should work as expected for a range of negative numbers', function() {
    element(by.id('number1')).click();
    element(by.id('number0')).click();
    element(by.id('number0')).click();
    element(by.id('operator_subtract')).click();
    element(by.id('number2')).click();
    element(by.id('number0')).click();
    element(by.id('number0')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('-100');
  });

  it('should work as expected for decimal numbers', function() {
    element(by.id('number7')).click();
    element(by.id('operator_divide')).click();
    element(by.id('number2')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('3.5');
  });

  it('should work as expected for large numbers', function() {
    element(by.id('number7')).click();
    element(by.id('operator_divide')).click();
    element(by.id('number2')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('3.5');
  });

  it('should divide by zero', function() {
    element(by.id('number8')).click();
    element(by.id('operator_divide')).click();
    element(by.id('number0')).click();
    element(by.id('operator_equals')).click();
    expect(element(by.id('running_total')).getAttribute('value')).toEqual('error');
  });







  // What does the code do in exceptional circumstances?

    // - If you divide by zero, what is the effect?
    // - Can you write a test to describe what you'd prefer to happen, and then correct to code to make that test pass.


  });



