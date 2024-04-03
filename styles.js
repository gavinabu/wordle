setInterval(() => {
    document.querySelectorAll(".progbar").forEach(bar => {
        var value = bar.getAttribute("value")
        var max = bar.getAttribute("max")
        var display = bar.getAttribute("display")
        bar.innerHTML = ""
        switch (display) {
            case "number": {
                var inner = document.createElement("div")
                inner.className="inside"
                inner.innerHTML = `<span>${Number.parseInt(value)}</span>`
                inner.style.width = `${Math.floor(Number.parseInt(value) / Number.parseInt(max) * 1000)/10}%`
                bar.append(inner)
                break
            }
            case "percent": {
                var inner = document.createElement("div")
                inner.className="inside"
                inner.innerHTML = `<span>${Math.floor(Number.parseInt(value) / Number.parseInt(max) * 1000)/10}%</span>`
                inner.style.width = `${Math.floor(Number.parseInt(value) / Number.parseInt(max) * 1000)/10}%`
                bar.append(inner)
            }
        }
    })
},250)