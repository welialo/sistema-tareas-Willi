import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZEVISZuRfn1iC3be5b7xTMQiCZubXyTU",
    authDomain: "bdnosql-de619.firebaseapp.com",
    projectId: "bdnosql-de619",
    storageBucket: "bdnosql-de619.firebasestorage.app",
    messagingSenderId: "519369652548",
    appId: "1:519369652548:web:ca8a7287997f4a6ff5ff11",
    measurementId: "G-4F5M7695CX"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const alumnosRef = collection(db, "alumnos");

let modoEdicion = false;
let idAlumnoActual = "";

const form = document.getElementById("alumnoForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: form.nombre.value,
    edad: parseInt(form.edad.value),
    carrera: form.carrera.value,
    materias: form.materias.value.split(",").map(m => m.trim()),
    contacto: {
      email: form.email.value,
      telefono: form.telefono.value
    }
  };

  if (modoEdicion) {
    const ref = doc(db, "alumnos", idAlumnoActual);
    await updateDoc(ref, datos);
    modoEdicion = false;
    idAlumnoActual = "";
    form.querySelector("button").textContent = "Guardar";
  } else {
    await addDoc(alumnosRef, datos);
  }

  form.reset();
  mostrarAlumnos();
});

// Mostrar todos los alumnos
async function mostrarAlumnos() {
  const contenedor = document.getElementById("listaAlumnos");
  contenedor.innerHTML = "";
  const snapshot = await getDocs(alumnosRef);

  snapshot.forEach(docu => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p><strong>Edad:</strong> ${data.edad}</p>
      <p><strong>Carrera:</strong> ${data.carrera}</p>
      <p><strong>Materias:</strong> ${data.materias.join(", ")}</p>
      <p><strong>Email:</strong> ${data.contacto.email}</p>
      <p><strong>Teléfono:</strong> ${data.contacto.telefono}</p>
      <button onclick='editarAlumno("${docu.id}", ${JSON.stringify(data).replace(/"/g, '&quot;')})'>Editar</button>
    `;
    contenedor.appendChild(div);
  });
}

window.editarAlumno = (id, data) => {
  form.nombre.value = data.nombre;
  form.edad.value = data.edad;
  form.carrera.value = data.carrera;
  form.materias.value = data.materias.join(", ");
  form.email.value = data.contacto.email;
  form.telefono.value = data.contacto.telefono;
  idAlumnoActual = id;
  modoEdicion = true;
  form.querySelector("button").textContent = "Actualizar";
};

// Buscar alumno por nombre
window.buscarAlumno = async () => {
  const nombreBuscar = document.getElementById("buscar").value.trim().toLowerCase();
  const snapshot = await getDocs(alumnosRef);
  const contenedor = document.getElementById("listaAlumnos");
  contenedor.innerHTML = "";

  snapshot.forEach(docu => {
    const data = docu.data();
    if (data.nombre.toLowerCase().includes(nombreBuscar)) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${data.nombre}</h3>
        <p><strong>Edad:</strong> ${data.edad}</p>
        <p><strong>Carrera:</strong> ${data.carrera}</p>
        <p><strong>Materias:</strong> ${data.materias.join(", ")}</p>
        <p><strong>Email:</strong> ${data.contacto.email}</p>
        <p><strong>Teléfono:</strong> ${data.contacto.telefono}</p>
        <button onclick='editarAlumno("${docu.id}", ${JSON.stringify(data).replace(/"/g, '&quot;')})'>Editar</button>
      `;
      contenedor.appendChild(div);
    }
  });
};

mostrarAlumnos();




