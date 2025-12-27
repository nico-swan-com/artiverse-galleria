# 1.0.0 (2025-12-27)


### Bug Fixes

* **deploy:** update memory limits in deployment template for improved resource management ([ba96cf4](https://github.com/nico-swan-com/artiverse-galleria/commit/ba96cf47da91a1e1b4021481f72aabf578cd0808))
* Prevent session loading state hydration mismatch by adding a mounted check. ([8483b30](https://github.com/nico-swan-com/artiverse-galleria/commit/8483b30fb601de957b203f9acf6a3341b15401a2))
* resolve landing page issues ([#24](https://github.com/nico-swan-com/artiverse-galleria/issues/24)) ([b28ac19](https://github.com/nico-swan-com/artiverse-galleria/commit/b28ac19800c22c0694304f59d5d6e82165aa2b92))


### Features

* Add `prevState.avatar` as a fallback for the user avatar URL during edit. ([5621906](https://github.com/nico-swan-com/artiverse-galleria/commit/5621906778eda5a2128e42f0a9daccde8dfd4adc))
* Add GitHub Actions verify job, refactor ESLint configuration and lint command, and optimize order item count retrieval. ([52653e4](https://github.com/nico-swan-com/artiverse-galleria/commit/52653e4f25fd3f2389bfada8322f2f45265d2dfd))
* Add OpenAPI documentation, enhance image processing with WebP conversion and watermarking, and update dependencies. ([563d573](https://github.com/nico-swan-com/artiverse-galleria/commit/563d573300273558391ddaaf4ccfc085b1eb99b6))
* Add server-side filtering and pagination for artworks, including dedicated category/style fetching and URL parameter integration. ([602d0a4](https://github.com/nico-swan-com/artiverse-galleria/commit/602d0a48c2867f5d1f741a4a3beedba85d580275))
* Add session loading state and skeleton UI to the sidebar's user information section. ([b63d029](https://github.com/nico-swan-com/artiverse-galleria/commit/b63d029fad73b52a0a73deee91421d38aa6785b5))
* add unit tests for artists, orders, products, and users features. ([62ff370](https://github.com/nico-swan-com/artiverse-galleria/commit/62ff37053a9b08f625048b1e048cdfdfe9da7ec2))
* Add user avatar upload and replacement logic with new service and repository methods. ([e669935](https://github.com/nico-swan-com/artiverse-galleria/commit/e669935b0ce961da8f7a1d4ec6eef21e99107531))
* **checkout:** :sparkles: added checkout page ([#10](https://github.com/nico-swan-com/artiverse-galleria/issues/10)) ([b5a20e8](https://github.com/nico-swan-com/artiverse-galleria/commit/b5a20e8d2191ae12518cd13f8247ccddc01072bc))
* **ci:** improve release and deployment workflows ([9dbeba7](https://github.com/nico-swan-com/artiverse-galleria/commit/9dbeba70c767fcb6b5750086e76d0501295aa509))
* Conditionally skip environment variable validation during build and lint steps. ([80f9eae](https://github.com/nico-swan-com/artiverse-galleria/commit/80f9eaecea061c90eb9024548bd478cdec60d707))
* Enhance error handling in artist and product services, ensuring graceful degradation on fetch failures. ([47573d6](https://github.com/nico-swan-com/artiverse-galleria/commit/47573d6d5458b86e66eaef949d12f043cdded5d6))
* Enhance user session management with avatar support and fresh data fetching, and refactor sidebar for improved user display and branding. ([8e98de4](https://github.com/nico-swan-com/artiverse-galleria/commit/8e98de437feed34e9622c845f5143d534bf53bc2))
* Establish domain-specific errors, models, actions, and controllers for core entities while centralizing application constants. ([5c87ab7](https://github.com/nico-swan-com/artiverse-galleria/commit/5c87ab772e99a2f682c6cd89c568cc69119e1d26))
* Implement admin order management with order listing, details, and invoice generation. ([1b428c6](https://github.com/nico-swan-com/artiverse-galleria/commit/1b428c68023dc66d4d5c31a3e45dc35c27995c35))
* Implement analytics tracking and dashboard, add notification services, and refine checkout flow with new client components and database migrations. ([6f9317d](https://github.com/nico-swan-com/artiverse-galleria/commit/6f9317d1614fa9863cd87d84af360fbb2a2957b0))
* Implement avatar image cropping functionality with `react-easy-crop` and a dedicated crop dialog. ([3ab1942](https://github.com/nico-swan-com/artiverse-galleria/commit/3ab194286c87fc6623ca74a821b00b78c59b6b8d))
* Implement billing and order management system with Payfast integration, new database migrations, and updated checkout and profile pages. ([1b7fd1f](https://github.com/nico-swan-com/artiverse-galleria/commit/1b7fd1f40619353d116d58a1165d33ee2f7d5f4d))
* Implement direct product fetching by artist ID and update artist pages to use it. ([0499ff4](https://github.com/nico-swan-com/artiverse-galleria/commit/0499ff452d8338dd0db2414df861f45d81c558a1))
* implement robust database connection management with health checks, pooling, and graceful shutdown. ([a8c4a74](https://github.com/nico-swan-com/artiverse-galleria/commit/a8c4a748db5a2ed5f4d2f34009eee96bfc5c4247))
* Implement user profile management with a dedicated page, form, server actions for name, password, and avatar updates, and new UI components. ([b04f37c](https://github.com/nico-swan-com/artiverse-galleria/commit/b04f37cbb089c03d618cba8bb4e62045e5d0d910))
* Implement user registration, introduce new layout components, and redesign the user profile page. ([3bc6075](https://github.com/nico-swan-com/artiverse-galleria/commit/3bc607523f503237020ba2ab119708cf619dbf59))
* Introduce artist data caching, add authentication utilities, and refactor Next.js configuration. ([867a221](https://github.com/nico-swan-com/artiverse-galleria/commit/867a22107102d508110a204a79ba1467dfc94f0b))
* introduce dynamic breadcrumbs component and integrate into platform layout ([cad51d4](https://github.com/nico-swan-com/artiverse-galleria/commit/cad51d4a1352b958fb1623336b69ae3e68f7a13a))
* Introduce repository pattern, centralize error handling, validate environment variables, and refine user management. ([3bbc799](https://github.com/nico-swan-com/artiverse-galleria/commit/3bbc799c2713305d6a7811b19f91d233692335d8))
* Migrate database ORM from TypeORM to Drizzle ORM, including schema, migrations, and seeding. ([edb1c57](https://github.com/nico-swan-com/artiverse-galleria/commit/edb1c57edfaa6fda301d021e80d2fe2881706c49))
* Refactor admin user and artist management to use consolidated forms and dedicated pages instead of dialogs. ([8fe8253](https://github.com/nico-swan-com/artiverse-galleria/commit/8fe825374006cd0df8a9471705c2327f9620ee5e))
* **release:** automate versioning and releases with semantic-release ([ac6d1ab](https://github.com/nico-swan-com/artiverse-galleria/commit/ac6d1ab4b2af7955e05bf2a107fd054077571e87))
* Set 60-second revalidation for product data fetching. ([137aa01](https://github.com/nico-swan-com/artiverse-galleria/commit/137aa01f8eb31741a03846dcd881e21f7d6831a8))
* standardize form state types, implement avatar cache busting, and enhance media processing ([a28f52a](https://github.com/nico-swan-com/artiverse-galleria/commit/a28f52a0d2d98cf9435d92c4acf8a3aea0bedd29))
* standardize login path to `/login` and configure NextAuth sign-in page. ([7ea5ce6](https://github.com/nico-swan-com/artiverse-galleria/commit/7ea5ce6c160801ee56aba38e652f90b90b673cd5))
* Update Docker and CI configurations for improved deployment processes, enhance ESLint rules, and implement coverage thresholds in Jest tests. ([41cfe45](https://github.com/nico-swan-com/artiverse-galleria/commit/41cfe45ae57c2a6a90963b3a999b8561fabe1183))
* Update Logo component to use SVG for improved scalability and performance, while maintaining existing functionality. ([4598cf7](https://github.com/nico-swan-com/artiverse-galleria/commit/4598cf7e2a4a74b7154604cf9e96ea86a3fb740d))
