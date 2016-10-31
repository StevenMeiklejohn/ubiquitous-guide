### title

Sinatra, Calc-U-L8R demo app

### objectives

- Utilise dynamic paths and explore routing
- Understand controllers and why we use them
- serve up content in multiple data types

### summary

c. 1hr 15min

The point of this app is to put into practice the basics of using Sinatra, and introduce serving content types.

====================

Let's build a sinatra calculator.

We'll need to start with a new folder for our app.

```
  mkdir sinatra_calc
  cd sinatra_calc
```

We're going to have multiple files in this one, so let's start with a controller file.

```
  touch controller.rb
```

What routes are we going to make for a calculator? We could use one for all the functionality of our calculator. So add, subtract, multiply and divide. Let's just start with add.

We need to take a couple of inputs dynamically. We can setup a path with tw dynamic values

```
  # controller.rb
  require( 'sinatra' )
  require( 'sinatra/contrib/all' ) if development?
  require( 'pry-byebug' )

  get '/add/:num1/:num2' do
    
  end
```
What do you think will happen if we go to the "/add" route? A blank page.

Cool, now we need to think about our calculators functionality. We want good, test driven code so let's setup our structure:

```

mkdir models specs
touch models/calculator.rb specs/calculator_spec.rb

```

Let's dive away from web and think about our calculator. What object do we want? and what methods? We probably want to have a calculator class, so lets setup our tests for that.

```
# calculator_spec.rb

require( 'minitest/autorun' )
require_relative( '../models/calculator' )

class TestCalculator < Minitest::Test

  def setup
    @calculator = Calculator.new( 4, 2 )
  end

  def test_add
    assert_equal( 6, @calculator.add() )
  end

end

```

Run the spec and get the error. We see we get an unitialized constant Calculator. This means we don't have a class setup.

As OO programmers we have instantiated a calculator object. We can now go and create that:

```
# calculator.rb

class Calculator

  def initialize( num1, num2 )
    @num1 = num1
    @num2 = num2
  end

  def add
    return @num1 + @num2
  end

end

```

- our calculator takes two integers on initialize 
- we also have an add method
- run the test and get a pass!

In our controller.rb we can now finish our route method:

```
# controller.rb

require_relative( './models/calculator' )

get '/add/:num1/:num2' do 
  # binding.pry
  calculator = Calculator.new( params[:num1].to_i, params[:num2].to_i )
  return "#{calculator.add()}"
end

```

Here we have:

1. Created an instance of a Calculator and assigning it to variable calculator
2. Return string class
3. Invoke the add function inside interpolation

If we refresh the browser - we should get 6!

[TASK: 30 MINS] Complete our app to have test driven calculator to divide, multiply and subtract. Add routes which return the result.

```

## controller.rb 

get '/subtract/:num1/:num2' do 
  calculator = Calculator.new( params[:num1].to_i, params[:num2].to_i )
  return "#{calculator.subtract()}"
end

get '/multiply/:num1/:num2' do 
  calculator = Calculator.new( params[:num1].to_i, params[:num2].to_i )
  return "#{calculator.multiply()}"
end

get '/divide/:num1/:num2' do 
  calculator = Calculator.new( params[:num1].to_i, params[:num2].to_i )
  return "#{calculator.divide()}"
end

## calculator.rb

  def subtract
    return @num1 - @num2
  end

  def multiply
    return @num1 * @num2 
  end

  def divide
    return @num1 / @num2
  end
  
## calculator_spec.rb

  def test_subtract
    assert_equal( 2, @calculator.subtract() )
  end

  def test_multiply
    assert_equal( 8, @calculator.multiply() ) 
  end

  def test_divide
    assert_equal( 2, @calculator.divide() )
  end

``` 

## Serving content

Cool, we have created a functional app which works brilliantly as a calculator. But what are we actually sending to the view? 

We are actually sending a string down just now. If we cmd-alt-u and view the source of our page you will notice there is no HTML. As we are in control of what we send we dictate what we send to the client.  As mentioned, servers can send down loads of types of data. So let's play around with a couple that are very common.

### JSON

Standing for JavaScript Object Notation this is a very common format to interchange data. We will use this later on in the course more, but it's useful to see that we can send it to the view.

Let's create a route to handle all calculations:

```
#controller.rb

require( 'json' )

get '/all/:num1/:num2' do 
  content_type( :json )
  
  calculator = Calculator.new( params[:num1].to_i, params[:num2].to_i )
  results = {
    add: calculator.add(),
    subtract: calculator.subtract(),
    multiply: calculator.multiply(),
    divide: calculator.divide()
  }

  return results.to_json
end

```

Here we have required the JSON module from ruby and in our route we declare what the content_type is going to be (so the internet knows what data we are sending). We then create a hash of data which we return by using the to_json method provided by the Ruby module.

### HTML

Everyday, we will all be requesting this file type without probably even knowing we are. HyperText Markup Language is sent back from servers to users to display and structure content. So, it's important we know how to send HTML. 

There is many ways to create HTML. We could use .html and send this but because we are building dynamic apps we probably want to add content to our pages dynamically. We can use templates.

[DRAW]: request comes in - processes request and gets data and then generates HTML and sends down:

1. Request comes in
2. Grab resource (data from database/process information)
3. Inject to html
4. Page sent down as HTML. Not ERB.

In Sinatra & ruby frameowrks we can use ERB. This stands for embedded ruby. This allows us to write and reference ruby and inject dynamic content. Let's give this a go.

```
  mkdir views
  touch views/result.erb
  
```

Sinatra is lightweight and unopinionated which means that we have to do a lot of setup ourselves and we decide how our app is structured. The one assumption it does make though is that our html templates in erb live in a views folder.

```
  # views/result.erb
  <h1>the result is <%= @calculation %></h1>
```

[ASIDE:]

We need to be careful with equals sign. If we take the equals away what happens? Nothing is rendered! 

This becomes very important when we are using if statements etc.

```
  <% if true %>
  <%= "cats" %>
  <% else %>
  <%= "dogs" %>
  <% end %>
```
Anything to be rendered needs an = sign, and everything to be evaluated must not. If we put an = beside the end tag, what happens? We need to be careful with this.

We now need to use our result template and send in our dynamic content. In our add route:

```
  # remove return...
  @calculation = calculator.add()
  erb( :result )

```

You can think of adding the @ sign as creating a bridge between the controller and the view, so that the variable can be accessed.

We also need to change the return value of the method to tell `erb` to use the `views/result.erb` view. Since we stuck to the convention and named the folder "views" we simply need to use the erb keyword and pass the name of the view as a symbol.

Complete the mutiply, subtract and divide routes sending down the same result erb.


# Layouts (templates)

```
  # views/result.erb
  <!doctype html>
  <html lang='en'>
    <head>
      <meta charset='utf-8'>
      <title>CalcUL8R</title>
    </head>
    <body>
      the result is <%= @calculation %>
    </body>
  </html>
```

But *all* of our ERB files will need that... and we want to be DRY.

So we'll put our `result.erb` back to what it was before, and create a new view with all of the HTML template code.

This is where "layout" files come in - they allow us to share this scaffolding code across all our views.  Another convention is that we should call this "layout.erb" to allow sinatra to do it's magic.

```
  touch views/layout.erb
```

```
  # views/result.erb
  the result is <%= @calculation %>
```

```
  # views/layout.erb
  <!doctype html>
  <html lang='en'>
    <head>
      <meta charset='utf-8'>
      <title>Calculator</title>
    </head>
    <body>
      <%= yield %>
    </body>
  </html>
```

Since we adhered to the convention of calling our layout the right name, sinatra knows that when we call each page, it should render the layout pages as a sort of container, then when we use the special work yield it knows to call the entire contents of the child page using it.

[i:] draw this on the board.

# More than one view

What should we do if we want to add other pages to our app? If we want to have an "about us" page, or and "faq", what sorts of things will we need?

## Create a link

Let's put a menu in our layout. It will have two links -- one for our root path (home page), and one for our new page.

```
  <body>
    <nav>
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="/about_us">about us</a></li>
      </ul>
    </nav>
    <%= yield %>
  </body>
```

If we refresh our browser, and click the "about us" link, we get an error about Sinatra not knowing this ditty, and some suggested code that might solve our problem.

[i:] Ask the students if they remember how to make a homepage.

```
  # controller.rb
  get '/' do
    erb :home
  end

  get '/about_us' do
    erb :about_us
  end
```

Now when we click the link we get an error about a missing template. We need to create a correctly-named view file, and put some content in it.

```
  # terminal
  touch views/home.erb
  touch views/about_us.erb
```

```
  <h1>About Us</h1>
  <p>This page is all about us. We're great at making calculators!</p>
```

We can follow this process whenever we want a new route through our app.

  1) Create a link for the new route you want to create - you'll get a routing error when you visit it
  2) Add the route-handling code to the controller (the `contrller.rb` file) - you'll get an error about a missing template/view
  3) Make the view file and populate it with what you want the user to see
  4) Go back to '1' for the next feature

This is a similar approach to the BDD stuff we were doing in the command line.  Create the behaviour you want, then follow the steps to make it happen.

# Customising the output

From this point on, the view files can be treated like HTML, and to customise the appearance of HTML, we need some CSS.

We'll create a "public" folder to store static assets. Sinatra looks for any matching path in the public folder before matching routes for requests.

```
  mkdir public
  touch public/style.css
```

```
  # views/layout.erb (head tag)
  <link rel='stylesheet' href='/style.css'>
```

```
  # public/style.css
  body {
    background-color: green;
  }
```