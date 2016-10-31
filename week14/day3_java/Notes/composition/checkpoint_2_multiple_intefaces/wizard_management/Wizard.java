package wizard_management;
import behaviours.*;

public class Wizard {
  String name;
  Flyable ride;
  Attacker defender;

  public Wizard(String name, Flyable ride, Attacker defender){
    this.name = name;
    this.ride = ride;
    this.defender = defender;
  }

  public void setRide(Flyable ride){
    this.ride = ride;
  }


  public void setDefender(Attacker defender){
    this.defender = defender;
  }

  public String defend(){
    return this.defender.attack();
  }

  public String getName(){
    return this.name;
  }

  public Flyable getRide(){
    return this.ride;
  }

  public String fly(){
    return this.ride.fly();
  }

}