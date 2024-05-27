let tiles = document.getElementsByClassName('tile')
let clicked = []
console.log(tiles)
for(i=0;i<tiles.length;i++){
  console.log(tiles[i].id)
    tiles[i].addEventListener('click',(e)=>
       {
         console.log(clicked)
         if(e.target.innerHTML == ""){
          clicked[clicked.length] = e.target
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