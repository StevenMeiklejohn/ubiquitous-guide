package wizard_management;
import behaviours.*;

public class Ogre extends MythicalBeast implements Attacker {
  
  public Ogre(String name){
    super(name);
  }

  public String attack(){
    return "Hitting with a massive mace";
  }

}