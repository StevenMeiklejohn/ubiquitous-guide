#Intro to MongoDB

##Learning Objectives
  - Understand the difference between SQL and NoSQL databases.
  - Install MongoDB
  - Use the mongo shell to interact with the db.
  - Learn the main MongoDB commands

##Introduction
So far we've been manipulating data in the form of JavaScript objects. Now we're going to look at persisting the data and for this we'll need to use a database.

##Popular Persistence Options for Node
So far we've used Postgres and SQLite as our database layer.

Both of these use SQL as the primary language for manipulating the data. We can use SQL databases with our node and Express apps and Postgres is a popular choice with many developers.

Qs: Can anyone remember what SQL stands for and how data is stored in a SQL database?

[i] DRAW ON BOARD - example of ER Diagram:

	Student | belongs to | Cohort
	Instructor | teaches | Cohort
	Student | submits | Project

Leads to 6 tables!

Today we're going to look at an alternative to SQL databases. These are called NoSQL databases.

That means we interact with the database in a different way. NoSQL databases can be used with many languages and frameworks, not just JavaScript apps.

NoSQL is a popular choice for JavaScript apps because it stores data in a convenient way that is easy to convert to JavaScript objects.

##MongoDB
Today we're going to look at the benefits of using what have come to be termed NoSQL databases for the manipulation of unstructured data. MongoDB [MongoDB](https://www.mongodb.org) is an example of a NoSQL database which we're going to start using to persist data in our apps.

MongoDB comes from the name "humongous" for being able to scale to handle huge data sets. The data resembles JSON, actually it's actually stored as BSON (Binary-Formatted) JSON. MongoDB is a document database and as well as being good for storing JSON, it can also be used to store PHP arrays, Python dictionaries and Ruby and Perl hashes.

The term NoSQL simply means that the server doesn't enforce that your data is relational and it doesn't use standard SQL syntax. We query for objects with properties. They are designed to be run on large clusters and are open source.

###INNER Join Recap

INNER JOIN

![INNER JOIN](images/img_innerjoin.png)

An inner join produces a result set that is limited to the rows where there is a match in both tables for what we're looking for.  If you don't know which kind of join you need, this will usually be your best bet.

[!] SHOW example of SQL syntax on board:

	SELECT `firstname` || ` ` || `lastname`
	FROM Student
	WHERE student_id IN
		(SELECT Student.student_id FROM Student
		INNER JOIN CohortRegister
		ON Student.student_id = CohortRegister.student_id
		INNER JOIN Cohort
		ON CohortRegister.cohort_id = Cohort.cohort_id
		WHERE Cohort.name = `Cohort2`
		);

###FULL Outer Join Recap

The FULL OUTER JOIN keyword returns all rows from the left table (table1) and from the right table (table2).

![FULL OUTER JOIN](images/img_fulljoin.gif)

The FULL OUTER JOIN keyword combines the result of both LEFT and RIGHT joins.

Below is a selection from the "Customers" table:

| CustomerID | CustomerName | ContactName | 	Address | City | Postcode | Country |
|---|---|---|---|---|---|---|
| 1 | Alfreds Futterkiste | Maria Anders | Obere Str. 57 | Berlin | 12209 | Germany |
| 2 | Ana Trujillo Emparedados y helados | Ana Trujillo | Avda. de la Constitución 2222 | México D.F. | 05021 | Mexico |
| 3 | Antonio Moreno Taquería | Antonio Moreno | Mataderos 2312 | México D.F. | 05023 | Mexico |

And a selection from the "Orders" table:

| OrderID | CustomerID | EmployeeID | OrderDat | 	ShipmentID |
|---|---|---|---|---|
| 10308 | 2 | 7 | 2016-01-18 | 3 |
| 10309 | 3 | 3 | 2016-01-19 | 1 |

SQL FULL OUTER JOIN Example
The following SQL statement selects all customers, and all orders:

	SELECT Customers.CustomerName, Orders.OrderID
	FROM Customers
	FULL OUTER JOIN Orders
	ON Customers.CustomerID=Orders.CustomerID
	ORDER BY Customers.CustomerName;

A selection from the result set may look like this:

| CustomerName | OrderID |
|---|---|
| Alfreds Futterkiste | |
| Ana Trujillo Emparedados y helados | 10308 |
| Antonio Moreno Taquería | 10309 |

Note: The FULL OUTER JOIN keyword returns all the rows from the left table (Customers), and all the rows from the right table (Orders). If there are rows in "Customers" that do not have matches in "Orders", or if there are rows in "Orders" that do not have matches in "Customers", those rows will be listed as well.

###ACID

You may come across a set of properties termed ACID in SQL databases which stands for
Atomicity (All or Nothing),
Consistency (database remains in valid state - constraints and referential integrity),
Isolation (transactions executed serially),
Durability (after commit data remains in consistent state) when executing SQL transactions. These do not apply to NoSQL databases.

Today we're going to look at installing MongoDB on our computers and interacting with it directly (without using a node app).

MongoDB is a good choice for us because there is an Object Document Mapper (ODM) called Mongoose which makes it easy to map our JavaScript objects to Mongo documents. It's a bit like ActiveRecord in the world of Rails.

But for now, we'll be using MongoDB on it's own.

##Collections and Documents
NoSQL databases are also known as document based databases. That's because data is stored in ***documents***.

Let's compare SQL terms with NoSQL terms.

[i]: DRAW ON BOARD

|  SQL Database |  MongoDB |
|---|---|
| Database | Database |  
| Table | Collection |  
| Row  | Document |
| Column | Field |
| Primary Key | id Field |
| Group By | Aggregation |

One of the key features of a NoSQL database is that a ***document*** does not have to have the same fields as the other documents in the collection.

So you could have a collection of vehicles but a bike document would have different fields to a car document. We can also *embed* related data in a document. We'll see this later on.

MongoDB also doesn't have the concept of join tables. This is claimed to be one of the performance advantages.

You would need to perform the equivalent functionality in your application logic.

In some circumstances you will need to use a SQL database. Banking apps typically require strong referential integrity and complex joins as well as the need to rollback the database to a previous consistent point in time. MongoDB just wasn't designed for this purpose so it's not a wise choice in all circumstances.

These differences make MongoDB (and other NoSQL databases) suitable for things like realtime, big data and social media apps or for any app that requires event logging, mobile & location services, agile development.

##Mongo Documents

Two of the main advantages of using a document database are:

 - Documents (i.e. objects) correspond to native data types in many programming languages.
 - Embedded documents and arrays reduce need for expensive joins.

So what does a Mongo document look like?

In our students example we may have something that looks like:

```
{
    _id: ObjectId("5ef890sdfg8e070wer8sd8"),
    name: { first: "John", last: "Smith" },
    class: "cohort1",
    dob: new Date('Jun 23, 1991'),
    degree: {university: "University of Glasgow", subject: "Computer Science", class: "2:1"},
    languages: [ "English", "French", "German" ],
    twitterHandle: @jsmith90,
    tweets: 354
}
```

We can see that this document looks very much like a JavaScript object. This makes it easy for us to manipulate in JavaScript. It looks a bit like JSON!

Documents stored in a collection require a special ***_id*** field that acts as a primary key. Mongo uses the ObjectId method to create a new primary key for a document.

##Installing MongoDB

Let's use Homebrew to install MongoDB.

Before we start let's update our version of brew:

```
//terminal

brew update
```

Then upgrade to latest version of mongodb
```
//terminal

brew upgrade mongodb
```

Now we can install mongodb
```
//terminal

brew install mongodb
```

Homebrew will create a /data/db folder on your computer. This is where Mongo looks for data. If Homebrew didn't create it we will have to create it ourselves.

[i]: Make sure everyone has a /data/db folder. You can "cd /" to get to the root. You might also have to change permissions on the db folder to 777. "chmod 777 db" just so Mongo can access it.

Now that we have Mongo installed, we need to start the database engine.

```
//terminal

mongod
```
You should get a message in your terminal saying ***waiting for connections*** (amongst other things). To stop the engine press control-c.

MongoDB comes with a JavaScript shell that acts a bit like a console and lets us talk to the Mongo databases on our computer.

Open a new tab in your terminal window (command-t) and type ***mongo***

```
//terminal

mongo
```

Let's recap that.

 - "mongod" is the command to start the engine
 - "mongo" is the command to start the JavaScript shell so we can interact with the engine.

Let's try out a few of the main commands we can execute.

[i]: RUN THROUGH THESE ON THE SCREEN AND GET STUDENTS TO TYPE THEM IN

| Action | Command |
|---|---|
| List the commands available | >help |
| Show the list of databases | >show dbs |
| Show the name of the currently active database | >db |
| Switch to a different database | >use [name of database to use] |
| Lets switch to the "local" database | >use local |
| Show the collections of the current database | >show collections |
| Drop a collection | >db.[collection name].drop() |
| Drop a database | >db.dropDatabase() |
| Exit from the shell | >exit |

##New Database

Let's create a new database. All we have to do is type "use [database name]"

```
> use farm
```

Mongo should gives us a message saying "switched to db farm"

What if we want a collection of animals in our farm database. In MongoDB, inserting a document into collection for the first time automatically creates the collection. Whaaat?! Sweet.

```
db.animals.insert({
  name: "Charlie",
  type: "Horse",
  noise: "Nay!",
  last_shoe_date: new Date('Jan 29, 2015')
})
```

And let's add a pig...

```
db.animals.insert({
  name: "Napolean",
  type: "Pig",
  noise: "Oink!",
  piglets: ["Jezobel", "Cindy", "Poppy"]
})
```

And let's retrieve all the documents from our animals collection:

```
db.animals.find()
```

```
//terminal output

{ "_id" : ObjectId("569e440174a7c3516453386d"), "name" : "Charlie", "type" : "Horse", "noise" : "Nay!", "last_shoe_date" : ISODate("2015-01-29T00:00:00Z") }
{ "_id" : ObjectId("569e45dd74a7c3516453386e"), "name" : "Napolean", "type" : "Pig", "noise" : "Oink!", "piglets" : [ "Jezobel", "Cindy", "Poppy" ] }
```

So we can see that Mongo has created an \_id field for us which is a unique primiary key. We can also see that despite being in the same collection, the horse and the pig have different fields. A pig doesn't need a last_shoe_date and a horse doesn't need an array of piglets.

Think about how we would do this in a relational database. It would be possible but we would end up with a lot of redundant fields.

##Adding lots of documents at the same time
Let's add lots more animals to our database. We can do this by passing in an array of documents.

```
db.animals.insert([
  {
    name: "Cindy",
    type: "Pig",
    noise: "Squeak!"
  },
  {
    name: "Sebastian",
    type: "Bull",
    dangerLevel: 10
  },
  {
    name: "John",
    type: "Chicken",
    noise: "Baaaak!"
  }
])

```
##Finding specific documents
We can find documents matching a specific criteria by passing an object to the find method.

```
//get all the pigs

db.animals.find({type: "Pig"})
```
```
//or all the pigs called Cindy

db.animals.find({type: "Pig", name:"Cindy"})
```
##Query Operators
MongoDB has a whole bunch of [query operators](https://docs.mongodb.org/manual/reference/operator/query/#query-selectors) that we can use to find documents.

```
//Find all the animals with a dangerLevel greater than 9.

db.animals.find( { dangerLevel: { $gt: 9 } } )
```

##Updating and Deleting
We can update documents in a collection using the [update methods](https://docs.mongodb.org/manual/core/write-operations-introduction/#update).

Let's update Sebastian the bull and reduce his dangerLevel.

```
db.animals.updateOne(
   { name : "Sebastian" },
   { $set: { dangerLevel : 3 } }
)
```

We can remove animal documents from the farm using one of the [remove methods](https://docs.mongodb.org/manual/tutorial/remove-documents/). Let's say the farmer has sold Sebastian to his neighbour. Let's remove him from the farm.

```
db.animals.remove( { name : "Sebastian" } )
```

##Exercise (20 mins)
Use the [MongoDB docs](https://docs.mongodb.org/manual/) to complete the following tasks:

  - Insert some sheep documents to the animals collection. Include a shearing date for each one (make some of them in the future)
  - Charlie the horse has had his shoes replaced today. Update his document to reflect the new shoe date.
  - Get all the sheep that have a shearing date in the future.
  - Get the names of all the pigs. HINT: Look at [projections](https://docs.mongodb.org/manual/core/read-operations-introduction/) to retrieve just one field.
  - Remove all the pigs from the farm.

##Embedding and Referencing

###Embedding
In MongoDB there are two tools that allow applications to represent relationships: ***references*** and ***embedded documents***.

By design, MongoDB allows us to embed documents inside other documents. Generally, embedding provides better performance for read operations, as well as the ability to request and retrieve related data in a single database operation.

For example, we could add an animal document with a vetReport document embeded in it.

```
db.animals.insert({
  name: "Sebastian",
  type: "Bull",
  dangerLevel: 10,
  vetReport: {
              health: "Excellent",
              outlook: "Good"
            }
})
```

###Referencing
Referencing is a bit more familiar to us. Instead of embedding the vetReport document inside the animal document, we would have a report_id field in the animal document which would be a foreign key and would reference a report document.

For one to many relationships for example, referencing is usually the best choice. If there is a joint bank account and two people both own the same account, it would make sense to reference the bank account with it's id rather than embed it in two person documents.

##Design Decisions
In general, embedding is probably the best way to go for simplicity and performance reasons.

Use referencing data models:

 - When embedding would result in duplication of data.
 - To represent more complex many-to-many relationships.  

##What We've Learned
- Understood the difference between SQL and NoSQL databases.
- Used the mongo shell to interact with the db.
- Learn the main MongoDB commands.
- Understood the difference between referencing and embedding.
