import static org.junit.Assert.*;
import org.junit.*;
import wizard_management.*;

public class MagicCarpetTest {

  MagicCarpet magicCarpet;

  @Before
  public void before(){
    magicCarpet = new MagicCarpet("Yellow");
  }

  @Test
  public void hasColour(){
    assertEquals("Yellow", magicCarpet.getColour());
  }

  @Test
  public void canFly(){
    assertEquals(magicCarpet.fly(),"Hovering up, straightening out, flying off!");
  }

}