# FitTrack - Guía para Publicar Cambios en GitHub

Para que los ajustes que realices en este proyecto aparezcan en GitHub, sigue estos pasos desde tu terminal:

1. **Verifica el estado del repositorio**
   ```bash
   git status
   ```
   Esto te mostrará los archivos modificados.

2. **Añade los archivos que quieres publicar**
   ```bash
   git add .
   ```
   Puedes reemplazar `.` por rutas específicas si no deseas subir todo.

3. **Crea un commit con una descripción clara**
   ```bash
   git commit -m "Describe brevemente el cambio"
   ```

4. **Envía el commit a GitHub**
   ```bash
   git push origin <nombre-de-tu-rama>
   ```
   Sustituye `<nombre-de-tu-rama>` por la rama en la que estás trabajando, por ejemplo `main` o `develop`.

5. **Crea o actualiza tu Pull Request (opcional)**
   - Si trabajas con Pull Requests, abre GitHub en el navegador.
   - Ve a tu repositorio, selecciona la rama que acabas de subir y presiona **Compare & pull request**.
   - Añade una descripción del cambio y crea o actualiza el PR.

> 💡 Si GitHub te pide autenticarte al hacer `git push`, deberás iniciar sesión con tus credenciales o usar un token personal.

Siguiendo estos pasos, tus modificaciones quedarán registradas y visibles en GitHub.
