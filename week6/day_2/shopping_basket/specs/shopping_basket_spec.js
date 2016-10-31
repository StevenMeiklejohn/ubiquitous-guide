var basket = require( '../shopping_basket');
var assert = require( 'chai' ).assert;


describe( 'Shopping basket', function() {
  // beforeEach(function(){
  //   basket.items = 0;
  // });

  it( 'should be able to count items', function() {
    assert.equal(4, basket.contents.length);
  });

  it( 'should be able to add items', function() {
    basket.addItem('hairdryer', 'electronics', 30);
    console.log(basket.contents)
    assert.equal(5, basket.contents.length );
  });

  it( 'should be able to remove items', function() {
    basket.removeItem('hairdryer');
    console.log(basket.contents)
    assert.equal(4, basket.contents.length );
  });

  it( 'should be able to be empty', function() {
    basket.empty();
    assert.equal(0, basket.contents.length);
  });

  // it( 'should take a 10% discount on shopping over £20', fucntion() {
    
  // })


  });
