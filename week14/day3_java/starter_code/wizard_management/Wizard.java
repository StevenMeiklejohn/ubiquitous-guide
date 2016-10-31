package wizard_management;

public class Wizard {
  String name;
  Broomstick broomstick;

  public Wizard(String name, Broomstick broomstick){
    this.name = name;
    this.broomstick = broomstick;
  }

  public String getName(){
    return this.name;
  }

  public Broomstick getBroomstick(){
    return this.broomstick;
  }

  public String fly(){
    return this.broomstick.fly();
  }

}