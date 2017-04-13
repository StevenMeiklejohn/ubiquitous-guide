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

  checkForGoodSelection: function(e){
    console.log("checkForGoodSelection called");
    var cpuPlayer=this.state.gameVillain;
    var villains=this.state.allBastards;
    var selection =e.target.value;
    console.log(selection);
    var deSelection = [];
    console.log(cpuPlayer);
    console.log(villains[0].Moustache);



    if(selection === "0"){
      for(var villain of villains){
        if(villain.Moustache === "Yes"){
          window.alert("Good guess! You are one step closer to pinning down that sneaky bastard.");

        }
        else{
          deSelection.push(villain);
          this.changeImageEnMass(deSelection);
        }
      }

    }

    if(selection === "1"){
      for(var villain of villains){
        if(villain.Mask === "Yes"){
          window.alert("Good guess! You are one step closer to pinning down that sneaky bastard.");

        }else{
        deSelection.push(villain);
        this.changeImageEnMass(deSelection);
      }
      }
    }

    if(selection === "2"){
      for(var villain of villains){
        if(villain.Hair === "Yes"){
          window.alert("Good guess! You are one step closer to pinning down that sneaky bastard.");

        }else{
        deSelection.push(villain);
        this.changeImageEnMass(deSelection);
      }
    }
    }

},

    handleCountry: function(e){
      var options= this.state.allBastards
      console.log(options);
      e.preventDefault();
      console.log(e.target.value);
      console.log(e.target.id);
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
      e.target.src = "./images/not_this_bastard.jpg"
      console.log(e.target.src);
    },





    changeImageEnMass: function(array){
      var all = this.state.allBastards
      var cpuPlayer = this.state.gameVillain
      console.log(all);
      console.log(cpuPlayer);
      console.log(array);
      // array = ["Skeletor", "Hitler", "Stalin"]
      for (var item of array){
        for (var character of all){
          if(item === character){
            if(item != cpuPlayer){
            character.src="./images/not_this_bastard.jpg"
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
        <h1 id="title">Guess The Bastard</h1>

        <div className="CharactersBox">
        <CharactersBox 
        data={this.state.allBastards}
        switchImage={this.switchImage}
        changeImage={this.changeImage}
        changeImageEnMass={this.changeImageEnMass}
        />
        </div>

        <div className="QuestionsForm">
        <h1 id="DoesVillainHave">Does The Bastard Have?</h1>
        <QuestionsForm 
        data={this.state.allBastards}
        handleQuestion={this.checkForGoodSelection}
        />
        </div>

        <div className="NationalityForm">
        <h1 id="Nationality">Bastard Nationality</h1>
        <NationalityForm 
        data={this.state.allBastards}
        nations={this.getNationalities()}
        onSelectCountry = {this.setSelectedNationality}
        handleCountry={this.handleCountry}
        />
        </div>


        <div className="GuessForm">
        <h1 id="VillainGuess">Guess The Bastard</h1>
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

  

