document.getElementById("word").addEventListener("keyup", (e) => {
    document.getElementById("link").href = `https://wordle.justwhatever.net/?word=${btoa(e.target.value)}`
    document.getElementById("link").innerText = `https://wordle.justwhatever.net/?word=${btoa(e.target.value)}`
})