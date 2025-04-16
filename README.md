# 🎓 Patrones Hermosos

Este proyecto está diseñado para gestionar datos del evento de Patrones Hermosos.

---

## 🚀 Tecnologías utilizadas

- **Frontend**: React.js + Tailwind
- **Backend/API**: Node.js + Express
- **Base de datos**: MySQL (Prisma ORM)
- **Control de versiones**: Git + GitHub

---

## 🌿 Estructura de ramas

```plaintext
main
├── feature/
│   ├── components
│   ├── correo
│   ├── rutasAPI
│   └── sqlProcedures
└── pages/
    ├── coordinator
    ├── forms
    ├── home
    ├── login
    └── superuser
```

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/usuario/proyecto.git
cd proyecto
```

2. Instala dependencias:

```bash
npm install
```

3. Configura el archivo `.env`:

```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/nombre_db
PORT=3000
```

4. Corre migraciones:

```bash
npx prisma migrate dev
```

5. Inicia el servidor:

```bash
npm install
npm run build
npm run dev
```

---

## 🧑‍💻 Contribución

1. Crea una rama:

```bash
git checkout -b feature/nombre-de-la-rama
```

2. Haz tus cambios, súbelos y crea un Pull Request hacia `main`.

Consulta la [Guía de Contribución](./COLABORACIÓN.md) para más detalles.

---

## 🧠 Buenas prácticas

- No trabajes directamente sobre `main`.
- Usa mensajes de commit claros con formato `feat:`, `fix:`, etc.
- Mantén ramas pequeñas y con enfoque único.
- Siempre prueba antes de subir tus cambios.

---

## 📬 Contacto

Para dudas o sugerencias, contacta a los responsables del repositorio o abre un [issue](https://github.com/iiRoy/Patrones-Hermosos/issues).

---
🚀 ¡Gracias por contribuir y ser parte de este proyecto! 