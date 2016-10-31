var React = require('react');
var GuessForm = require('./GuessForm.jsx');
var CharactersBox = require('./CharactersBox.jsx');
var QuestionsForm = require('./QuestionsForm.jsx');
var NationalityForm = require('./NationalityForm.jsx');
var bastards = require('../sample_data.js');


var GameBox = React.createClass({
  getInitialState: function() {
    return { allBastards: bastards, gameVillain: null }
  },
  removeImage: function(image){

  },
  componentDidMount: function() {
  this.selectRandomCharacter();
  },
  selectRandomCharacter: function(){
    var villains = this.getVillains();
    console.log(villains);
    var rand = villains[Math.floor(Math.random() * villains.length)];
    console.log(rand);
    this.setRandomCharacter(rand);
  },
  setRandomCharacter: function(name){
    var gVillain = name;
    console.log(name);
    this.setState( { gameVillain: gVillain })
  },
  getNationalities: function(){
    var nationalities = []
    for (var item of this.state.allBastards){
      nationalities.push(item.Nationality)
      }
      console.log(nationalities)
      return nationalities;
  },
  setSelectedNationality: function(selectedCountry){
    console.log(selectedCountry);
    console.log(this.state.gameVillain);

  },
  getVillains: function(){
    var villains = []
    for (var item of this.state.allBastards){
      villains.push(item.Name)
    }
    console.log(villains)
    return villains;
  },
  handleQuestion: function(e){
    var options = this.state.allBastards
    console.log(options);
    e.preventDefault();
    console.log(e.target.value);

    var forDeselection = []
    var selection = e.target.value

    for (var item of options){
      if(selection ==="0"){
        if(item.Moustache === "No"){
        forDeselection.push(item.Name)
        }
      } 
        if(selection ==="1"){
          if(item.Mask === "No"){
          forDeselection.push(item.Name)
          }
        }
        if(selection ==="2"){
          if(item.Hair === "No"){
          forDeselection.push(item.Name)
          }
        }
      }
     console.log(forDeselection)
    // var forDeselection = ["Skeletor", "Hitler", "Stalin"]
     this.changeImageEnMass(forDeselection);
     // return forDeselection; 
    },

    handleCountry: function(e){
      var options= this.state.allBastards
      console.log(options);
      e.preventDefault();
      console.log(e.target.value);
      var names =[]
      for (var item of options){
        names.push(item.Name)
      }

      var index = e.target.value
      names.splice(index, 1);
      
      console.log(options);
      this.changeImageEnMass(names)
    },

    handleVillain: function(e){
      var options=this.state.allBastards
      var cpuPlayer=this.state.gameVillain
      var index = e.target.value
      console.log(options[index]);

      if(options[index].Name === cpuPlayer){
        this.handleWin()
      } else {
        this.handleLose()
      }
   },

    handleWin: function(){
      console.log("You Win")
      window.alert("You win! Yaaaaaas!")
    },

    handleLose: function(){
      console.log("You Lose")
      window.alert("Close but no cigar")
    },

    switchImage: function(){
      console.log("vader Clicked");
    },

    changeImage: function(e){
      console.log("clicked");
      e.target.src ="http://www.clker.com/cliparts/5/9/5/4/12456868161725760927raemi_Cross_Out.svg.hi.png"
    },

    changeImageEnMass: function(array){
      var all = this.state.allBastards
      var cpuPlayer = this.state.gameVillain
      console.log(all);
      console.log(cpuPlayer);
      // array = ["Skeletor", "Hitler", "Stalin"]
      for (var item of array){
        for (var character of all){
          if(item === character.Name){
            if(item != cpuPlayer){
            character.src="http://www.clker.com/cliparts/5/9/5/4/12456868161725760927raemi_Cross_Out.svg.hi.png"
            }
          }
        }
      }
      console.log(all);
      this.setState( { allBastards: all } )
      return all
      this.render();
    },



  





  render: function() {
    return (
      <div className="GameBox">
        <h1 id="title">Guess The Vilain</h1>

        <div className="CharactersBox">
        <CharactersBox 
        data={this.state.allBastards}
        switchImage={this.switchImage}
        changeImage={this.changeImage}
        changeImageEnMass={this.changeImageEnMass}
        />
        </div>

        <div className="QuestionsForm">
        <h1 id="DoesVillainHave">Does Villain Have?</h1>
        <QuestionsForm 
        data={this.state.allBastards}
        handleQuestion={this.handleQuestion}
        />
        </div>

        <div className="NationalityForm">
        <h1 id="Nationality">Villain Nationality</h1>
        <NationalityForm 
        data={this.state.allBastards}
        nations={this.getNationalities()}
        onSelectCountry = {this.setSelectedNationality}
        handleCountry={this.handleCountry}
        />
        </div>


        <div className="GuessForm">
        <h1 id="VillainGuess">Guess The Villain</h1>
        <GuessForm 
        data={this.state.allBastards}
        villains={this.getVillains()}
        handleVillain={this.handleVillain}
        />
        </div>

      </div>
    );
  }
});

  module.exports = GameBox;

  

