class Runner{
  public static void main(String[] args){
    Bear bear = new Bear("Baloo", 25, 90.5, 1.2);
    // bear.setName("Yogi");
    // bear.setAge(25);
    String name = bear.getName();
    Integer age = bear.getAge();
    double weight = bear.getWeight();

    // bear.setName("Paddington");
    System.out.println(bear.getName());
  }
}