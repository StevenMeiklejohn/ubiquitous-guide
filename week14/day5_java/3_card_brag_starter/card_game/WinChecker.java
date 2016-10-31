package card_game;

import card_game.*;
import java.util.*;

public class WinChecker {

  private Player player1;
  private Player player2;
  private ArrayList<Player> winners = new ArrayList<Player>();

  public void setPlayers(Player player1, Player player2){
    this.player1 = player1;
    this.player2 = player2;
  }

  public Player checkForWin(){

    checkForPrial(player1);
    checkForPrial(player2);

    if (winners.size() > 0) {
      if (winners.size() == 1) {
        return winners.get(0);
      }
      else {
        // If both players have a Prial, the player whose Prial is of the highest number wins. This version has Ace as low. Could add in to have 3 as the top number which is a special rule for 3 card brag. 
        if (player1.getHand()[0].getNumber() > player2.getHand()[0].getNumber()){
          return player1;
        }
        return player2;
      }
    }

    return null;
  }

  public boolean checkForPrial(Player player){
    Card[] hand = player.getHand();

    if (hand[0].getNumber() == hand[1].getNumber() && hand[1].getNumber() == hand[2].getNumber()){
      winners.add(player);
      return true;
    }
    return false;
  }

  public String printHands(){
    return player1.printHand() + " -- " + player2.printHand();
  }

}