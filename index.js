let tiles = document.getElementsByClassName('tile')

console.log(tiles)
for(i=0;i<tiles.length;i++){
    // game loop
    tiles[i].addEventListener('click',(e)=>
       {
     e.target.innerHTML="<h1>X<h1>"
        console.log(e)
     e.target.previousElementSibling.innerHTML = "<h1>O<h1>"
       }
    )
}
document.getElementById("clear").addEventListener('click',()=>{
    for(i=0;i<tiles.length;i++){
            tiles[i].innerHTML=""
        
    }   
})