import card_game.*;

import static org.junit.Assert.*;
import org.junit.*;

public class CardTest {

  Card twoOfClubs;

  @Before
  public void before(){
    twoOfClubs = new Card(2, Suit.Clubs);
  }

  @Test
  public void hasNumber(){
    assertEquals(2, twoOfClubs.getNumber());
  }

  @Test
  public void hasSuit(){
    assertEquals(Suit.Clubs, twoOfClubs.getSuit());
  }

  @Test(expected=IllegalArgumentException.class)
  public void numberNotBelowOne(){
    Card card = new Card(0, Suit.Spades);
  }

  @Test(expected=IllegalArgumentException.class)
  public void numberNotAbove13(){
    Card card = new Card(14, Suit.Spades);
  }

  @Test
  public void canPrintString(){
    Card aceOfSpades = new Card(1, Suit.Spades);
    Card kingOfClubs = new Card(13, Suit.Clubs);
    assertEquals("Two of Clubs", twoOfClubs.toString());
    assertEquals("Ace of Spades", aceOfSpades.toString());
    assertEquals("King of Clubs", kingOfClubs.toString());
  }

}