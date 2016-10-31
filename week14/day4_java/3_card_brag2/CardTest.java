import static org.junit.Assert.*;
import org.junit.*;

public class CardTest {

  Card card;

  @Before 
  public void before() {
    card = new Card("9", "Clubs");
  }

  @Test
  public void cardHasFace() {
    assertEquals("9", card.getFace());
  }

  @Test
  public void cardHasSuit() {
    assertEquals("Clubs", card.getSuit());
  }

  @Test
  public void cardCanReturnStringRepresentation() {
    assertEquals("9 of Clubs", card.toString());
  }

}