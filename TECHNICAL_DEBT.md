# Technical Debt & Future Features

This document tracks removed features, known limitations, and planned improvements for the Artiverse Galleria project.

## Removed Features

### Wishlist Functionality

**Status:** Removed from UI (2024)

**Reason for Removal:**
The wishlist feature had UI components implemented but lacked backend persistence. Rather than leaving incomplete functionality visible to users, the wishlist UI was removed to maintain a clean, production-ready portfolio.

**What Was Removed:**

- Wishlist button from artwork detail pages (`ArtworkDetailClient.tsx`)
- Wishlist icon from artwork card hover overlay (`ArtworkCard.tsx`)
- Related state management and toggle functions

**Future Implementation:**
When implementing wishlist functionality in the future, consider:

1. Adding a `wishlists` table to the database schema
2. Creating a `WishlistRepository` and `WishlistService`
3. Implementing API routes for wishlist CRUD operations
4. Adding server actions for wishlist management
5. Re-implementing the UI components with proper backend integration

### Blog/News Section

**Status:** Never implemented (removed from roadmap)

**Reason for Removal:**
The blog/news section was listed as a planned feature but was never implemented. It has been removed from the roadmap to keep the project focused on core e-commerce functionality.

**Future Implementation:**
If needed in the future, consider:

1. Creating a CMS solution (e.g., using a headless CMS like Contentful or Strapi)
2. Implementing a simple markdown-based blog system
3. Adding database tables for posts, categories, tags
4. Creating admin interface for content management

## Known Limitations

### Payment Gateway Integration

**Current State:** Mock PayFast implementation
**Impact:** Payment processing is simulated and not suitable for real transactions
**Future Plan:** Integrate real payment gateway (Stripe, PayPal, or actual PayFast) with proper webhook handling

### Rate Limiting Storage

**Current State:** In-memory rate limiting using LRU cache
**Impact:** Rate limits are reset on server restart and not shared across instances
**Future Plan:** Migrate to Redis-based rate limiting for production deployments with multiple instances

### Image Optimization

**Current State:** Basic image optimization with Next.js Image component
**Impact:** No advanced image transformations or CDN integration
**Future Plan:** Consider implementing Cloudinary or similar service for advanced image processing

### Search Functionality

**Current State:** Basic search within portfolios
**Impact:** Limited search capabilities, no full-text search across all content
**Future Plan:** Implement Elasticsearch or similar search engine for comprehensive search functionality

### Order Tracking

**Current State:** Basic order management in admin dashboard
**Impact:** No external shipping integration or automated tracking updates
**Future Plan:** Integrate with shipping provider APIs (e.g., ShipStation, EasyPost) for automated tracking

## Planned Improvements

### High Priority

1. **Complete Payment Gateway Integration**
   - Integrate real payment provider
   - Implement proper webhook handling
   - Add payment method management

2. **Enhanced Rate Limiting**
   - Migrate to Redis-based rate limiting
   - Implement user-specific rate limits (in addition to IP-based)
   - Add rate limit monitoring and reporting

3. **Comprehensive Testing**
   - Increase test coverage to 70%+
   - Add integration tests for critical flows
   - Implement E2E tests with Playwright

### Medium Priority

1. **Advanced Search**
   - Implement full-text search
   - Add filtering and sorting options
   - Search result analytics

2. **Performance Optimization**
   - Implement CDN for static assets
   - Add database query optimization
   - Implement caching strategies

3. **Enhanced Analytics**
   - User behavior tracking
   - Conversion funnel analysis
   - Real-time analytics dashboard

### Low Priority

1. **Wishlist Functionality** (if user demand warrants)
2. **Blog/News Section** (if content marketing strategy requires)
3. **Social Media Integration** (sharing, authentication)
4. **Multi-language Support** (i18n)

## Notes

- This document should be reviewed and updated regularly
- Items marked as "Future Implementation" are not committed features
- Priority levels are subject to change based on user feedback and business needs
- All future features should follow the same architectural patterns and code quality standards as existing code
