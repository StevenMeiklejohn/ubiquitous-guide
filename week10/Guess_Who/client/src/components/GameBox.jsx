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
    var villains = this.state.allBastards;
    var rand = villains[Math.floor(Math.random() * villains.length)];
    this.setState( {eliminated: villains} );
    this.setRandomCharacter(rand);
  },

  setRandomCharacter: function(name){
    var gVillain = name;
    this.setState( { gameVillain: gVillain })
    console.log(gVillain);
  },

  getVillains: function(){
    var villains = []
    for (var item of this.state.allBastards){
      villains.push(item.Name)
    }
    return villains;
  },

  correctResponse: function(){
    var villains=this.state.allBastards;
    this.changeImageEnMass(villains);
    window.alert("Good guess! You are one step closer to pinning down that sneaky bastard0.");
  },

  incorrectResponse: function(){
    var villains=this.state.allBastards;
    this.changeImageEnMass(villains);
    window.alert("Your selection is not true of the bastard in question");
  },


  checkForGoodSelection: function(e){
    console.log("checkForGoodSelection called");
    var cpuPlayer=this.state.gameVillain;
    var villains=this.state.allBastards;
    var selection =e.target.value;


    if(selection === "0"){
      if(cpuPlayer.Fictional === "Yes"){
        var villainsNew = villains.map(function(el){
          console.log(el);
          if(el.Fictional === "No"){
          el.src = "./images/not_this_bastard.jpg"
        }
        return el
        })
        this.setState( { allBastards: villainsNew });
        this.correctResponse();
      }
      else{
        var villainsNew = villains.map(function(el){
          console.log(el);
          if(el.Fictional === "Yes"){
          el.src = "./images/not_this_bastard.jpg"
        }
        return el
        })
        this.setState( { allBastards: villainsNew });
        this.incorrectResponse();

      }
    }
  },
       

    // if(selection === "1"){
    //   for(var villain of villains){
    //     if(villain.Alive === "Yes"){
    //       window.alert("Good guess! You are one step closer to pinning down that sneaky bastard1.");

    //     }else{
    //     deSelection.push(villain);
    //     this.changeImageEnMass(deSelection);
    //   }
    //   }
    // }

    // if(selection === "2"){
    //   for(var villain of villains){
    //     if(villain.Politician === "Yes"){
    //       window.alert("Good guess! You are one step closer to pinning down that sneaky bastard2.");

    //     }else{
    //     deSelection.push(villain);
    //     this.changeImageEnMass(deSelection);
    //   }
    // }
    // }

    // if(selection === "3"){
    //   for(var villain of villains){
    //     if(villain.Hair === "Yes"){
    //       window.alert("Good guess! You are one step closer to pinning down that sneaky bastard3.");

    //     }else{
    //     deSelection.push(villain);
    //     this.changeImageEnMass(deSelection);
    //   }
    // }
    // }

    // if(selection === "4"){
    //   for(var villain of villains){
    //     if(villain.Moustache === "Yes"){
    //       window.alert("Good guess! You are one step closer to pinning down that sneaky bastard4.");

    //     }else{
    //     deSelection.push(villain);
    //     this.changeImageEnMass(deSelection);
    //   }
    // }
    // }



    // handleCountry: function(e){
    //   var options= this.state.allBastards
    //   console.log(options);
    //   e.preventDefault();
    //   console.log(e.target.value);
    //   console.log(e.target.id);
    //   var names =[]
    //   for (var item of options){
    //     names.push(item.Name)
    //   }

    //   var index = e.target.value
    //   names.splice(index, 1);
      
    //   console.log(options);
    //   this.changeImageEnMass(names)
    // },

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


    changeImage: function(e){
      console.log("clicked");
      e.target.src = "./images/not_this_bastard.jpg"
      console.log(e.target.src);
    },





    changeImageEnMass: function(){
      var all = this.state.allBastards
      this.render();
      return all;
    },


  render: function() {
    return (
      <div className="GameBox">
        <h1 id="title">Guess The Bastard</h1>

        <div className="CharactersBox">
        <CharactersBox 
        data={this.state.allBastards}
        changeImage={this.changeImage}
        changeImageEnMass={this.changeImageEnMass}
        />
        </div>

        <div className="QuestionsForm">
        <h1 id="DoesVillainHave">Eliminate Some Bastards</h1>
        <QuestionsForm 
        data={this.state.allBastards}
        handleQuestion={this.checkForGoodSelection}
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

  

