var Typer = {
    file: "",
    text: null,
    speed: 2,
    index: 0,
    accessCountTimer: null,
    init: function(){
        this.accessCountTimer = setInterval(Typer.updateCursor, 500);
        this.text = this.getFile(this.file);
    },
    content: function(){
        return document.getElementById("consoler").innerHTML;
    },
    updateCursor: function(){
        var span = document.getElementsByTagName("span")[1];
        if(span.innerHTML === ""){
            span.innerHTML = "|";
        } else {
            span.innerHTML = "";
        }
    },
    getFile: function(fileAddress){
        var data;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState != 4){
                return;
            }
            if(xhr.responseText){
                if(xhr.responseText.error != null){
                    console.error(xhr.responseText.error);
                } else {
                    data = xhr.responseText;
                }
            }
        };
        xhr.open("get", fileAddress, false);
        xhr.send(null);
        return data;
    },
    addText: function(){
        if(this.text){
            var out = this.content();
            out += this.text.substring(this.index, this.index+this.speed);
            this.index += this.speed;
            if(this.index >= this.content().length)this.index = 0;
            var rtn= new RegExp("\\n", "g"); // newline regex
            var rts= new RegExp("\\s", "g"); // whitespace regex
            var rtt= new RegExp("\\t", "g"); // tab regex
            out = out.replace(rtn,"<br/>").replace(rtt,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(rts,"&nbsp;");
            document.getElementById("consoler").innerHTML = out;
            window.scrollBy(0, 50);
        }
    }
};

Typer.file = "app.js";
Typer.init();
document.addEventListener("keyup", Typer.addText, false);