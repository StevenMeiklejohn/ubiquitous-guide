class Bear {
  private String name;
  private int age;
  private double weight;
  private double height;
  private Salmon[] belly;
  private int salmonCount;

   //belly is an array of Salmon 

  // public Bear(String name){
  //   this.name = name;
  // }

  // public Bear(Float weight){
  //   this.weight = weight;
  // }


  // public Bear(int age){
  //   this.age=age;
  // }

  public Bear(String name, int age, double weight, double height) {
    this.name = name;
    this.age = age;
    this.weight = weight;
    this.height = height;
    this.belly = new Salmon[5];
    salmonCount = 0;
  }

  public String getName(){
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setWeightAndHeight(double weight, double height){
    this.weight = weight;
    this.height = height;
  }

  public double getWeight(){
    return this.weight;
  }

  public double getHeight() {
    return this.height;
  }

  public double setBMI(){
    return this.weight / (this.height*this.height);
  }

  // public double getBMI(){
  //   return this.bmi;
  // }



  public int getAge(){
    return this.age;
  }

  public void setAge(int age) {
    this.age = age;
  }

  public boolean readyToHibernate() {
  return (setBMI() >= 30);
  }

  public void eat(Salmon salmon) {
    if (isBellyFull()) return;
    belly[salmonCount] = salmon;
    salmonCount++;
  }

  public int foodCount(){
    return salmonCount;
  }

  public boolean isBellyFull(){
    if (salmonCount >= belly.length){
      return true;
    } else {
      return false;
    }
  }

  public void sleep() {
    for (int i=0; i<belly.length; i++){
      belly[i] = null;
    }
    salmonCount = 0;
  }
}






