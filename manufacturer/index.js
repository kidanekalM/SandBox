var capconts = Array.from(document.getElementsByClassName("capcont"));
console.log("capconts",capconts)
capconts.map((capcont,indx)=>{
capcont.style=`transform: rotate(${(((((360-(360/capconts.length))))/capconts.length))*(indx)}deg);`
})