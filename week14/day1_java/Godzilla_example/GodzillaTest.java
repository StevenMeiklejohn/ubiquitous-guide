import static org.junit.Assert.assertEquals;
import org.junit.*;

public class GodzillaTest {

  Godzilla godzilla;
  Building building;
  JetFighter jetFighter;
  Human human;


  @Before
  public void setup() {
    godzilla = new Godzilla("Mecha-Zilla", "Lizard", 1000.2, 80.5, 10.5);
    building = new Building(1);
    building = new Building(2);
    building = new Building(3);
    building = new Building(4);
    building = new Building(5);
    building = new Building(6);
    building = new Building(7);
    building = new Building(8);
    building = new Building(9);
    building = new Building(10);
    jetFighter = new JetFighter("WindowBox");
    jetFighter = new JetFighter("Roustabout");
    jetFighter = new JetFighter("Cinderella");
    jetFighter = new JetFighter("Smokey");
    jetFighter = new JetFighter("Volleyball");
    human = new Human();

  }

  @Test
  public void kaijuHasName() {
    assertEquals("Mecha-Zilla", godzilla.getName());
  }

  @Test
  public void kaijuHasType() {
    assertEquals("Lizard", godzilla.getType());
  }

  @Test
  public void kaijuHasWeight() {
    assertEquals(1000.2, godzilla.getWeight(), 0.1);
  }

  @Test
  public void kaijuHasHeight() {
    assertEquals(80.5, godzilla.getHeight(), 0.1);
  }

  @Test
  public void kaijuHasFireBreath() {
    assertEquals(10.5, godzilla.getFireBreath(), 0.1);
  }


  @Test
  public void canEatHuman() {
    godzilla.eat(human);
    assertEquals(1, godzilla.foodCount());
  }

  @Test
  public void allHumansAreNotEaten() {
    godzilla.eat(human);
    assertEquals(false, godzilla.areHumansEaten());
  }

  @Test
  public void allHumansAreEaten() {
    for(int i=0; i<100; i++){
        godzilla.eat(human);
      }
     assertEquals(true, godzilla.areHumansEaten());
  }

  @Test
  public void canDestroyBuilding() {
    godzilla.destroyBuilding(building);
    assertEquals(1, godzilla.buildingCount());
  }

  @Test
  public void canDestroyCity() {
    godzilla.destroyCity()
  }
#}