public class Runner {
  public static void main(String[] args) {
    Bear bear = new PolarBear();
    bear.typicalDay();

    Bear grizzlyBear = new GrizzlyBear();
    grizzlyBear.typicalDay();
  }
}