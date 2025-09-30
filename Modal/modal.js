let modal=document.getElementById("myModal");
let btn=document.getElementById("lets_talk");
let span=document.getElementsByClassName("close")[0];

btn.onclick=function(){
    modal.style.display="block";
    document.body.style.overflow = 'hidden';
}

span.onclick=function(){
    modal.style.display="none";
    document.body.style.overflow = 'auto';
}

window.onclick=function(event){
    if(event.target==modal){
        modal.style.display="none";
        document.body.style.overflow = 'auto';
    }
}


