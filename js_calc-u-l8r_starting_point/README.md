# JavaScript Calculator Testing

As a user I want to be able to perform simple arithmetic functions in a web browser.

The code provided has a calculator object with functions to add, subtract, divide, and multiple given numbers to a previous total. This allows the user to chain multiple operations one after the other, and then ask for the total.

This is integrated into an HTML page that gives a 'calculator layout' of buttons which operate the functionality of the JavaScript.

The calculator object has properties to keep track of calculations as it performs them.


You can run the code from the terminal with `python -m SimpleHTTPServer`.

install the following; 
`npm install karma -g`,
`npm install webdriver-manager -g`,
`npm install protractor -g`

You can run the unit test framework from the terminal with `karma start`.

You can run the integration/acceptance test framework from the terminal with `webdriver-manager start` and `protractor protractor.conf.js` in another terminal.


There are no unit tests, or integration tests, to ensure that the code is operating exactly as expected.

You need to write unit tests to ensure that the majority of functions in the calculator operate correctly:

  - calculator.add()
  - calculator.subtract()
  - calculator.multiply()
  - calculator.divide()
  - calculator.numberClick()
  - calculator.operatorClick()
  - calculator.clearClick()

You need to write integration/acceptance tests to ensure all of the units of code work together in the browser to perform as the user would wish.

  - Do the number buttons work to update the display of the running total?
  - Do each of the arithmetical operations work to update the display with the result of the operation?
  - Can we chain multiple operations together?
  - Does it work as expected for a range of numbers? (positive, negative, decimals, large numbers)

What does the code do in exceptional circumstances?

  - If you divide by zero, what is the effect?
  - Can you write a test to describe what you'd prefer to happen, and then correct to code to make that test pass.




