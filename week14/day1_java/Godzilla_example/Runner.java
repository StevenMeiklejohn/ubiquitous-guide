class Runner{
  public static void main(String[] args){
    Godzilla godzilla = new Godzilla("Godzilla", "Lizard", 10000.5, 80.5, 10.5);
    String name = godzilla.getName();
    String type = godzilla.getType();
    double weight = godzilla.getWeight();
    double height = godzilla.getHeight();
    double fireBreath = godzilla.getFireBreath();
    System.out.println(godzilla.getName());
  }
}

