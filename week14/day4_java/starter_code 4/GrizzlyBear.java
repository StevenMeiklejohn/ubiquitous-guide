public class GrizzlyBear extends Bear {
  public String gatherFood() {
    return "Off to Farmfoods";
  }

  // We can also override the wakeup function in the Bear.java (superclass) like this...
  @Override
  public void wakeUp() {
    System.out.println("Slept in");
  }
}