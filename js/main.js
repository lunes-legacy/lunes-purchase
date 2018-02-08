"use strict";


var lunesLib = require('lunes-lib');
var R = require('ramda');

var square = function square (x) { return x * x; }  
var squares = R.chain(square, [1, 2, 3, 4, 5]); 

document.getElementById('response').innerHTML = squares;

lunesLib.users.login({email:'felipe.mr89@gmail.com',password:'@W4x5n9a3'}).then(function(valor){
    console.log('ok');
     console.log(valor);
}, function(reject){
    console.log('reject');
    console.log(reject);
});

//console.log('token:'+ token);

function logar(){

    var email = $("#email").val();
    var senha = $("#senha").val();
    console.log(email);
    console.log(senha);
    var accessToken = lunesLib.users.logar(email,senha);
    console.log(accessToken);
}