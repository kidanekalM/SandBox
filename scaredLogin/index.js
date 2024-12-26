state= true
document.getElementById("sub").addEventListener('mouseover',
(e)=>{
    console.log(document.getElementById("sub"))
    if(state){

        state = false
        document.getElementById("sub").style.right = "-5rem"
    }
    else{
        state = true
        document.getElementById("sub").style.right = "5rem"
        backgroundColor
    }
    
    document.getElementById("sub").style.position = "relative"
    document.getElementById("sub").style.backgroundColor = "blue"
}    
)
function throwAway(e,deg,x,y) {
    e.style.transform = "rotate("+deg+"deg)";
    e.position = "relative"
    e.style.right = x+"rem"
    e.style.top = y+"rem"
} 

Array.from(document.getElementsByClassName("form")[0].children).forEach((e,i) => {
    // print(e)
    console.log(e,i)
    throwAway(e,360/i,i+i,i+i)
});