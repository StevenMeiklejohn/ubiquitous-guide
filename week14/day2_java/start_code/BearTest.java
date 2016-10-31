// import static org.junit.Assert.assertEquals;
import static org.junit.Assert.*;
import org.junit.*;

public class BearTest {
  
  Bear bear;
  Salmon salmon;
  Human human;
  PotatoPistols potatoPistols;
  DippingJam dippingJam;

  @Before 
  public void before() {
    bear = new Bear("Baloo");
    salmon = new Salmon();
    human = new Human();
  }

  @Test
  public void hasName(){
    assertEquals("Baloo", bear.getName());
  }

  @Test
  public void bellyStartsEmpty(){
    assertEquals(bear.foodCount(), 0);
  }

  @Test
  public void canEatSalmon(){
    bear.eat(salmon);
    assertEquals(bear.foodCount(), 1);
  }

  @Test
  public void canEatHuman(){
    bear.eat(human);  
    assertEquals(bear.foodCount(), 1);
  }

  @Test
  public void canEatPotatoPistols(){
    bear.eat(potatoPistols);  
    assertEquals(bear.foodCount(), 1);
  }

  @Test
  public void canEatDippingJam(){
    bear.eat(dippingJam);  
    assertEquals(bear.foodCount(), 1);
  }

  // @Test
  // public void canNotEatSalmonWhenBellyFull(){
  //   for(int i = 0; i<10; i++){
  //     bear.eat(salmon);
  //   }
  //   assertEquals(bear.foodCount(), 5);
  // }

  @Test
  public void shouldEmptyBellyAfterSleeping(){
    bear.eat(salmon);
    bear.eat(human);
    bear.sleep();
    assertEquals(bear.foodCount(), 0);
  }

  @Test
  public void canThrowUp() {
    bear.eat(salmon);
    Edible food = bear.throwUp();
    // assertNotNull(food);

    // Casting. Function returns an Edible. To specify that the returned edible is a salmon, we type;
    Salmon original = (Salmon)food;
    assertEquals("swimming", original.swim());
  }







}