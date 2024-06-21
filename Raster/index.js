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

pixels[7][9].className += ' set'

document.getElementById("run").addEventListener('click',(e)=>{
    console.log(document.getElementById("txtCode").value)
})
