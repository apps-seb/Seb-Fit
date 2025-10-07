# FitTrack - Guía para Publicar Cambios en GitHub

Sigue este flujo cada vez que quieras que tus modificaciones locales aparezcan en GitHub. Todos los comandos se ejecutan desde la terminal dentro de la carpeta del proyecto.

## 1. Verifica que estás en la rama correcta
```bash
git branch
```
Asegúrate de que el asterisco (`*`) marque la rama donde deseas subir los cambios (por ejemplo, `main` o `develop`). Si necesitas cambiarte, usa `git checkout nombre-de-la-rama`.

## 2. Actualiza tu copia local (opcional pero recomendado)
```bash
git pull origin nombre-de-la-rama
```
Trae los cambios más recientes de GitHub para evitar conflictos antes de subir tus modificaciones.

## 3. Revisa qué archivos cambiaste
```bash
git status
```
Verás los archivos modificados, nuevos o eliminados. Si algo no debería subir, corrígelo ahora.

## 4. Prepara los archivos para el commit
```bash
git add archivo1 archivo2
```
Puedes añadir archivos puntuales o usar `git add .` para incluir todos los cambios listados en el estado.

## 5. Crea un commit descriptivo
```bash
git commit -m "Descripción breve del cambio"
```
Escribe mensajes claros que expliquen la intención del cambio.

## 6. Sube el commit a GitHub
```bash
git push origin nombre-de-la-rama
```
Introduce la contraseña o token si Git lo solicita. Después del `push`, tus commits ya estarán en GitHub.

## 7. Crea o actualiza el Pull Request (si aplica)
1. Abre GitHub en tu navegador.
2. Ve al repositorio y selecciona la rama a la que acabas de hacer `push`.
3. Pulsa **Compare & pull request** y describe tus cambios.
4. Guarda el PR o actualiza uno existente.

---

### Problemas frecuentes y soluciones rápidas
- **Git me pide usuario y contraseña:** usa un [token personal de GitHub](https://github.com/settings/tokens) en lugar de la contraseña.
- **Tengo conflictos al hacer `git pull`:** revisa los archivos marcados por Git, resuelve las diferencias y luego repite `git add`, `git commit` y `git push`.
- **No veo mi rama en GitHub:** confirma que el `push` se hizo a la rama correcta y recarga la página del repositorio.

Siguiendo estos pasos, tus cambios quedarán registrados y visibles en GitHub.
