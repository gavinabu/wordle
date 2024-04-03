import {validateWordleGuess} from './validate-wordle-guess.js'
var selected = [1,1]
var state = "playing"
var urlparams = new URLSearchParams(location.search)
function getRandomInArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}
function getword() {
    if(urlparams.has("word")) {
        return atob(urlparams.get("word")).toUpperCase()
    } else {
        return getRandomInArray(posible).toUpperCase()
    }
}
var currentdata = {
    "attemptingword":getword(),
    "guesses":[]
}
function createBoard(w,h) {
    var board = document.getElementById("playingarea")
    document.getElementById("keyboard").innerHTML = `
    <div class="row">
                    <div class="key">Q</div>
                    <div class="key">W</div>
                    <div class="key">E</div>
                    <div class="key">R</div>
                    <div class="key">T</div>
                    <div class="key">Y</div>
                    <div class="key">U</div>
                    <div class="key">I</div>
                    <div class="key">O</div>
                    <div class="key">P</div>
                </div>
                <div class="row">
                    <div class="key">A</div>
                    <div class="key">S</div>
                    <div class="key">D</div>
                    <div class="key">F</div>
                    <div class="key">G</div>
                    <div class="key">H</div>
                    <div class="key">J</div>
                    <div class="key">K</div>
                    <div class="key">L</div>
                </div>
                <div class="row">
                    <div class="key" doublewidth>BACK</div>
                    <div class="key">Z</div>
                    <div class="key">X</div>
                    <div class="key">C</div>
                    <div class="key">V</div>
                    <div class="key">B</div>
                    <div class="key">N</div>
                    <div class="key">M</div>
                    <div class="key" doublewidth>ENTER</div>
                </div>
`
    board.innerHTML = ''
    for (let i = 0; i <h; i++) {
        var word = document.createElement("div")
        word.className="word"
        word.setAttribute("y",(i + 1).toString())
        for (let j = 0; j < w; j++) {
            //     <div class="box" validate="notext">.</div>
            var letter = document.createElement("div")
            letter.className="box"
            letter.setAttribute("validate","notext")
            letter.innerText="."
            word.append(letter)
        }
        board.append(word)
    }
}
createBoard(currentdata.attemptingword.length,6)
if (!localStorage.getItem("wordleinfo")) {
    localStorage.setItem("wordleinfo",JSON.stringify({
        wins:0,
        loses:0,
        streak:0,
        data:[0,0,0,0,0,0]
    }))
}
setInterval(() => {
    selected[1] = currentdata.guesses.length + 1
    document.querySelectorAll('.word .box').forEach((ele,index) => {
        if(Number.parseInt(ele.parentElement.getAttribute("y")) === selected[1]) {
            if(index % ele.parentElement.children.length == selected[0]-1) {
                ele.setAttribute("selected", null)
            } else {
                ele.removeAttribute("selected")
            }
        } else {
            ele.removeAttribute("selected")
        }
    })
},100)
var keymap = {
    "q": "q",
    "w": "w",
    "e": "e",
    "r": "r",
    "t": "t",
    "y": "y",
    "u": "u",
    "i": "i",
    "o": "o",
    "p": "p",
    "a": "a",
    "s": "s",
    "d": "d",
    "f": "f",
    "g": "g",
    "h": "h",
    "j": "j",
    "k": "k",
    "l": "l",
    "z": "z",
    "x": "x",
    "c": "c",
    "v": "v",
    "b": "b",
    "n": "n",
    "m": "m",
    "enter":"enter",
    "backspace":"back"
}
var iswarnshow = false
function warn(str) {
    if(!iswarnshow) {
        iswarnshow=true
        document.querySelector(".warn").innerText = str
        document.querySelector(".warn").setAttribute("display",null)
        setTimeout(() => {
            document.querySelector(".warn").removeAttribute("display")
            iswarnshow=false
        },1500)
    }

}
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
document.querySelector(".endscreen button#otherpojects").onclick = function () {
    location.replace("https://justwhatever.net/projects.html")
}
document.querySelector(".endscreen button#playagian").addEventListener("click", () => {
    location.reload()
})
function isvalid(word) {
    return inputable.includes(word.toLowerCase()) || posible.includes(word.toLowerCase())
}
function showendstate(victory) {
    var saveinfo = JSON.parse(localStorage.getItem("wordleinfo"))
    state="endscreen"
    document.querySelector(".endscreen").setAttribute("display","true")
    document.querySelector(".endscreen h1").innerHTML = victory ? "VICTORY" : "DEFEAT"
    if(victory) {
        saveinfo.wins++
        saveinfo.data[selected[1] - 1] = saveinfo.data[selected[1] - 1] + 1
        saveinfo.streak++
    } else {
        saveinfo.streak = 0
        saveinfo.loses++
    }
    document.querySelector(".endscreen .statboxes .big h1.wins").innerHTML = saveinfo.wins
    document.querySelector(".endscreen .statboxes .big h1.loses").innerHTML = saveinfo.loses
    document.querySelector(".endscreen .statboxes .big h1.streak").innerHTML = saveinfo.streak
    document.querySelectorAll(".endscreen .stats .stat .progbar").forEach((progbar,index) => {
        progbar.setAttribute("value",saveinfo.data[index])
        progbar.setAttribute("max",saveinfo.wins)
    })
    if(victory) {
        document.querySelector(".endscreen p.message").innerHTML = `Won in <strong>${selected[1]}</strong>`
    } else {
        document.querySelector(".endscreen p.message").innerHTML = `The word was <strong>${currentdata.attemptingword}</strong>`
    }
    localStorage.setItem("wordleinfo",JSON.stringify(saveinfo))
}
function getResults(word, answer) {
    return validateWordleGuess(answer,word)
}
function repeat(value,times) {
    var ret = []
    for (let i = 0; i < times; i++) {
        ret.push(value)
    }
    return ret
}
function processkey(name) {
    if(state == "playing") {
        var word = ""
        for (let i = 0; i < document.querySelector(`.word[y="${selected[1]}"]`).children.length; i++) {
            var ele = document.querySelector(`.word[y="${selected[1]}"]`).children[i]
            if(ele.innerText !== ".") {
                word = word + ele.innerText
            }
        }
        if(name == "enter") {
            if(word.length !== currentdata.attemptingword.length) {
                warn("Please finish your word")
            } else {
                if(!(isvalid(word) || word === currentdata.attemptingword)) {
                    warn("Not a valid word")
                } else {
                    var results = getResults(word.toLowerCase(), currentdata.attemptingword.toLowerCase())
                    results.forEach((value,index) => {
                        var ele = document.querySelector(`.word[y="${selected[1]}"]`).children[index]
                        ele.setAttribute("validate", value.state)
                        document.querySelectorAll(".key").forEach(key => {
                            if(key.innerHTML == word[index]) {
                                if(key.getAttribute("validate") == "notinword" || key.getAttribute("validate") == undefined || value.state == "correct") {
                                    key.setAttribute("validate",value.state)
                                }
                            }
                        })
                    })
                    selected[0] = 1
                    currentdata.guesses.push(word)
                    var didwin = true
                    results.forEach(result => {
                        if(result.state !=="correct") {
                            didwin = false
                        }
                    })
                    if(didwin) {
                        showendstate(true)
                    } else if(selected[1] == 6) {
                        showendstate(false)
                    }
                }
            }
        } else if(name == "back") {
            if(selected[0] !== 1) {
                if(selected[0] === currentdata.attemptingword.length) {
                    if(document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].innerText === ".") {
                        selected[0] -= 1
                        document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].innerText="."
                        document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].setAttribute("validate","notext")
                    } else {
                        document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].innerText="."
                        document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].setAttribute("validate","notext")
                    }
                } else {
                    selected[0] -= 1
                    document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].innerText="."
                    document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1].setAttribute("validate","notext")
                }
            }
        } else {
            var key = document.querySelector(`.word[y="${selected[1]}"]`).children[selected[0] - 1]
            key.innerText = name.toUpperCase()
            key.setAttribute("validate", "noinput")
            if(selected[0] !== currentdata.attemptingword.length) {
                selected[0] += 1
            }
        }
    }
}
document.addEventListener("keydown", e => {
    var name = keymap[e.key.toLowerCase()]
    if(name) {
        document.querySelectorAll(".key").forEach(ele => {
            if(ele.innerText.toLowerCase() === name.toLowerCase()) {
                ele.setAttribute("pressed",null)
            }
        })
        processkey(name)
    }
})
document.addEventListener("keyup", e => {
    var name = keymap[e.key.toLowerCase()]
    if(name) {
        document.querySelectorAll(".key").forEach(ele => {
            if(ele.innerText.toLowerCase() === name.toLowerCase()) {
                ele.removeAttribute("pressed")
            }
        })
    }
})
document.querySelectorAll(".key").forEach(ele => {
    ele.addEventListener("mousedown", event => {
        ele.setAttribute("pressed",null)
        processkey(ele.innerHTML.toLowerCase())
    })
    ele.addEventListener("mouseup", event => {
        ele.removeAttribute("pressed")
    })
})
