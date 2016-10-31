public class Card {
    private String face;
    private String suit;
    //two-argument constructor initializes Cards face and suit
    public Card(String face, String suit) {
        super();
        this.face = face;
        this.suit = suit;
    }
    //get the face value
    public String getFace() {
        return face;
    }
    //set the face
    public void setFace(String face) {
        this.face = face;
    }
    //get the suit value
    public String getSuit() {
        return suit;
    }
    //set the suit value
    public void setSuit(String suit) {
        this.suit = suit;
    }
    //return String representation of Card object
    public String toString() {
        return face + " of " + suit;
    }
}