document.getElementById('time').addEventListener("keyup",(e)=>{
    let time = parseFloat(document.getElementById('time').value)
    if(time.toString() != "NaN"){
        let amount =(time*360)/12
        document.getElementById('arrow').style.transform = `rotate(${amount}deg)`
        console.log(time)
    }
})