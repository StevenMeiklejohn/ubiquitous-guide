
window.onload = function () {
    var PRIV_KEY = "403c5f3406be455684061d92266dea467b382bdc";
    var API_KEY = "1a11ffc2c79394bdd4e7a7b8d97c43a9";
    var ts = new Date().getTime();
    var url = 'http://gateway.marvel.com:80/v1/public/characters?apikey=1a11ffc2c79394bdd4e7a7b8d97c43a9'
    var hash = md5(ts + PRIV_KEY + API_KEY);
    url += "&ts="+ts+"&hash="+hash;
    var request = new XMLHttpRequest();
    request.open("GET", url);
    console.log(request.onload);
    request.onload = function () {
        if (request.status === 200) {
            console.log('got the data');
            var jsonString = request.responseText
            var characters = JSON.parse(jsonString);
            main(characters);//got the data start the chain of events
            console.log(characters);
        }
    }
    request.send(null);
};


var md5 = function(value) {
    return CryptoJS.MD5(value).toString();
}

var main = function (characters) {
    populateSelect(characters);
    var cached = localStorage.getItem("selectedCharacter");
    var selected = characters.data.results[0];
    console.log(selected);
    if(cached)
    {
        selected = JSON.parse(cached);
        document.querySelector('#character_menu').selectedIndex = selected.index;
    console.log(selected);
    }

    updateDisplay(characters, 0);
    document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (characters) {
    console.log(characters);
    var parent = document.querySelector('#character_menu');
    var name_array =[];
    var name0 = characters.data.results[0].name;
    name_array.push(name0);
    var name1 = characters.data.results[1].name;
    name_array.push(name1);
    var name2 = characters.data.results[2].name;
    name_array.push(name2);
    var name3 = characters.data.results[3].name;
    name_array.push(name3);
    var name4 = characters.data.results[4].name;
    name_array.push(name4);
    var name5 = characters.data.results[5].name;
    name_array.push(name5);
    var name6 = characters.data.results[6].name;
    name_array.push(name6);
    var name7 = characters.data.results[7].name;
    name_array.push(name7);
    var name8 = characters.data.results[8].name;
    name_array.push(name8);
    var name9 = characters.data.results[9].name;
    name_array.push(name9);
    var name10 = characters.data.results[10].name;
    name_array.push(name10);
    var name11 = characters.data.results[11].name;
    name_array.push(name11);
    var name12 = characters.data.results[12].name;
    name_array.push(name12);
    var name13 = characters.data.results[13].name;
    name_array.push(name13);
    var name14 = characters.data.results[14].name;
    name_array.push(name14);
    var name15 = characters.data.results[15].name;
    name_array.push(name15);
    var name16 = characters.data.results[16].name;
    name_array.push(name16);
    var name17 = characters.data.results[17].name;
    name_array.push(name17);
    var name18 = characters.data.results[18].name;
    name_array.push(name18);
    var name19 = characters.data.results[19].name;
    name_array.push(name19);
    console.log(name_array);


    name_array.forEach(function (item) {
        console.log(item);
        var index = 0;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item
        parent.appendChild(option);
        index++;
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = document.getElementById("character_menu").selectedIndex;

    // parent.addEventListener('change', function (e) {
    //     var index = this.options[this.selectedIndex].value;
    //     console.log(index);

        var character = name_array[index];
        console.log(character);
        updateDisplay(characters, index);
        // character.index = index;
        localStorage.setItem("selectedCharacter",JSON.stringify(character));
    });
}

var updateDisplay = function (characters, index) {

    console.log(index);
    console.log(characters);
    var tags = document.querySelectorAll('#info p')
    tags[0].innerText = characters.data.results[index].name;
    console.log(tags[0]);
    tags[1].innerText = characters.data.results[index].description;
    console.log(tags[1]);

    // var tags = document.querySelectorAll('#drop-nav')
    // tags[0].innerText = characters.data.results[index].name;
    // console.log(tags[0]);
    // tags[1].innerText = characters.data.results[index].description;
    // console.log(tags[1]);


    updateImage(characters, index);
}

var updateImage = function(characters, index){
     var pic_link = characters.data.results[index].thumbnail.path;
     console.log(pic_link);
     var image = "<p><a href=" + pic_link + "/standard_xlarge" + ".jpg><img border='0' src=" + pic_link + "/standard_xlarge" + ".jpg><width='100' height='100'></a></p>";
     console.log(image);
     var src_script = document.createElement('script');

     src_script=image;
     console.log(src_script);
     displayImage(src_script);

}
var displayImage = function( src_script){
    // var img = document.createElement('IMG');

    // img.setAttribute('src', src_script);
    // img.setAttribute('class', 'mark');

    // document.getElementById("image").appendChild(img);


    document.getElementById('image').innerHTML = src_script;
    console.log(src_script);



    // "<img src=" + src_script + "class='mark'>";


     // var img = document.createElement('a href');
     // img.innerHTML = src_script;

 }


     
 
   

    // var pic = document.querySelector('#image')
    // pic = characters.data.results[index].thumbnail/standard_xlarge.jpeg;



