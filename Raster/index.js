let numRow = 30
let numCol = 30
let pixels = new Array(30)
for(i=0;i<numRow;i++){
    let row = document.createElement('div');
    row.className = "row"
    pixels[i] = new Array(30)
    for(j=0;j<numCol;j++){
        let pixel = document.createElement('div')
        pixel.className = "pixel"
        row.appendChild(pixel)
        pixels[i][j] = pixel
    }
    document.getElementById("wrapper").appendChild(row)
}
// we reverse the array to resemble the cartesian plane
pixels = pixels.reverse()
function setPixel(x,y){
    pixels[y][x].className += ' set' 
}

document.getElementById("run").addEventListener('click',(e)=>{
    let code = document.getElementById("txtCode").value
    // console.log(code);
    // code.forEach(c => {
    //     c = c.toString()
    //     console.log(c)
    //     if((c).includes("setPixel")){
    //         let y = ((c).substring(c.indexOf('(')+1,c.indexOf(',')))
    //         let x = ((c).substring(c.indexOf(',')+1,c.indexOf(')')))
            
    //         pixels[x][y].className += ' set'
    //     }
    //     else{
    //         console.log(false,"not Found")
    //     }
    // })
    eval(code)

})
