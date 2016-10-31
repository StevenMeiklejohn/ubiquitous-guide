import static org.junit.Assert.assertEquals;
import org.junit.*;

public class BearTest {

  Bear bear;

  @Before 
  public void before() {
    bear = new PolarBear();
  }

  @Test
  public void canGather(){
    assertEquals("Gone fishing", bear.gatherFood());
  }

  @Test
  public void canRoar(){
    assertEquals("roar!", bear.roar());
  }

}