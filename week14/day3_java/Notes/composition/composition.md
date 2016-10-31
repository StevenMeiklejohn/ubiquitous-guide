# Composition

## Objectives

- Understand how to compose objects using interfaces

## Intro

We've seen how Interfaces are awesome and allow us to give our objects superpowers. We're going to look at this a bit more in depth today and how we can use the power of 'composition' to make our objects very flexible.

[i:] Give out starter code.

Get the students to read it for 45 mins to an hour.

Starter code contains abstract classes - may have to explain these

The students should 
- draw a diagram of the classes and how they are related.
- figure out how to build the code and run the tests

## The problem

Key point:

We want the wizard to fly a dragon. Or a magic carpet. Or anything that flys and he feels confident climbing on.

- Pair up and discuss it

Possible solutions:
- Common superclass for flying types? Nope, already existing class heirarchy so it doesn't make sense.
- Ancestor for all objects? We don't want everything to fly!
- Multiple inheritance? It's not supported and there's all sorts of issues. If two superclasses have the same method, which does it use?

We want a common set of abilities that our things can do without polluting their class heirarchy which things that don't concern it.

More than that, we don't want this magical thing to have any clue about that behaviour, just to make sure that it exists on our object. A dragon NEEDS to fly, a magic carpet NEEDS to fly but we don't want our structure to care HOW they fly.

## Interfaces to the rescue

To solve our problem we are going to

- Add a flyable interface
- Dragon, Magic Carpet, Broomstick all implement it
- Change to Flyable in the wizard

First things first, let's add the Flyable interface.

```
#terminal 
mkdir behaviours #same level as wizard_management
touch behaviours/Flyable.java

#Flyable.java
package behaviours;

public interface Flyable {
  String fly();
}
```

Now, we need to make our Dragon and Broomstick implement it.

```
#Dragon.java
package wizard_management;
import behaviours.*; //NEW

public class Dragon extends MythicalBeast implements Flyable { //UPDATED

#Broomstick.java
package wizard_management;
import behaviours.*; //NEW

public class Broomstick extends CleaningImplement implements Flyable { //UPDATED
```

We already have tests to see if these things fly, so if we run them they should all still pass.

Let's now add the test for flying the Dragon.

```
#WizardTest
@Test
public void canFlyDragon(){
  Dragon dragon = new Dragon("Tilly");
  wizard = new Wizard("Toby", dragon);
  assertEquals(wizard.fly(),"Standing up tall, beating wings, lift off!");
}
```

If we build this, we will see an error "Incompatible types: Dragon cannot be converted to Broomstick". This is quite correct, a Dragon and Broomstick are completely unrelated and we are passing a Dragon to a method which is expecting a Broomstick. We need to change this to be Flyable in the method signature.

```
#Wizard.java
package wizard_management;
import behaviours.*; //NEW

public class Wizard {
  String name;
  Flyable ride; //UPDATED

  public Wizard(String name, Flyable ride){ //UPDATED
    this.name = name;
    this.ride = ride; //UPDATED
  }

  public String getName(){
    return this.name;
  }

  public Flyable getRide(){ //UPDATED
    return this.ride;
  }

  public String fly(){
    return this.ride.fly(); //UPDATED
  }

}
```

Since we have changed the name of getBroomstick, we need to go update our test. We'll need to use our new casting powers we gained yesterday!

```
@Test
public void hasBroomstick(){
  Broomstick ride = (Broomstick) wizard.getRide();
  assertEquals("Nimbus", ride.getBrand());
}
```

Whoot! We have successfully ridden a dragon. Let's see if he can fly a magic carpet.

```
#WizardTest.java
@Test
public void canFlyMagicCarpet(){
  MagicCarpet carpet = new MagicCarpet("Purple");
  wizard = new Wizard("Toby", carpet);
  assertEquals(wizard.fly(),"Hovering up, straightening out, flying off!");
}
```

This fails, since MagicCarpet is not Flyable. Let's go fix that!

```
#MagicCarpet.java
package wizard_management;
import behaviours.*; //NEW

public class MagicCarpet extends Carpet implements Flyable { //UPDATED

```

## Strategy Pattern

Wouldn't it be nice if we could set the ride on the wizard? Then on the same instance of a wizard we could swap out the broomstick for a dragon and vice versa. We are no longer tied to one ride for the life of the wizard object.

```
#WizardTest
@Test
public void canSetRide(){
  Dragon dragon = new Dragon("Erik");
  wizard.setRide(dragon);
  assertEquals(wizard.fly(), "Standing up tall, beating wings, lift off!");
}
```

This is a fairly easy change.

```
#Wizard.java
public void setRide(Flyable ride){
  this.ride = ride;
}
```

## Lab

Make the wizard be able to defend itself, calling an attack() method from it's protector. This must be able to change at runtime.

Ogres and Dragons can attack.