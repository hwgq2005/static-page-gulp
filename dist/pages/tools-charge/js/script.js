"use strict";

var _Typer;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
*(c) Copyright 2011 Simone Masiero. Some Rights Reserved. 
*This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 License
*/
//var _0xee6c=["\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x72\x65\x66\x65\x72\x72\x65\x72","\x69\x70\x6C\x61\x79\x73\x6F\x66\x74\x2E\x63\x6F\x6D\x2F","\x69\x70\x63\x2E\x6D\x65\x2F","\x70\x6C\x61\x79\x6E\x65\x78\x74\x2E\x63\x6E\x2F","\x6C\x65\x6E\x67\x74\x68","\x69\x6E\x64\x65\x78\x4F\x66","\x68\x72\x65\x66","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x69\x70\x6C\x61\x79\x73\x6F\x66\x74\x2E\x63\x6F\x6D\x2F\x68\x61\x63\x6B\x65\x72\x74\x79\x70\x65\x72\x2E\x68\x74\x6D\x6C"];if(self!=top){top[_0xee6c[0]]=self[_0xee6c[0]];} ;var ref=document[_0xee6c[1]];var domains= new Array(_0xee6c[2],_0xee6c[3],_0xee6c[4]);var refpass=false;for(i=0;i<=domains[_0xee6c[5]];i++){if(ref[_0xee6c[6]](domains[i])>0){refpass=true;break ;} ;} ;if(!refpass){window[_0xee6c[0]][_0xee6c[7]]=_0xee6c[8];} ;
$(function () {
    $(document).keydown(function (event) {
        if (event.keyCode != 8) Typer.addText(event);
        //Capture the keydown event and call the addText, this is executed on page load
        else {
                Typer.removeText();
                event.preventDefault();
            }
    });
});

var Typer = (_Typer = {
    text: null,
    accessCountimer: null,
    index: 0,
    // current cursor position
    speed: 2,
    // speed of the Typer
    file: "",
    //file, must be setted
    accessCount: 0,
    //times alt is pressed for Access Granted
    deniedCount: 0,
    //times caps is pressed for Access Denied
    secCount: 0,
    //times caps is pressed for Access Denied
    coldCount: 0
}, _defineProperty(_Typer, "secCount", 0), _defineProperty(_Typer, "radarCount", 0), _defineProperty(_Typer, "windowCount", 0), _defineProperty(_Typer, "ponyCount", 0), _defineProperty(_Typer, "tagList", []), _defineProperty(_Typer, "typeIntervalCounter", 0), _defineProperty(_Typer, "typeInterval", false), _defineProperty(_Typer, "init", function init() {
    // inizialize Hacker Typer
    this.accessCountimer = setInterval(function () {
        Typer.updLstChr();
    }, 500);
    // inizialize timer for blinking cursor
    $.get(Typer.file, function (data) {
        // get the text file
        Typer.text = data;
        // save the textfile in Typer.text
    });
}), _defineProperty(_Typer, "content", function content() {
    return $("#console").html();
    // get console content
}), _defineProperty(_Typer, "write", function write(str) {
    // append to console content
    $("#console").append(str);
    return false;
}), _defineProperty(_Typer, "makeAccess", function makeAccess() {
    //create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.accessCount = 0;
    //reset count
    var ddiv = $("<div id='gran'>").html("");
    // create new blank div and id "gran"
    ddiv.addClass("accessGranted");
    // add class to the div
    ddiv.html("<h1>ACCESS GRANTED</h1>");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "makeDenied", function makeDenied() {
    //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.deniedCount = 0;
    //reset count
    var ddiv = $("<div id='deni'>").html("");
    // create new blank div and id "deni"
    ddiv.addClass("accessDenied");
    // add class to the div
    ddiv.html("<h1>ACCESS DENIED</h1>");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "makeSecurity", function makeSecurity() {
    //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.deniedCount = 0;
    //reset count
    var ddiv = $("<div id='secu'>").html("");
    // create new blank div and id "deni"
    ddiv.addClass("securityBreach");
    // add class to the div
    ddiv.html("<h1>SECURITY BREACH</h1><h2>LEVEL 3 ACCESS REQUIRED</h2>");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "makeColdWar", function makeColdWar() {
    //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.deniedCount = 0;
    //reset count
    var ddiv = $("<div id='cold'>").html("");
    // create new blank div and id "deni"
    ddiv.addClass("coldwar");
    // add class to the div
    ddiv.html("<img src='../assets/img/o5dtIHA.gif'>");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "makeRadar", function makeRadar() {
    //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.radarCount = 0;
    //reset count
    var ddiv = $("<div id='radar'>").html("");
    // create new blank div and id "deni"
    ddiv.addClass("radar");
    // add class to the div
    ddiv.html("<img src='../assets/img/id2kyxB.gif'><br />");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "makePony", function makePony() {
    //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.ponyCount = 0;
    //reset count
    var ddiv = $("<div id='pony'>").html("");
    // create new blank div and id "deni"
    ddiv.addClass("pony");
    // add class to the div
    ddiv.html("<img src='../assets/img/YggdgGU.gif'>");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "makeWindow", function makeWindow() {
    //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
    Typer.hidepop();
    // hide all popups
    Typer.windowCount = 0;
    //reset count
    var ddiv = $("<div id='window'>").html("");
    // create new blank div and id "deni"
    ddiv.addClass("window");
    // add class to the div
    ddiv.html("<iframe src='../hackertyper/index.html' width='640px' height='480px' ></iframe>");
    // set content of div
    $(document.body).prepend(ddiv);
    // prepend div to body
    return false;
}), _defineProperty(_Typer, "hidepop", function hidepop() {
    // remove all existing popups
    $("#deni").remove();
    $("#gran").remove();
    $("#secu").remove();
    $("#cold").remove();
    $("#pony").remove();
    $("#window").remove();
}), _defineProperty(_Typer, "removeText", function removeText() {
    if (Typer.text) {
        /*
        var usedTags= new RegExp("<img.*?>", "gi");
        //var foundTag = usedTags.exec(Typer.text.substring(Typer.index,-Typer.index));
        //console.log(Typer.text.substring(Typer.index,-Typer.index));
        var foundTags = /<img.*?>/gi.exec(Typer.index,-Typer.index);
        console.log(foundTags)
        while(usedTags.test(Typer.text.substring(Typer.index,-Typer.index))==true) {
        console.log(usedTags.lastIndex,/<img.*?>/gi.exec(Typer.text.substring(usedTags.lastIndex)));
        }
        */
        //if(foundTag instanceof Array && foundTag[0] == Typer.text.substring(Typer.index,-foundTag[0].length)) {
        //	Typer.index -= foundTag[0].length;//console.log(foundTag[0],foundTag)
        //console.log(Typer.text.substring(Typer.index,-foundTag[0].length))
        //}
        //Typer.text.substring(Typer.index),foundTag)
        Typer.index = Typer.index > 0 ? Typer.index - Typer.speed * 2 : 0;
        //console.log(Typer.text.substring(0,Typer.index-(Typer.speed)))
        Typer.addText(event);
    }
}), _defineProperty(_Typer, "addText", function addText(key) {
    //Main function to add the code
    if (key.keyCode == 109) {
        // key 18 = alt key
        Typer.accessCount++;
        //increase counter 
        if (Typer.accessCount >= 1) {
            // if it's presed 3 times
            Typer.makeAccess();
            // make access popup
        }
    } else if (key.keyCode == 107) {
        // key 20 = caps lock
        Typer.deniedCount++;
        // increase counter
        if (Typer.deniedCount >= 1) {
            // if it's pressed 3 times
            Typer.makeDenied();
            // make denied popup
        }
    } else if (key.keyCode == 106) {
        // key 20 = caps lock
        Typer.coldCount++;
        // increase counter
        if (Typer.coldCount >= 1) {
            // if it's pressed 3 times
            Typer.makeColdWar();
            // make denied popup
        }
    } else if (key.keyCode == 104) {
        // key 20 = caps lock
        Typer.radarCount++;
        // increase counter
        if (Typer.radarCount >= 1) {
            // if it's pressed 3 times
            Typer.makeRadar();
            // make denied popup
        }
    } else if (key.keyCode == 98) {
        // key 20 = caps lock
        Typer.ponyCount++;
        // increase counter
        if (Typer.ponyCount >= 1) {
            // if it's pressed 3 times
            Typer.makePony();
            // make denied popup
        }
    } else if (key.keyCode == 96) {
        // key 20 = caps lock
        Typer.windowCount++;
        // increase counter
        if (Typer.windowCount >= 1) {
            // if it's pressed 3 times
            Typer.makeWindow();
            // make denied popup
        }
    } else if (key.keyCode == 111) {
        // key 20 = caps lock
        Typer.secCount++;
        // increase counter
        if (Typer.secCount >= 1) {
            // if it's pressed 3 times
            Typer.makeSecurity();
            // make denied popup
        }
    } else if (key.keyCode == 27) {
        // key 27 = esc key
        Typer.hidepop();
        // hide all popups
    } else if (Typer.text) {
        // otherway if text is loaded

        if (Typer.index <= 0) {
            $("#console").html('');
        }

        Typer.index = Typer.index % Typer.text.length;

        var cont = Typer.content();
        // get the console content
        if (cont.substring(cont.length - 1, cont.length) == "|")
            // if the last char is the blinking cursor
            $("#console").html($("#console").html().substring(0, cont.length - 1));
        // remove it before adding the text
        /*
        if(key.keyCode!=8){ // if key is not backspace
        Typer.index+=Typer.speed;	// add to the index the speed
        }else{
        if(Typer.index>0) // else if index is not less than 0 
        Typer.index-=Typer.speed;//	remove speed for deleting text
        }
        */
        var text = Typer.text.substr(Typer.index, Typer.speed);
        //Typer.index-(Typer.speed));// parse the text for stripping html enities
        var rtn = new RegExp("\n", "g");
        // newline regex
        //var rts= new RegExp("\\s", "g"); // whitespace regex
        var rtt = new RegExp("\\t", "g");
        // tab regex
        text = text.replace(rtn, "<br/>").replace(rtt, "&nbsp;&nbsp;&nbsp;&nbsp;");
        //.replace(rts,"&nbsp;");// replace newline chars with br, tabs with 4 space and blanks with an html blank
        //console.log(text);
        $("#console").append(text);

        var usedTags = new RegExp("<img.*?>", "g"),
            systemTags = new RegExp("{(.*?)}", "g");
        var foundTag = usedTags.exec(Typer.text.substring(Typer.index)),
            foundSystemTag = systemTags.exec(Typer.text.substring(Typer.index));
        if (foundTag instanceof Array && foundTag.index <= Typer.speed) {
            Typer.index += foundTag.index + foundTag[0].length;
            $("#console").append(foundTag[0]);
        } else if (foundSystemTag instanceof Array && foundSystemTag.index <= Typer.speed) {
            //Typer.text.replace(/{(.*?)}/,foundSystemTag[1]);
            Typer.index += foundSystemTag.index + foundSystemTag[0].length;
            $("#console").append(foundSystemTag[1]);
        } else Typer.index += Typer.speed;
        $('body').scrollTop($("#console").height());
        window.scrollBy(0, 50);
        // scroll to make sure bottom is always visible 

        // scroll to make sure bottom is always visible
        /*
        if(Typer.typeInterval) {
        clearInterval(Typer.typeInterval);
        Typer.typeIntervalCounter = 0;
        }
        Typer.typeInterval = setInterval(function() {
        console.log(Typer.typeIntervalCounter);
        //console.log(Typer.speed);
        var text=Typer.text.substring(0,Typer.index-(Typer.speed-Typer.typeIntervalCounter));// parse the text for stripping html enities
        var rtn= new RegExp("\n", "g"); // newline regex
        //var rts= new RegExp("\\s", "g"); // whitespace regex
        var rtt= new RegExp("\\t", "g"); // tab regex
        text = text.replace(rtn,"<br/>").replace(rtt,"&nbsp;&nbsp;&nbsp;&nbsp;");//.replace(rts,"&nbsp;");// replace newline chars with br, tabs with 4 space and blanks with an html blank
        //console.log(text);
        $("#console").html(text);
        $('body').scrollTop($("#console").height()); // scroll to make sure bottom is always visible
        if(Typer.typeIntervalCounter>Typer.speed) {
        clearInterval(Typer.typeInterval);
        Typer.typeIntervalCounter = 0;
        }
        Typer.typeIntervalCounter++;
        },10);
        */
    }
    if (key.preventDefault && key.keyCode != 122) {
        // prevent F11(fullscreen) from being blocked
        key.preventDefault();
    }
    ;if (key.keyCode != 122) {
        // otherway prevent keys default behavior
        key.returnValue = false;
    }
}), _defineProperty(_Typer, "updLstChr", function updLstChr() {
    try {
        // blinking cursor
        var cont = this.content();
        // get console 
        if (cont.substring(cont.length - 1, cont.length) == "|")
            // if last char is the cursor
            $("#console").html($("#console").html().substring(0, cont.length - 1));
            // remove it
        else this.write("|");
        // else write it
    } catch (e) {}
}), _Typer);

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML = h + ":" + m + ":" + s;
    var t = setTimeout(function () {
        startTime();
    }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}