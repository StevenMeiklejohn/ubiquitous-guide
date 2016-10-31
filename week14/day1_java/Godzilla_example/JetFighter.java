class JetFighter {
  private String callsign;

  public JetFighter(String callsign){
    this.callsign=callsign;
  }

  public void setCallsign(){
    this.callsign = callsign;
  }

  public String getCallSign(){
    return this.callsign;
  }

  public String fly(){
    return "Jet in the air";
  }

  public boolean jetFire(){
    return true;
  }

  public String jetDestroyed(){
    return "Jet destroyed!";
  }




}