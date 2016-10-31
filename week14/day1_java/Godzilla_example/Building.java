class Building {

  private int number;

  public Building(int number) {
    this.number = number;
  }

  public String destroy(){
    return "Building destroyed in a blazing inferno!";
  }

  public int getNumber(){
    return this.number;
  }

  public void getNumber(int number) {
    this.number = number;
  }
}