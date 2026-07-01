import { emailRegex, telRegex } from "./utilidades.js";

export function validarFormularioContacto(form) {
  const errores = [];
  const nombre = form.querySelector("#nombre");
  const email = form.querySelector("#email");
  const password = form.querySelector("#password");
  const telefono = form.querySelector("#telefono");
  const mensaje = form.querySelector("#mensaje");

  if (!nombre.value.trim()) {
    errores.push("El nombre es obligatorio.");
  } else if (nombre.value.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres.");
  }

  if (!emailRegex.test(email.value)) {
    errores.push("Ingresa un correo electrónico válido.");
  }

  if (password.value.length < 8) {
    errores.push("La contraseña debe tener al menos 8 caracteres.");
  }

  if (telefono.value && !telRegex.test(telefono.value)) {
    errores.push("Ingresa un teléfono válido.");
  }

  if (mensaje.value.trim().length < 10) {
    errores.push("El mensaje debe tener al menos 10 caracteres.");
  }

  return errores;
}
