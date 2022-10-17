async function realizarPeticion(data) {
    const response = await fetch(
        'http://localhost:8000/myApp/auth',
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json'
            }
        }
    );
    return await response.json();
}
document.querySelector('#botonLoguin').addEventListener('click', function () {
    data = {
        correo: document.querySelector('#correo').value,
        contraseña: document.querySelector('#contraseña').value,
    }
    realizarPeticion(data)
        .then(respuesta => {
            if (respuesta.login) {
                window.location.href = respuesta.enlaceHome;
            } else {
                // window.location.href = respuesta.index;
                const alerta = document.querySelector("#Alerta_error");
                alerta.classList.remove("d-none");
            }
        });
});




// window.location.reload(); 

// location.reload()

