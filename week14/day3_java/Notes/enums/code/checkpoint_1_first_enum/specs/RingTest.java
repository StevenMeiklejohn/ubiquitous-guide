import static org.junit.Assert.*;
import org.junit.*;
import jewellery.*;

public class RingTest {

  Ring ring;
  
  @Before 
  public void before(){
    ring = new Ring(MetalType.GOLD);
  }

  @Test
  public void canGetMetal(){
    assertEquals(ring.getMetal(),MetalType.GOLD);
  }

  // @Test
  // public void metalCanBeMispelled(){
  //   ring = new Ring("Golllld");
  //   assertEquals(ring.getMetal(),"Golllld");
  // }

  // @Test
  // public void metalCanBeBanana(){
  //   ring = new Ring("Banana");
  //   assertEquals(ring.getMetal(),"Banana");
  // }

}