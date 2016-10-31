package wizard_management;
import behaviours.*;

public class Dragon extends MythicalBeast implements Flyable {

  public Dragon(String name){
    super(name);
  }

  public String fly(){
    return "Standing up tall, beating wings, lift off!";
  }

}