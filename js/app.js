(function(){
    let caja = document.querySelector(".cajaIngredientes")
    for (let index = 0; index < 15; index++) {
        let cajaIngrediente = document.createElement("div")
        cajaIngrediente.classList.add("cargador")
        caja.insertAdjacentElement("beforeend", cajaIngrediente)
    }
})();

let DOM = {
    button : document.querySelector("button"),
    resultado : document.querySelector("#resultado"),
    descripcion : document.querySelector(".descripcion"),
    btnDescripcion : document.querySelector(".btnDescripcion"),
    imgCocktail : document.querySelector(".imgG"),
    cajasIngredientes : document.querySelectorAll(".cargador"),
    cajaImgPrincipal : document.querySelector(".cargadorG"),
    nombreCocktail : document.querySelector("h2")
}

DOM.button.addEventListener("click", obtenerCocktail);

function obtenerCocktail(){
    cargarLoader()
    const link = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    setTimeout(() => {
        fetch(link)
        .then(response => { 
            if(response.ok){
                return response.json()
            }
            console.log("juan")
            return new Error("No encontrada")
        })
        .then(respuesta => {
            DOM.nombreCocktail.textContent = respuesta.drinks[0].strDrink
            agregarImagenPrincipal(respuesta.drinks[0].strDrinkThumb)
            const ingredientes = obtenerIngredientes(respuesta.drinks[0])
            agregarIngredientes(ingredientes)
            DOM.descripcion.textContent = respuesta.drinks[0].strInstructions
        })
        .catch(error => añadirImagenError())
    },1000)
}

function agregarIngredientes(ingredientes){
    DOM.cajasIngredientes.forEach(caja => caja.innerHTML = "")
    let link = "https://www.thecocktaildb.com/images/ingredients/"
    let cajas = DOM.cajasIngredientes;
    for (let index = 0; index < ingredientes.length; index++){
        fetch(link+ingredientes[index]+"-Small.png")
            .then(respuesta => {
                if(respuesta.ok){
                    return respuesta.blob()
                }
                else{
                    return new Error("Hay un error")
                }
            })
            .then(blob => {
                let img = document.createElement("img")
                img.src = URL.createObjectURL(blob)
                DOM.cajasIngredientes[index].classList.remove("pequenio","card-loader")
                cajas[index].appendChild(img)
                cajas[index].classList.add("d-inline")
            })
            .catch(error => cajas[index].src = "/Img/not_available.png")
    }
    eliminarLoaderIngredientes()
}

function eliminarLoaderIngredientes(){
    DOM.cajasIngredientes.forEach(ingrediente => {
        ingrediente.classList.remove("pequenio","card-loader","d-inline")
    })
}

function añadirImagenError(){
    DOM.imgCocktail.style.display = "block"
    DOM.imgCocktail.src = "Img/not_available.png"
}

function obtenerIngredientes(drinks){
    let contador = 1;
    let correcto = true;
    let prefijoIngredientes = "strIngredient"
    let arrayIngredientes = []
    while(correcto){
        if(drinks[prefijoIngredientes + contador]){
            arrayIngredientes.push(drinks[prefijoIngredientes + contador])
            contador++;
        }
        else{
            correcto = false
        }
    }
    return arrayIngredientes
}


function cargarLoader(){
    DOM.cajasIngredientes.forEach(caja => {
        caja.innerHTML = "";
        caja.classList.remove("d-inline")
           
    })
    DOM.imgCocktail.src = ""
    DOM.imgCocktail.style.display = "none"
    DOM.resultado.classList.remove("d-none")
    let loaderG = DOM.cajaImgPrincipal
    loaderG.classList.add("grande", "card-loader-grande", "card-loader--tabs")
    let loaders = DOM.cajasIngredientes
    loaders.forEach((loader) => {
        loader.classList.add("pequenio","card-loader","card-loader--tabs")
    })
}

function eliminarLoaderPrincipal(){
    DOM.cajaImgPrincipal.classList.remove("grande", "card-loader-grande", "card-loader--tabs")
}

function agregarImagenPrincipal(url){
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            eliminarLoaderPrincipal()
            let objectURL = URL.createObjectURL(blob);
            DOM.imgCocktail.style.display = "block"
            DOM.imgCocktail.src = objectURL
        });
}

DOM.btnDescripcion.addEventListener("click", mostrarDescripcion)

function mostrarDescripcion(e){
    DOM.descripcion.classList.remove("d-none")
    e.target.textContent = "Ocultar instrucciones"
    DOM.btnDescripcion.removeEventListener("click", mostrarDescripcion)
    DOM.btnDescripcion.addEventListener("click", ocultarDescripcion)
}

function ocultarDescripcion(e){
    DOM.descripcion.classList.add("d-none")
    e.target.textContent = "Mostrar instrucciones"
    DOM.btnDescripcion.removeEventListener("click", ocultarDescripcion)
    DOM.btnDescripcion.addEventListener("click", mostrarDescripcion)
}

