let tiles = document.getElementsByClassName('tile')

console.log(tiles)
for(i=0;i<tiles.length;i++){
  console.log(tiles[i].id)
    tiles[i].innerHTML = tiles[i].id
    tiles[i].addEventListener('click',(e)=>
       {
        if(e.target.innerHTML == ""){
          e.target.innerHTML="<h1>X<h1>"
          let classN =e.target.className; 
          e.target.className =classN+" X"; 
          console.log(classN)
          let Xtiles = document.getElementsByClassName('X');
          for(let j=0;j<Xtiles.length;j++){
            //if(Xtiles[j].id.includes('a'))
          }
          if(e.target.previousElementSibling.innerHTML == ""){
            e.target.previousElementSibling.innerHTML = "<h1>O<h1>"
          }
        }
       }
    )
}
document.getElementById("clear").addEventListener('click',()=>{
    for(i=0;i<tiles.length;i++){
            tiles[i].innerHTML=""
        
    }   
})