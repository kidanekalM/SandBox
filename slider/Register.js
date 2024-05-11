let tabs = document.getElementsByClassName('tab')
let cards = document.getElementsByClassName('card-body')
let btnNext =  document.getElementById('next') 
let btnback = document.getElementById("back")
let state = 1;
for(let i=1;i<cards.length;i++){
    cards[i].style.display = "none";
}

console.log(getComputedStyle(cards[0]))
btnNext.addEventListener('click',(e)=>{
    e.stopPropagation()
    if(state == 4){
        cards[state-1].style.display = "none"
        cards[state].style.display = "block"
        btnNext.innerHTML = "መዝግብ"
        state=state+1
        tabs[state-2].className = tabs[state-2].className.replace("selected","")
        tabs[state-1].className = tabs[state-1].className+" selected"
    
    }
    else if(state == 5){
        document.getElementById('accordion').submit()
    }
    else{
        cards[state-1].style.display = "none"
        cards[state].style.display = "block"
        btnNext.innerHTML = "ቀጣይ"
        state=state+1
        tabs[state-2].className = tabs[state-2].className.replace("selected","")
        tabs[state-1].className = tabs[state-1].className+" selected"
    
    }

})
btnback.addEventListener('click',(e)=>{
    e.stopPropagation()
    if(state > 1){
        tabs[state-1].className = tabs[state-1].className.replace("selected","")
        tabs[state-2].className = tabs[state-2].className+" selected"
        state=state-1
        cards[state].style.display = "none"
        cards[state-1].style.display = "block"
        btnNext.innerHTML = "ቀጣይ"
    }
    /*
    if(state == 4){
        btnNext.innerHTML = "መዝግብ"
        state=state+1
        tabs[state-2].className = tabs[state-2].className.replace("selected","")
        tabs[state-1].className = tabs[state-1].className+" selected"
    
    }
    else if(state == 1){
        document.getElementById('accordion').submit()
    }
    else{
        cards[state-1].style.display = "none"
        cards[state].style.display = "block"
        btnNext.innerHTML = "ቀጣይ"
        state=state+1
        tabs[state-2].className = tabs[state-2].className.replace("selected","")
        tabs[state-1].className = tabs[state-1].className+" selected"
    
    }*/
})
