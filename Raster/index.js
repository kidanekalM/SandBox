let numRow = 30
let numCol = 30
for(i=0;i<numRow;i++){
    let row = document.createElement('div');
    row.className = "row"
    for(j=0;j<numCol;j++){
        let pixel = document.createElement('div')
        pixel.className = "pixel"
        row.appendChild(pixel)
    }
    document.getElementById("wrapper").appendChild(row)
}