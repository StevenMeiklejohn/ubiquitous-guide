import static org.junit.Assert.*;
import org.junit.*;
import wizard_management.*;

public class WizardTest {

  Wizard wizard;
  Broomstick broomstick;

  @Before
  public void before(){
    broomstick = new Broomstick("Nimbus", 10);
    wizard = new Wizard("Toby", broomstick);
  }

  @Test
  public void hasName(){
    assertEquals("Toby", wizard.getName());
  }

  @Test
  public void hasBroomstick(){
    assertEquals("Nimbus", wizard.getBroomstick().getBrand());
  }

  @Test
  public void canFly(){
    assertEquals(wizard.fly(),"mounting broom, running, skipping, flying!");
  }
}