##Bank Mongo

[i]: Make sure introduction to MongoDB has been done.

We want to add accounts. Let's see how we can do this using MongoDB. How can we do this?

# Setup

- start mongo (might need sudo)
```
  mongod
```
- add some info
```
  mongo
```
```
 use bank
```
```
  db.accounts.insert(  
    { owner: "jay",
      amount: 125.50,
      type: "personal"
    }
  );
```

#Using in Node
- install mongodb node driver


```
  npm install mongodb --save
```

[i]:  Make sure not in the client folder.

https://docs.mongodb.org/ecosystem/drivers/node-js/


We can use the driver to connect to mongo and send out data.

The driver works in convention with Node, aynchronously, using callbacks that first expect an error to be passed.

```
var MongoClient = require('mongodb').MongoClient
...
  app.get('/accounts', function(req,res){
    // Connection URL
    var url = 'mongodb://localhost:27017/bank';
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('accounts');
      collection.find({}).toArray(function(err, docs) {
        res.json(docs)
        db.close();
      });
    });
  })
```

We can now see this being served up

```
localhost:3000/accounts
```

And in our application localhost:3000


## Adding accounts to the database.

Let's set up the backend to also be able to add accounts.  

### Getting information from the body of a post request

What type of request should we handle to add an account?

Create action.  post to '/accounts'

```
  app.post('/accounts', function(req,res){
    res.status(200).end()
  })
```

Now how we can make post requests to test our handler? There are many HTTP client applications that can help us make tailored HTTP requests. curl is a command line application.  *Insomnia* is an application that allows us to make HTTP requests to the server using the browser as a Graphical User Interface.  

Install Insomnia from the Chrome webstore
https://chrome.google.com/webstore/detail/insomnia-rest-client/gmodihnfibbjdecbanmpmbmeffnmloel?hl=en

Make requests.

POST
localhost:3000/accounts

{ "owner": "zxcv",
  "amount": 220.25,
  "type": "business"
}

##Receiving the information

To receive the information from the request we need to add some libraries to parse the input.

body-parser npm package is designed to do exactly this, so we can recieve the json we're passing.

```
  npm install body-parser --save
```

```
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
```


```
  app.post('/accounts', function(req,res){
    console.log('body', req.body);
    res.status(200).end()
  })
```

Excellent so the information is being passed through.

Now we can set up Mongo to add the data

```
  app.post('/accounts', function(req,res){
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('accounts');
        collection.insert(
          { "owner": req.body.owner,
            "amount": req.body.amount,
            "type": req.body.type
          }
        )
        res.status(200).end()
        db.close();
    });
  })
```

##Setting up frontend to add accounts.

The server is waiting hungry to add accounts,  but our client cannot currently satisfy this. Let's add a form to our front-end so that it can add accounts.


```
  //index.html

  <h2> Add Account </h2>
  <form id="add-account">
    <input type="text" placeholder="Owner" id="owner">
    <input type="number" placeholder="Amount" id="amount">
    <input type="text" placeholder="Type" id="type">
    <input type="submit" id="submit">
  </form>
```

The form is now there for the user.  Let's first get the information from the form

```
  form.onsubmit = function(e){
    e.preventDefault();
    var account = {
      owner: document.querySelector("#owner").value,
      amount: parseFloat(document.querySelector("#amount").value),
      type: document.querySelector("#type").value
    }
    console.log('account', account)
  }
```

Okay now let's add it to the frontend so that we can see the updates.

```
  form.onsubmit = function(e){
    e.preventDefault();
    var account = {
      owner: document.querySelector("#owner").value,
      amount: parseFloat(document.querySelector("#amount").value),
      type: document.querySelector("#type").value
    }
    console.log('account', account)
    bank.addAccount(new Account(account));
    displayBank(bank);
  }
```

Notice that the lists are growing let's fix this by clearing them each time we refresh.

```
var displayBank = function(bank){
  var totalDisplay = document.getElementById('total');
  var businessTotalDisplay = document.getElementById('business-total');
  var personalTotalDisplay = document.getElementById('personal-total');

  totalDisplay.innerText = "Total: £" + bank.totalCash();
  businessTotalDisplay.innerText = "Total Business: £" + bank.totalCash('business');
  personalTotalDisplay.innerText = "Total Personal: £" + bank.totalCash('personal');

  var businessAccountList = document.getElementById('business-accounts');
  var personalAccountList = document.getElementById('personal-accounts');

  //ADD THIS
  businessAccountList.innerHTML = ""
  personalAccountList.innerHTML = ""
  //

  populateAccountList(businessAccountList, bank.filteredAccounts('business'))
  populateAccountList(personalAccountList, bank.filteredAccounts('personal'))
}
```

So the front-end is updating.  Now it's time for us to persist.  Let's send the request.


```
var form = document.querySelector("#add-account")
form.onsubmit = function(e){
  e.preventDefault();
  var account = {
    owner: document.querySelector("#owner").value,
    amount: parseInt(document.querySelector("#amount").value),
    type: document.querySelector("#type").value
  }
  bank.addAccount(new Account(account));
  displayBank(bank);
  //persist
  var request = new XMLHttpRequest();
  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = function(){
    if(request.status === 200){
    }
  }
  request.send(JSON.stringify(account));
}
```

Now when we refresh we see the data has updated.

What we have done here is 'optimistically' updated the view.  We are assuming the server is going to behave as it should - this allows the frontend to update without having to wait from the server.  A wise extension would be to warn the user whenever there is a connection error.  "Connection lost".  Example: Trello.
