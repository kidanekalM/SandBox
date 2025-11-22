var capconts = Array.from(document.getElementsByClassName("capcont"));
console.log("capconts",capconts)
var increments = 360

capconts.map((capcont,indx)=>{
capcont.style=`transform: rotate(${(((increments)/(capconts.length)))*(indx)}deg);`
})