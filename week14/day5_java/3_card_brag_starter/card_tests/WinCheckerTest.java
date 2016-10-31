import card_game.*;

import static org.junit.Assert.*;
import org.junit.*;
import java.util.*;

public class WinCheckerTest {

  Player player1;
  Player player2;
  WinChecker winChecker;
  Card card1;
  Card card2;
  Card card3;
  Card card4;
  Card card5;
  Card card6;
  Card card7;
  Card card8;
  Card card9;

  @Before
  public void before(){
    player1 = new Player("Beth");
    player2 = new Player("Rick");

    card1 = new Card(2, Suit.Clubs);
    card2 = new Card(3, Suit.Clubs);
    card3 = new Card(4, Suit.Clubs);

    card4 = new Card(3, Suit.Clubs);
    card5 = new Card(3, Suit.Spades);
    card6 = new Card(3, Suit.Diamonds);

    card7 = new Card(6, Suit.Clubs);
    card8 = new Card(6, Suit.Spades);
    card9 = new Card(6, Suit.Hearts);

    player1.setHand(card1, card2, card3);
    player2.setHand(card4, card5, card6);
    winChecker = new WinChecker();
    winChecker.setPlayers(player1, player2);
  }

  @Test
  public void hasTwoHands(){
    assertEquals("Two of Clubs, Three of Clubs, Four of Clubs -- Three of Clubs, Three of Spades, Three of Diamonds", winChecker.printHands());
  }

  @Test
  public void canRecognisePrial(){
    assertEquals(true, winChecker.checkForPrial(player2));
  }

  @Test
  public void canRecogniseNoPrial(){
    assertEquals(false, winChecker.checkForPrial(player1));
  }
  
  @Test
  public void canCheckWinner_OnePrial(){
    assertEquals(player2, winChecker.checkForWin());
  }

  @Test
  public void canCheckWinner_TwoPrials(){
    player1.setHand(card7, card8, card9);
    winChecker.setPlayers(player1, player2);
    assertEquals(player1, winChecker.checkForWin());
  }

}