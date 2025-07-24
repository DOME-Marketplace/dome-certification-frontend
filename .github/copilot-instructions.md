# Copilot Instructions for dome-certification-frontend

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Do NOT set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Overview

- This is an Angular 17+ SPA for DOME Certification, using TypeScript and Tailwind CSS.
- The app is structured by feature: `src/app/auth`, `src/app/pages`, `src/app/components`, etc.
- Services in `src/app/services` handle API, authentication, token, and storage logic.
- Guards in `src/app/guards` enforce authentication and role-based access.
- Interceptors in `src/app/interceptors` manage token injection for HTTP requests.
- Models in `src/app/models` define data structures for users, products, compliance, etc.

## Developer Workflows

- **Start dev server:** `npm start` or `ng serve` (http://localhost:4200/)
- **Run unit tests:** `npm test` or `ng test` (Karma)
- **Build:** `ng build` (output in `dist/`)
- **Docker builds:** Use `podman build --build-arg BUILD_ENV=<env>` for `sbx`, `test`, or `production` (see README for tags)

## Key Patterns & Conventions

- **Component naming:** Use PascalCase, suffix with `.component.ts` (e.g., `modalComments.component.ts`).
- **Service naming:** Suffix with `.service.ts` (e.g., `auth.service.ts`).
- **Feature modules:** Grouped by domain in `src/app/pages` and `src/app/components`.
- **State & config:** Environment files in `src/environments/` control API endpoints and build settings.
- **API integration:** All HTTP calls go through `api.service.ts` or related service files.
- **Auth flow:** Managed by `auth.service.ts`, `oauth.service.ts`, and guards/interceptors.
- **UI patterns:** Tailwind CSS for styling, reusable UI in `src/app/ui`.

## Integration Points

- **External APIs:** All backend communication via `api.service.ts`.
- **OAuth:** Configured in `oauth.config.ts`, used in `auth` components and services.
- **PDFs & assets:** Static files in `src/assets/pdf`, `src/assets/img`, etc.
- **Quill editor:** Config in `quill/quill.config.ts` for rich text editing.

## Examples

- To add a new page: create a component in `src/app/pages/<feature>/`, update `app.routes.ts`.
- To add a new API call: extend `api.service.ts` or create a new service in `src/app/services`.
- To enforce a new role: update `role.guard.ts` and related model in `user.role.model.ts`.

## References

- See `README.md` for build/test commands and Docker image instructions.
- See `angular.json` for build configuration and entry points.
- See `src/app/models` for data structure conventions.

---

_If any section is unclear or missing, please provide feedback for further refinement._
