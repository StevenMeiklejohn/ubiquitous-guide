// window.onload = function(){
//   console.log( "DOM has loaded" );
//   main();
// }

// function main() {
//   var berryPicker ={
//     pickBerries: function(){
//       console.log('I am picking berries. I may be some time.');

//       setTimeout:function(){
//         if (typeof this.onPickBerries === "function")}
//           this.onPickBerries();
//         }
//       }. bind(this), 2000
//     },
//     onPickBerries: null
//     berryPicker.onPickBerries = makeJam;
//     berryPicker.pickBerries();
//   }
// }

// var squashBerries = function() {
//   console.log('squash, squash, squash, squash them berries');
// }

// var makeJam = function() {
//   squashBerries();
//   console.log('make jam');





  window.onload = function(){
    console.log("DOM has loaded");
    var messageContainer = document.getElementById('message');
    var button = document.getElementById('berry-button');
    main(messageContainer, button);
  }

  function main(messageContainer, button){
    var berryPicker = {

      pickBerries: function(){
        messageContainer.innerText = 'I am picking berries.';

        setTimeout(function(){
          if (typeof berryPicker.onPickBerries === "function"){
            berryPicker.onPickBerries(messageContainer);
          }
        }, 2000)
      },
      
      onPickBerries: null
    }

    berryPicker.onPickBerries = makeJam;
    button.onclick = berryPicker.pickBerries;
  }

  var squashBerries = function(){
    console.log('squash, squash, squash them berries');
  }

  var makeJam = function(messageContainer){
    squashBerries();
    messageContainer.innerText = 'Make jam!';
    var image = document.querySelector('#image img');
    image.src = "jam.jpg";
  }