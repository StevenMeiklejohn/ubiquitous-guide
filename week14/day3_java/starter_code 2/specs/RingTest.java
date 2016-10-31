import static org.junit.Assert.*;
import org.junit.*;
import jewellery.*;

public class RingTest {

  Ring ring;
  
  @Before 
  public void before(){
    ring = new Ring("Gold");
  }

  @Test
  public void canGetMetal(){
    assertEquals(ring.getMetal(),"Gold");
  }

}