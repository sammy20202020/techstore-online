# TechStore Online — Angular SPA

Migración del ecommerce HTML/CSS/JS a **Angular 19** siguiendo la Práctica 4.

## Requisitos cumplidos

- **Componentes:** navbar, footer, product-card, search-bar, category-menu
- **Páginas:** home, productos (lazy loading), detalle-producto, carrito, checkout, contacto, not-found, login, perfil, historial, admin
- **Routing SPA** con `router-outlet` y rutas protegidas
- **Data Binding:** interpolación, property, event y two-way (`[(ngModel)]`)
- **Directivas:** `*ngIf`, `*ngFor`, `@switch`, `[ngClass]`, `[ngStyle]`
- **Servicios:** ProductoService, CarritoService, AuthService, ThemeService, HistorialService
- **Comunicación:** `@Input()` / `@Output()` / `EventEmitter` en product-card
- **Formularios reactivos** en checkout y contacto con validaciones
- **API REST:** Fake Store API con fallback a `assets/data/productos.json`
- **RxJS:** BehaviorSubject, map, filter, tap, catchError, switchMap
- **Pipes:** descuento (custom), CurrencyPipe, DatePipe, UpperCasePipe
- **LocalStorage:** carrito, tema oscuro, favoritos, historial, sesión JWT
- **Guard:** auth (checkout, perfil, historial, admin)
- **Interceptor:** JWT + manejo global de errores
- **Lazy Loading:** módulo `ProductosModule`
- **Bonus:** login/registro JWT, tema oscuro, favoritos, historial, paginación

## Instalación

```bash
cd techstore
npm install
ng serve -o
```

La app estará en `http://localhost:4200`

## Build producción

```bash
ng build
```

## Estructura

```
src/app/
├── components/     # Componentes reutilizables
├── pages/          # Vistas por ruta
├── services/       # Lógica de negocio
├── models/         # Interfaces TypeScript
├── guards/         # Protección de rutas
├── interceptors/   # HTTP interceptors
├── pipes/          # Pipes personalizados
└── shared/         # Utilidades compartidas
```

## Credenciales demo

Para acceder a checkout, perfil e historial, inicia sesión en `/login` con cualquier email y contraseña (mín. 6 caracteres).
