# 🪐 Planetary Sim — Landing Page

Landing page oficial de pitch para **Planetary Sim**, desarrollada con **Three.js + Preact + GSAP + TypeScript** y desplegada automáticamente en **GitHub Pages** mediante **GitHub Actions**.

> *"Una pequeña civilización. Un planeta que evoluciona a su ritmo. Un legado que sobrevive a cada nuevo comienzo."*

---

## 🌟 Características

- **Secuencia de Entrada Scroll-Driven (4 Fases):**
  - **Fase 0 (Órbita):** Microplaneta 3D en el espacio profundo con barco orbitando, estrellas y llamado a la acción.
  - **Fase 1 (Acercamiento):** Dolly zoom continuo, emergencia gradual de islas y motas astrales.
  - **Fase 2 (Umbral):** Destello atmosférico y transición suave hacia la superficie.
  - **Fase 3 (Interior):** Presentación cálida del pitch editorial sobre fondo crema con tipografía estilizada.
- **Three.js procedural y optimizado:** Estilo clay/toon con shader procedural de agua, fresnel, aura térmica cuantizada a ~10fps para sensación stop-motion cozy sin jank de cámara.
- **Performance Budget:** Bundle inicial de JavaScript comprimido (< 200 KB gz).
- **Accesibilidad & Responsive:** Soporte completo de `prefers-reduced-motion`, enlace de salto accesible, y diseño fluido para dispositivos móviles y escritorio.

---

## 🛠️ Stack Tecnológico

| Capa | Herramienta |
|---|---|
| **Bundler & Dev** | [Vite](https://vite.dev/) + TypeScript |
| **Framework UI** | [Preact](https://preactjs.com/) + `@preact/signals` |
| **Gráficos 3D** | [Three.js](https://threejs.org/) (modular) |
| **Animación & Scroll** | [GSAP](https://gsap.com/) + ScrollTrigger |
| **Estilos** | CSS Vanilla con Design Tokens fluidos |
| **CI/CD & Deploy** | GitHub Actions → GitHub Pages |

---

## 🚀 Desarrollo Local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev

# 3. Compilar para producción
pnpm build

# 4. Previsualizar compilación
pnpm preview
```

---

## 📦 Despliegue en GitHub Pages

El proyecto incluye el flujo de trabajo [.github/workflows/deploy.yml](.github/workflows/deploy.yml) que compila y publica automáticamente la web en GitHub Pages ante cualquier `push` a la rama `main`.

### Configuración requerida en GitHub:
1. Ir al repositorio en GitHub: **Settings → Pages**.
2. En **Build and deployment > Source**, seleccionar: **GitHub Actions**.
3. Al hacer push a `main`, la GitHub Action ejecutará el build y publicará la landing en:
   `https://<usuario>.github.io/planetary-sim-website/`

---

## 📚 Documentación Técnica Detallada

Para una explicación exhaustiva de la arquitectura, el flujo de usuario, el motor 3D y el simulador de escritorio, consulta la suite de documentación en el directorio [docs/](docs/):

- 📖 **[docs/README.md](docs/README.md)** — Índice maestro y mapa general.
- 🎯 **[01. Visión y Propósito](docs/01-vision-y-proposito.md)** — Objetivos del pitch y reglas de marca.
- 🛠️ **[02. Arquitectura Técnica](docs/02-arquitectura-tecnica.md)** — Stack tecnológico y presupuesto de rendimiento.
- 🗺️ **[03. Flujo de Usuario y Experiencia](docs/03-flujo-de-usuario-y-experiencia.md)** — Recorrido interactivo y scrollytelling.
- 🪐 **[04. Motor 3D y Shaders Procedurales](docs/04-motor-3d-y-shaders.md)** — Three.js, shaders GLSL y animación a 12 FPS.
- ⚡ **[05. Estado Reactivo y Componentes](docs/05-estado-reactivo-y-componentes.md)** — Preact Signals y catálogo de componentes.
- 🖥️ **[06. Simulador Desktop Companion](docs/06-simulador-desktop-companion.md)** — Demostración interactiva de la ventana de escritorio.
- 🎨 **[07. Sistema de Diseño y Estilos](docs/07-sistema-de-diseno-y-estilos.md)** — Tokens CSS, tipografía fluida y accesibilidad.
- 🚀 **[08. Despliegue y DevOps](docs/08-despliegue-y-automatizacion.md)** — Vite, pnpm y GitHub Actions CI/CD.

---

## 📄 Licencia

Consulta el archivo [LICENSE](LICENSE) para más detalles.
