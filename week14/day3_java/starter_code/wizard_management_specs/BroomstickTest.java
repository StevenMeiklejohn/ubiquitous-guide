import static org.junit.Assert.*;
import org.junit.*;
import wizard_management.*;

public class BroomstickTest {

  Broomstick broom;

  @Before
  public void before(){
    broom = new Broomstick("Nimbus",10);
  }

  @Test
  public void hasBrand(){
    assertEquals("Nimbus", broom.getBrand());
  }

  @Test
  public void hasSpeed(){
    assertEquals(10, broom.getSpeed());
  }

  @Test
  public void canFly(){
    assertEquals(broom.fly(),"mounting broom, running, skipping, flying!");
  }

}