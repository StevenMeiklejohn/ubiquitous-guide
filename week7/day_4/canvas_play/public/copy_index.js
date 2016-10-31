// setup
function animation(){
  window.onload();
}

window.onload = function() {
  console.log( 'App started' );
  // Acquire canvas (html element 'main' as specified in index.html) and call it variable = canvas

    

     
     var rectangle = {x:140,y:80,width:10,height:10};

     var canvas = document.getElementById('main');

     console.log(canvas);
      // Setup canvas context

      var context = canvas.getContext( '2d' );

      background();

      function background(){
          setInterval(function(){context.clearRect(0, 0, canvas.width, canvas.height); }, 5100);

         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, 225 );
         context.lineWidth = 2;
         context.strokeStyle = 'orange'
         context.stroke();

         // Top right Corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, -45 );
         context.stroke();

         //inner top right corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, 0  );
         context.stroke();

         //center right corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, 60 );
         context.stroke();

         //inner bottom right corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, 125 );
         context.stroke();

         //Bottom right corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, 225 );
         context.stroke();

         //Inner Bottom right corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 300, 175 );
         context.stroke();


         //Left lines!
         //Top left corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 0, -45 );
         context.stroke();

         //inner top left corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 0, 0 );
         context.stroke();

         //center left corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 0, 60 );
         context.stroke();

         //inner bottom left corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 0, 125 );
         context.stroke();

         //Bottom left corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 0, 225 );
         context.stroke();

         //Inner Bottom left corner
         context.beginPath();
         context.moveTo( 150, 90 );
         context.lineTo( 0, 180 );
         context.stroke();

         square1();
       };

         //animation

         // //inner1 rectangle
         // context.beginPath();
         // context.strokeRect( 50, 0, 200, 180 );
         // context.stroke(); 
         // context.rectangle;

         // context.strokeRect( 117, 60, 66, 60);
         // context.strokeRect( 102, 45, 96, 90);
         // context.strokeRect( 87, 30, 126, 120);
         // context.strokeRect( 72, 15, 156, 150);

         // var sq1 = context.strokeRect( 117, 60, 66, 60);
         // var sq2 = context.strokeRect( 102, 45, 96, 90);
         // var sq3 = context.strokeRect( 87, 30, 126, 120);
         // var sq4 = context.strokeRect( 72, 15, 156, 150);

         // function repeatOften() {
          function square1() {
          // setInterval(function(){ alert("Hello"); }, 3000);
          setInterval(function(){context.strokeRect( 117, 60, 66, 60); }, 1000);
          square2();
        };

          function square2() {
          setInterval(function(){context.strokeRect( 102, 45, 96, 90); }, 2000);
          square3();
        };

        function square3() {
          setInterval(function(){context.strokeRect( 87, 30, 126, 120); }, 3000);
          square4();
        };

        function square4() {
          setInterval(function(){context.strokeRect( 72, 15, 156, 150); }, 4000);
          square5();
        };

        function square5() {
          setInterval(function(){context.strokeRect( 50, 0, 200, 180); }, 5000);
          background();
        };



        // function n_square1(){
        //   setInterval(function(){context.clearRect( 117, 60, 66, 60); }, 6000);
        //   setInterval(function(){context.clearRect( 102, 45, 96, 90); }, 6000);
        //   setInterval(function(){context.clearRect( 87, 30, 126, 120); }, 6000);
        //   setInterval(function(){context.clearRect( 72, 15, 156, 150); }, 6000);
        //   setInterval(function(){context.clearRect( 50, 0, 200, 180); }, 6000);

        //   square1();
        // }



        // function n_square1(){
        //   context.clearRect( 117, 60, 66, 60);
        //   n_square2();
        // }

        // function n_square2(){
        //   context.clearRect( 102, 45, 96, 90);
        //   n_square3();
        // }
        // function n_square3(){
        //   context.clearRect( 87, 30, 126, 120);
        //   n_square4();
        // }
        // function n_square4(){
        //   context.clearRect( 72, 15, 156, 150);
        //   n_square5();
        // }
        // function n_square5(){
        //   context.clearRect( 50, 0, 200, 180);
        //   square1();
        // }





          
         
   

         //   requestAnimationFrame(repeatOften);
         // }
         // requestAnimationFrame(repeatOften);

         // function draw() {
         //     requestAnimationFrame(sq1, sq2, sq3, sq4);
         //     // Drawing code goes here
         // }
         // draw();

         // var fps = 15;
         // function draw() {
         //     setTimeout(function() {
         //         requestAnimationFrame(draw);
         //         context.strokeRect( 117, 60, 66, 60);
         //         context.strokeRect( 102, 45, 96, 90);
         //         context.strokeRect( 87, 30, 126, 120);
         //         context.strokeRect( 72, 15, 156, 150);
         //     }, 1000 / fps);
         // }
  

      };





     


  