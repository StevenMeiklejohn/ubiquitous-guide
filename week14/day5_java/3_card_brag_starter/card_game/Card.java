package card_game;
import card_game.*;

public class Card {

  private final int number;
  private final Suit suit;

  public Card(int number, Suit suit){
    if (number > 13 || number < 1) {
      throw new IllegalArgumentException("Number must be between 1 and 13");
    }
    this.number = number;
    this.suit = suit;
  }

  public int getNumber(){
    return this.number;
  }

  public Suit getSuit(){
    return this.suit;
  }

  @Override
  public String toString(){
    String[] numbers = {"Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"};

    return numbers[this.number - 1] + " of " + suit.name();
  }

}