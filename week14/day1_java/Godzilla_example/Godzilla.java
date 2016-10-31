class Godzilla {
  private String name;
  private String type;
  private double weight;
  private double height;
  private double fireBreath;
  private Human[] belly;
  private int humanCount;
  private Building[] city;
  private int buildingCount;
  private JetFighter[] navy;
  private int jetFighterCount;


  public Godzilla(String name, String type, double weight, double height, double fireBreath) {
    this.name = name;
    this.type = type;
    this.weight = weight;
    this.height = height;
    this.fireBreath = fireBreath;
    this.belly = new Human[100];
    humanCount = 0;
    this.city = new Building[50];
    buildingCount = 0;
    this.navy = new JetFighter[15];
    jetFighterCount = 0;
  }

  public String getName(){
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getType(){
    return this.type;
  }

  public void setType(){
    this.type=type;
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


  public double getFireBreath(){
    return this.fireBreath;
  }

  public void setFireBreath() {
    this.fireBreath = fireBreath;
  }

  public void eat(Human human) {
    if (areHumansEaten()) return;
    belly[humanCount] = human;
    humanCount++;
    }
  

  public boolean areHumansEaten(){
    if (humanCount >= belly.length){
    return true;
    } else {
    return false;
    }
  }


  public int foodCount(){
    return humanCount;
  }

  public void destroyBuilding(Building building) {
    if (isCityDestroyed()) return;

    city[buildingCount] = building;
    buildingCount++;
  }

  public void destroyMultipleBuildings(Building building Number number)
    if (isCityDestroyed()) return;
    for( count=0; count<51; count++){
      godzilla.destroyBuilding();
    }
   }



  public boolean isCityDestroyed(){
    if (buildingCount >= city.length){
    return true;
    } else {
    return false;
    }
  }

  public int buildingCount(){
    return buildingCount;
  }



  // public boolean readyToHibernate() {
  // return (setBMI() >= 30);
  // }



//   public int foodCount(){
//     return salmonCount;
//   }



//   public void sleep() {
//     for (int i=0; i<belly.length; i++){
//       belly[i] = null;
//     }
//     salmonCount = 0;
//   }
}






