document.addEventListener("DOMContentLoaded", function () {
    const fadeLink = document.getElementById("fade-link");

    fadeLink.addEventListener("click", function (event) {
        event.preventDefault(); // Evita la redirección inmediata
        document.body.classList.add("fade-out"); // Aplica la animación de salida

        setTimeout(function () {
            window.location.href = fadeLink.href; // Redirige después de la animación
        }, 1000); // 1 segundo, igual que la duración de la transición en CSS
    });
});
