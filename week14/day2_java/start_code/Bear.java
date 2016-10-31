import java.util.*;

public class Bear {
  private String name;
  private ArrayList<Edible> belly;


  public Bear(String name){
    this.belly = new ArrayList<Edible>();
    this.name = name;
  }

  public String getName(){
    return name;
  }

  public int foodCount(){
    return belly.size();
  }


  public void eat(Edible food) {
    belly.add(food);
  }


  public void sleep(){
    belly.clear();
  }

  public Edible throwUp() {
    if (foodCount() > 0) {
      return belly.remove(0);
      // remove item at index 0 in belly array
    }
    return null;
  }


}