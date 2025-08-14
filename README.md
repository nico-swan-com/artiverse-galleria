# E-commerce Art Gallery Website: Artiverse Galleria

[![wakatime](https://wakatime.com/badge/user/51cddd85-c511-4b03-b6f1-57ae91619f53/project/f87ff665-d3df-4e8c-ae72-35dd79ded07a.svg)](https://wakatime.com/badge/user/51cddd85-c511-4b03-b6f1-57ae91619f53/project/f87ff665-d3df-4e8c-ae72-35dd79ded07a)

## Project Description

This project is a modern e-commerce art gallery website built with Next.js 15, enabling artists to showcase their portfolios and sell artwork online. The platform provides a seamless experience for art collectors, enthusiasts, and interior designers, featuring detailed artwork information, artist portfolios, and integrated QR code functionality for easy access to product pages.

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
- [ ] Multiple payment gateway integration (currently simulated)
- [ ] Order tracking and shipping notifications (not implemented)
- [ ] Secure customer account management (basic auth exists)
- [ ] Invoice generation (not implemented)
- [ ] Order management system (not implemented)

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
- [ ] Process orders and manage inventory (basic product management exists)
- [ ] Update website content and blog posts (not implemented)
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
- [ ] Input validation and sanitization (partially implemented)

### Additional Features

- [x] QR code generation for artwork pages
- [x] Email functionality with nodemailer (configured but simulated in dev)
- [x] Docker containerization and Kubernetes deployment
- [x] CI/CD pipeline with GitHub Actions
- [x] Database migrations and seeding with TypeORM
- [x] Comprehensive testing setup with Jest

## Technical Specifications

- **Frontend Framework:** Next.js 15 (App Router)
- **Programming Language:** TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Context API
- **Image Processing:** Sharp.js for optimization and watermarking
- **Hosting:** Container-based Kubernetes deployment
- **CI/CD:** GitHub Actions with Docker Hub integration

## Current Implementation Status

### ✅ Completed Features

- Core website structure and navigation
- Artist and artwork management system
- Shopping cart functionality
- Basic checkout process
- Admin dashboard and CMS
- Media management system
- User authentication and authorization
- Database schema and migrations
- Responsive design and UI components
- QR code generation
- Email system configuration
- Deployment infrastructure

### 🚧 Partially Implemented

- Wishlist functionality (UI exists, no persistence)
- Image zoom and advanced viewing
- Payment processing (simulated only)
- Order management system
- Blog/news section
- Advanced search and filtering

### ❌ Not Yet Implemented

- Real payment gateway integration
- Order tracking and shipping
- Invoice generation
- Customer account management
- Blog content management
- Advanced SEO features
- Rate limiting and security hardening
- Analytics and reporting

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
npm run migration:run

# Seed the database
npm run migration:seed

# Start development server
npm run dev
```

### Production Deployment

```bash
# Build for production
npm run build:standalone

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
4. **Media Library:** Upload and organize images and documents

## Contributing

Please see our [contributors guide](./CONTRIBUTORS.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Nico Swan e-mail: [hi@nicoswan.com](mailto://hi@nicoswan.com)

## Success Metrics

- [x] Website traffic and engagement (page views, bounce rate, time on site)
- [ ] Conversion rate (sales) - requires payment integration
- [ ] Customer satisfaction (reviews, feedback) - not implemented
- [x] QR code scan analytics - basic tracking implemented

## Next Steps

### Priority 1 (Critical for E-commerce)

1. Integrate real payment gateway (Stripe/PayPal)
2. Implement order management system
3. Add customer account management
4. Complete wishlist functionality

### Priority 2 (User Experience)

1. Implement image zoom and advanced viewing
2. Add advanced search and filtering
3. Complete blog/news section
4. Add customer reviews and ratings

### Priority 3 (Business Features)

1. Implement analytics and reporting
2. Add inventory management
3. Complete shipping and order tracking
4. Add invoice generation

### Priority 4 (Technical Improvements)

1. Add comprehensive testing
2. Implement rate limiting
3. Add advanced security features
4. Optimize performance and caching
