package wizard_management;

public class Broomstick extends CleaningImplement {

  int speed;

  public Broomstick(String brand, int speed){
    super(brand);
    this.speed = speed;
  }

  public int getSpeed(){
    return this.speed;
  }

  public String fly(){
    return "mounting broom, running, skipping, flying!";
  }
}