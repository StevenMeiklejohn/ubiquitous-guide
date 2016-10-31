##Getting Started Checklist for the Homework

1. Draw your ER diagram
2. Set up your directory structure
3. Create a Ruby file for each of your classes (remember singular names!)
2. Write your class definitions in each file (including an initialize)


For example: 
```
class Team
  
  def initialize(name)
    @team_name = name
  end

end
```

3. Design your database tables
4. Create your database
5. Make a .sql file and write some SQL to create your tables
6. Run the .sql file (psql -d data_base_name -f file_name.sql)
7. Create an SQLRunner class that we can use to pass SQL strings to
8. Implement save, update and delete methods on your classes
9. Create console.rb to create some new objects and save them to the db
10. Create some business logic for testing (could be League class??)