import static org.junit.Assert.*;
import org.junit.*;
import wizard_management.*;

public class RugTest {

  Rug rug;

  @Before
  public void before(){
    rug = new Rug("Yellow");
  }

  @Test
  public void hasColour(){
    assertEquals("Yellow",rug.getColour());
  }

}