# 🛠️ Guía de Contribución

¡Gracias por contribuir a este proyecto! Este repositorio sigue un flujo estructurado de ramas para facilitar el trabajo en equipo y mantener el código limpio y organizado.

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

> 🎯 **`main` debe mantenerse siempre estable y listo para producción.**  
> Todos los cambios se integran mediante **pull requests**.

---

## 📛 Convenciones para nombrar ramas

Usa prefijos según el tipo de trabajo:

| Tipo de rama          | Prefijo          | Ejemplo                       |
|-----------------------|------------------|-------------------------------|
| Nueva funcionalidad   | `feature/`       | `feature/rutasAPI`           |
| Página o componente UI| `pages/`         | `pages/superuser`            |
| Refactorización       | `refactor/`      | `refactor/sql-depuracion`    |
| Corrección de bugs    | `fix/` o `bugfix/`| `fix/login-error`            |
| Pruebas o experimentos| `experiment/`    | `experiment/nueva-api`       |

---

## 🔁 Flujo de trabajo

1. **Crea una rama nueva:**

   ```bash
   git checkout -b feature/nombre-de-la-rama
   ```

2. **Haz tus cambios y commitea:**

   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```

3. **Sube tu rama a GitHub:**

   ```bash
   git push origin feature/nombre-de-la-rama
   ```

4. **Abre un Pull Request (PR)** hacia `main`.

---

## ✅ Reglas para Pull Requests

- Un PR **debe tener título y descripción claros**.
- Si el PR cambia estructura o lógica clave, **solicita revisión a otra persona**.
- Asegúrate de que el código **compila y pasa las pruebas** antes de hacer merge.
- Idealmente, incluye capturas o demos si el cambio es visual.

---

## 🧼 Limpieza de ramas

- Una vez hecho el merge, **elimina la rama si ya no se usará**:

  ```bash
  git push origin --delete feature/nombre-de-la-rama
  ```

---

## 🧠 Buenas prácticas

- **No trabajes directamente en `main`**.
- **Commits pequeños y frecuentes**, con mensajes descriptivos.
- Prefiere PRs enfocados: un cambio por PR.
- Usa [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) si es posible (`feat:`, `fix:`, `refactor:`...).

---

Gracias por seguir estas reglas. ¡Construyamos algo genial juntos! 🚀