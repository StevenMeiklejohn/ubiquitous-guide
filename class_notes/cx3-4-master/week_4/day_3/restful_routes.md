### Title

REST and the 7 RESTful Routes

### topic
REST

### objectives

- Understand the concept of REST and how it's incorporated into our web apps
- Know the HTTP verbs that we will be using
- What a resource is
- The 7 common actions that a RESTful app employs.
- Which verbs apply to which actions

### I Do: What is REST?
REST stands for Respresentational State Transfer. It's a design pattern or convention for designing an application. In our case it's a web application.

REST is NOT a protocol like HTTP. HTTP _requires_ that we follow a particular way of doing things, otherwise it just doesn't work. 

A design pattern or convention like REST just gives us a standard way of doing things that is common throughout the industry.

So let's be conventional! If we build our own API (application programming interface), then people using it will expect it to be RESTful. If it's not, then it's complex awkward and time consuming for people to use it. And it won't get used.

Unfortunately many web developers ignore REST to their detriment. 

### A Little Bit of History
REST was originally described in a research paper by Roy Fielding a computer scientist who helped define the HTTP protocol.

The idea is that we can apply verbs (doing words) to any resource. HTTP uses a set of verbs to retrieve and update resources on the web.

(Do the bottle and notebook example?)


### Why Is REST important to us? 
A few reasons.

1. It's a convention. A design pattern. Standards-based (runs on top of HTTP).
2. Conforming to REST principles can help with search engine optimization (SEO) as well as make our web applications more usable (through predictability of actions) and scalable (the web itself has scaled to massive proportions)
3. You might well have seen it on job adverts! Which is kind of weird because it's not really a skill, it's just something we need to know about and use.

### Draw on board
HTTP has a set of verbs that it uses. We're interested in 4 of them.

1. GET
2. POST
3. PUT
4. DELETE

### Mapping REST to CRUD
We need our apps to do stuff, and the stuff they do needs to be recorded, and we know that we record this stuff in databases. A website or web app is essentialy an interface for us to read, update and delete items.

Think about Facebook. 

1. You can READ a post. 
2. You can CREATE a comment. 
3. You can UPDATE your profile. 
4. You can DELETE a photo

In our intro to DBs, we learnt about CRUD, and practiced it by writing SQL statements. Now, our web apps still need to call on those CRUD operations, and we need to work out how to do it in the "simplest", "clearest" way possible.

Another way of understanding the concept is that REST uses HTTP to allow users to do all the four main CRUD operations.

1. Create
2. Read
3. Update
4. Delete

Coupled with this REST dictates that we have 7 actions that our app can do. What do you think the 7 things are that our web application needs to do?

1. index
2. new
3. create
4. show
5. edit
6. update
7. delete

Which HTTP verbs do we think go with which actions in our application?

### What is a Resource?
We've used the word 'resource' a couple of times - and it's the "R" of URL - but we haven't really defined it as it relates to the web.

Type in Sublime. http://www.mymovieapp.com/movies

1. Tweets on Twitter
2. Albums on Spotify
2. Movies in our web app
3. Photos on Instagram

### I Do: 7 RESTful Routes

REST dictates that we should be able to do 7 key actions. A RESTful route is made up of an HTTP verb, an action (in our application) and a URL.

The general principle of RESTful routes, is that each URL describes what the expected operation on the resource should be.

In the definition of HTTP, the different verbs that can be used are specified for certain purposes.

For instance, POSTing is intended for 'creating' new resources, while GET should just GET stuff for us.  

Let's think about our CRUD. If we have a resource (in our case a database) of movies what actions would we probably want to do involving movies?

## Draw on board:

The general principle of RESTful routes, is that each URL describes what the expected operation on the resource should be.

Remember we said HTTP uses a set of verbs to retrieve and update resources on the web? The ones we're interested in are GET, POST, PUT and DELETE.

1. URLs
2. HTTP verbs
3. Actions

These 3 things make up a RESTful route



| URL   |      HTTP Verb      |  Action |
|----------|:-------------:|------:|
| /movies |  GET | index |
| /movies/new |    GET   | new |
| /movies | POST |  create   |
| /movies/:id | GET |  show   |
| /movies/:id/edit | GET |  edit   |
| /movies/:id | PUT |  update   |
| /movies/:id/delete | DELETE |  destroy   |


Because the HTML4 standards don't support PUT and DELETE, we often use POST instead. This has changed in HTML 5. 

So what do these RESTful routes look like in code?

### RESTful Routes in Sinatra

```
class MoviesApp < Sinatra::Base

  # GET "/movies" - Gets all the movies we have
  get "/movies" do
    # some code here
  end

  # GET "/movies/new" - Give us a form to fill out details of a new movie
  get "/movies/new" do
    # some code here
  end

  # POST "/movies" - Create a new movie, add it to our list
  post "/movies" do
    # some code here
  end

  # GET "/movies/3" - Just get one specific movie (that already exists)
  get "/movies/:id" do
    # some code here
  end

  # GET "/movies/3/edit" - Give us a form to edit a movie's details
  get "/movies/:id/edit" do
    # some code here
  end

  # PUT "/movies/3" - Updates a specific movie
  post "/movies/:id" do
    # some code here
  end

  # POST "/movies/3" - Deletes a specific movie
  post "/movies/:id/delete" do
    # some code here
  end
end
```
REST is strict. Each URL must do a single thing. That's all.

The URLs we've decided to list here are very similar to the ones we'll be using in Rails, so it makes sense to start getting into habits we'll be using later.


## REST practice
Quick quiz:

- What are the 4 HTTP verbs?
- What is a resource?
- What are the 7 common actions that a RESTful app employs?
- Which verbs apply to which actions?
- What are the URLS what we use for each action?


Okay, so *now* we need a rest.

Let's put REST into practice by adding RESTful routes to our pizza app.
``