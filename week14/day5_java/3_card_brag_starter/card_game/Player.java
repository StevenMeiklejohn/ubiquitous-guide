package card_game;
import card_game.*;

public class Player {

  private String name;
  private Card[] hand = new Card[3];

  public Player(String name){
    this.name = name;
  }

  public String getName(){
    return this.name;
  }

  public void setHand(Card card1, Card card2, Card card3){
    this.hand[0] = card1;
    this.hand[1] = card2;
    this.hand[2] = card3;
  }

  public Card[] getHand(){
    return this.hand;
  }

  public String printHand(){
    return this.hand[0].toString() + ", " + this.hand[1].toString() + ", " + this.hand[2].toString();
  }

}