public abstract class Bear {

  public abstract String gatherFood();
  // Gather food is abstract. This means it must be implemented in the sub class (as each bear may do something different).

  public String roar(){
    return "roar!";
  }

  public void typicalDay() {
    wakeUp();
    System.out.println(gatherFood());
    //=>Call the gather function on the subclass then system print.
    eat();
    sleep();
  }
  
  public void wakeUp() {
    System.out.println("Waking Up");
  }

  public void eat() {
    System.out.println("Eating");
  }

  public void sleep() {
    System.out.println("Going to sleep");
  }
}


  