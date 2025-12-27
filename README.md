# E-commerce Art Gallery Website: Artiverse Galleria

[![wakatime](https://wakatime.com/badge/user/51cddd85-c511-4b03-b6f1-57ae91619f53/project/f87ff665-d3df-4e8c-ae72-35dd79ded07a.svg)](https://wakatime.com/badge/user/51cddd85-c511-4b03-b6f1-57ae91619f53/project/f87ff665-d3df-4e8c-ae72-35dd79ded07a)

## Project Description

This project is a modern e-commerce art gallery website built with Next.js 16, enabling artists to showcase their portfolios and sell artwork online. The platform provides a seamless experience for art collectors, enthusiasts, and interior designers, featuring detailed artwork information, artist portfolios, and integrated QR code functionality for easy access to product pages.

## Key Features

### Artist Portfolios

- [x] Dedicated portfolio pages for each artist (`/artists/[id]`)
- [x] High-resolution image galleries of available artworks
- [x] Artist biographies, statements, and contact information
- [x] Categorization and filtering of artworks (style, medium, subject)
- [x] Search functionality within portfolios
- [x] Artist listing page with filtering and pagination

### Artwork Detail Pages

- [x] Detailed product pages with multiple high-resolution images
- [x] Artwork details (title, artist, year, medium, dimensions, weight)
- [x] Detailed descriptions and inspiration
- [x] Pricing and availability status (stock management)
- [x] "Add to cart" functionality
- [ ] "Add to wishlist" functionality (UI exists but no backend persistence)
- [ ] Zoomable images (basic image display implemented)
- [ ] Shipping and delivery information (placeholder text only)

### E-commerce Functionality

- [x] Secure shopping cart with localStorage persistence
- [x] Checkout process with form validation
- [x] PayFast Integration (Mock Implementation with ITN support)
- [x] Order tracking and notifications (Basic implementation)
- [x] Secure customer account management (NextAuth.js)
- [x] Invoice generation
- [x] Order management system (Admin Dashboard)

### Website Design and UX

- [x] Clean, modern, and visually appealing design with Tailwind CSS
- [x] Responsive design for all devices
- [x] Intuitive navigation and user interface
- [x] Optimized image loading with lazy loading and blur effects
- [x] About us page
- [x] Contact us page with form submission
- [ ] Blog/news section (commented out in admin navigation)

### Content Management System (CMS)

- [x] User-friendly admin dashboard for gallery administrators
- [x] Manage artist profiles and artwork listings
- [x] Media management with upload, edit, and delete capabilities
- [x] User management system
- [x] Process orders and manage inventory
- [ ] Update website content and blog posts (not yet implemented)
- [x] QR code generation and management

### SEO Optimization

- [x] SEO best practices with Next.js App Router
- [x] Dynamic metadata for pages
- [x] Image optimization with Next.js Image component
- [ ] Keyword optimization for artwork titles, descriptions, and image alt text
- [ ] Sitemap generation and submission (not implemented)

### Security

- [x] SSL certificate implementation (deployment ready)
- [x] Secure customer data storage with bcrypt password hashing
- [x] Protection against web vulnerabilities (basic auth guards)
- [x] NextAuth.js integration for authentication
- [ ] Rate limiting (not implemented)
- [x] Input validation and sanitization (Zod schemas)

### Additional Features

- [x] QR code generation for artwork pages
- [x] Email functionality with nodemailer (configured)
- [x] Docker containerization and Kubernetes deployment
- [x] CI/CD pipeline with GitHub Actions
- [x] Database migrations and seeding with Drizzle ORM
- [x] Comprehensive testing setup with Jest
- [x] Analytics and Dashboard reporting

## Technical Specifications

- **Frontend Framework:** Next.js 16 (App Router)
- **Programming Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Context API / TanStack Query
- **Image Processing:** Sharp.js for optimization
- **Hosting:** Container-based Kubernetes deployment
- **CI/CD:** GitHub Actions with Docker Hub integration

## Current Implementation Status

### ✅ Completed Features

- Core website structure and navigation
- Artist and artwork management system
- Shopping cart functionality
- Checkout process with PayFast Mock integration
- Admin dashboard and CMS (Artists, Products, Users, Medias, Analytics)
- Media management system
- User authentication and authorization
- Database schema and migrations (Drizzle)
- QR code generation
- Email system configuration
- Invoice generation
- Basic Order Management

### 🚧 Partially Implemented

- Wishlist functionality (UI exists, no persistence)
- Image zoom and advanced viewing
- Blog/news section
- Advanced search and filtering

### ❌ Not Yet Implemented

- Real payment gateway integration (Stripe/PayPal)
- Order tracking and shipping notifications integration
- Full-scale Sitemap generation
- Rate limiting and security hardening

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Docker (for containerized deployment)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd artiverse-galleria

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and SMTP settings

# Run database migrations
npm run db:push

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Usage

### For Visitors

1. **Browse Artworks:** Navigate to `/artworks` to view all available pieces
2. **Artist Portfolios:** Visit `/artists` to explore individual artist collections
3. **Shopping Cart:** Add items to cart and proceed through checkout
4. **QR Codes:** Scan QR codes on artwork to access product pages directly

### For Administrators

1. **Dashboard:** Access `/admin` for comprehensive management
2. **Content Management:** Manage artists, artworks, and media through the CMS
3. **User Management:** Handle user accounts and permissions
4. **Analytics:** View performance metrics and order history

## Contributing

Please see our [contributors guide](./CONTRIBUTORS.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Nico Swan e-mail: [hi@nicoswan.com](mailto://hi@nicoswan.com)

## Success Metrics

- [x] Website traffic and engagement (Analytics Dashboard)
- [x] Order monitoring (Admin Orders view)

## Next Steps

### Priority 1 (Critical for E-commerce)

1. Enhance order status tracking integration
2. Complete wishlist persistence

### Priority 2 (User Experience)

1. Implement image zoom and advanced viewing
2. Add advanced search and filtering (Elasticsearch or similar)
3. Complete blog/news section

### Priority 3 (Business Features)

1. Add inventory management with low-stock alerts
2. Complete shipping and order tracking integration

### Priority 4 (Technical Improvements)

1. Implement rate limiting and WAF
2. Optimize edge caching for artworks
3. Automated Sitemap generation
