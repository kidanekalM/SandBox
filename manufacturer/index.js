var capconts = Array.from(document.getElementsByClassName("capcont"));
var circleconts = Array.from(document.getElementsByClassName("circlecont"));

circleconts.map((circlecont,indx)=>{
    circlecont.style=`animation-name: none;`
})
setTimeout(()=>{
    circleconts.map((circlecont,indx)=>{
        circlecont.style=`animation-name: rotate;`
    })
    capconts.map((capcont,indx)=>{
    capcont.style=`transform: rotate(${(((increments)/(capconts.length)))*(indx)}deg);`
    // capcont.style=`animation-name: rotate;`
        })
},3000)
console.log("capconts",capconts)
var increments = 360

capconts.map((capcont,indx)=>{
    const moveInDelay = indx * 150;
    capcont.style.animationName = "movein";
    capcont.style.animationDuration = "700ms";
    capcont.style.animationTimingFunction = "ease-out";
    capcont.style.animationIterationCount = "1";
    capcont.style.animationFillMode = "forwards";
    capcont.style.animationDelay = `${moveInDelay}ms`;
})
