// Mock data for demonstration purposes

// Product data
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  sales: number
  category: string
  createdAt: Date
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Premium Headphones',
    description:
      'Wireless noise-cancelling headphones with exceptional sound quality.',
    price: 299.99,
    stock: 45,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 128,
    category: 'Electronics',
    createdAt: new Date(2023, 5, 12)
  },
  {
    id: 'p2',
    name: 'Smart Watch',
    description: 'Health and fitness tracking with smart notifications.',
    price: 199.99,
    stock: 32,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 97,
    category: 'Electronics',
    createdAt: new Date(2023, 6, 23)
  },
  {
    id: 'p3',
    name: 'Laptop Backpack',
    description:
      'Water-resistant backpack with multiple compartments and USB charging port.',
    price: 79.99,
    stock: 58,
    image:
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 83,
    category: 'Accessories',
    createdAt: new Date(2023, 7, 4)
  },
  {
    id: 'p4',
    name: 'Wireless Keyboard',
    description: 'Ergonomic keyboard with customizable RGB lighting.',
    price: 129.99,
    stock: 21,
    image:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 65,
    category: 'Electronics',
    createdAt: new Date(2023, 8, 15)
  },
  {
    id: 'p5',
    name: 'Phone Stand',
    description: 'Adjustable aluminum stand for smartphones and tablets.',
    price: 24.99,
    stock: 76,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 52,
    category: 'Accessories',
    createdAt: new Date(2023, 9, 26)
  },
  {
    id: 'p6',
    name: 'Wireless Earbuds',
    description:
      'True wireless earbuds with long battery life and water resistance.',
    price: 149.99,
    stock: 38,
    image:
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 114,
    category: 'Electronics',
    createdAt: new Date(2023, 10, 7)
  },
  {
    id: 'p7',
    name: 'Desk Lamp',
    description:
      'Modern LED desk lamp with adjustable brightness and color temperature.',
    price: 49.99,
    stock: 64,
    image:
      'https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 41,
    category: 'Home',
    createdAt: new Date(2023, 11, 18)
  },
  {
    id: 'p8',
    name: 'Portable SSD',
    description: 'Fast and compact external solid-state drive.',
    price: 179.99,
    stock: 27,
    image:
      'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sales: 77,
    category: 'Electronics',
    createdAt: new Date(2024, 0, 29)
  }
]

// Blog post data
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: Date
}

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'Top 5 Tech Gadgets to Enhance Your Productivity',
    excerpt:
      'Discover the latest technology that can boost your workplace efficiency.',
    content:
      "In today's fast-paced world, staying productive is more important than ever. The right tech gadgets can make a significant difference in your daily efficiency. From smart notebooks to AI-powered assistants, we've compiled a list of the top 5 tech innovations that can help you stay on top of your game.\n\nFirst up is the Smart Pen, a revolutionary tool that digitizes your handwritten notes in real-time. Next, we have the Portable Monitor, perfect for extending your workspace on the go. The third item, Noise-Cancelling Earbuds, helps you stay focused in noisy environments. The fourth gadget, a Wireless Charging Desk Mat, keeps your devices powered without cable clutter. Finally, the Smart Task Manager uses AI to help prioritize your daily activities effectively.",
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    author: 'Alex Johnson',
    publishedAt: new Date(2023, 11, 5)
  },
  {
    id: 'b2',
    title: 'The Future of E-Commerce: Trends to Watch',
    excerpt:
      'Explore emerging patterns in online retail and what they mean for consumers and businesses.',
    content:
      'E-commerce continues to evolve at a rapid pace, transforming how we shop and interact with brands. Several key trends are shaping the future of online retail, creating new opportunities and challenges for businesses and consumers alike.\n\nPersonalization is becoming increasingly sophisticated, with AI algorithms offering tailored shopping experiences based on individual preferences and behaviors. Augmented reality is revolutionizing online shopping by allowing customers to visualize products in their own spaces before purchase. Voice commerce is gaining traction as smart speakers become more prevalent in homes. Sustainability is now a major focus, with eco-friendly practices becoming essential for brand reputation. Finally, social commerce is blurring the lines between social media and shopping, creating seamless purchasing experiences within social platforms.',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    author: 'Maya Patel',
    publishedAt: new Date(2023, 10, 18)
  },
  {
    id: 'b3',
    title: 'Creating a Seamless Customer Experience',
    excerpt:
      'Strategies for ensuring customer satisfaction across all touchpoints.',
    content:
      "In today's competitive marketplace, providing a seamless customer experience across all channels is crucial for business success. A consistent and positive customer journey can significantly impact brand loyalty and customer retention.\n\nThe first step in creating a seamless experience is mapping the customer journey to identify all touchpoints. Next, ensure consistent branding and messaging across all platforms to reinforce brand identity. Implement omnichannel support systems that allow customers to transition between channels effortlessly. Gather and analyze customer feedback regularly to identify pain points and areas for improvement. Finally, invest in employee training to ensure staff can provide excellent service at every interaction. By focusing on these elements, businesses can create memorable experiences that keep customers coming back.",
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    author: 'Carlos Mendez',
    publishedAt: new Date(2023, 9, 30)
  },
  {
    id: 'b4',
    title: 'Choosing the Right Payment Solutions for Your Online Store',
    excerpt:
      'A guide to selecting payment processors that meet your business needs.',
    content:
      "Selecting the appropriate payment solutions for your e-commerce business is a crucial decision that can significantly impact your sales and customer satisfaction. With numerous options available, it's important to evaluate which payment processors best align with your specific business requirements.\n\nWhen choosing payment solutions, consider factors such as transaction fees, security features, and supported payment methods. Ensure the processor offers strong fraud protection to safeguard both your business and customers. International businesses should prioritize multi-currency support and global payment options. Mobile payment compatibility is increasingly important as more consumers shop on smartphones. Additionally, evaluate the checkout experience from the customer's perspective to ensure it's smooth and intuitive. By carefully considering these factors, you can implement payment solutions that enhance the shopping experience while protecting your bottom line.",
    image:
      'https://images.unsplash.com/photo-1556740772-1a741367b93e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    author: 'Sarah Kim',
    publishedAt: new Date(2023, 8, 12)
  },
  {
    id: 'b5',
    title: 'Sustainable Packaging Solutions for E-Commerce',
    excerpt:
      "Eco-friendly packaging options that don't compromise product protection.",
    content:
      "As environmental concerns grow, implementing sustainable packaging solutions has become an essential consideration for e-commerce businesses. Eco-conscious consumers increasingly factor a company's environmental practices into their purchasing decisions, making sustainable packaging not just an ethical choice but a business advantage.\n\nThere are numerous eco-friendly packaging alternatives that provide excellent product protection while minimizing environmental impact. Biodegradable materials like cornstarch-based packing peanuts offer protection comparable to traditional polystyrene. Recycled cardboard and paper materials can be used for boxes and void fill. Plant-based plastics derived from resources like sugarcane provide sustainable alternatives to petroleum-based plastics. Right-sizing packages to minimize wasted space not only reduces material use but can also lower shipping costs. Finally, clearly communicating recycling instructions on packaging helps ensure materials are properly disposed of and recycled. By implementing these solutions, businesses can reduce their environmental footprint while meeting consumer expectations.",
    image:
      'https://images.unsplash.com/photo-1612965110667-4175024b0fe2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    author: 'Thomas Green',
    publishedAt: new Date(2023, 7, 25)
  }
]

// Invoice data
export interface InvoiceItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Invoice {
  id: string
  customerName: string
  customerEmail: string
  items: InvoiceItem[]
  total: number
  status: 'paid' | 'pending' | 'overdue'
  createdAt: Date
  dueDate: Date
}

export const invoices: Invoice[] = [
  {
    id: 'INV-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    items: [
      {
        id: 'item1',
        productId: 'p1',
        productName: 'Premium Headphones',
        quantity: 1,
        price: 299.99
      },
      {
        id: 'item2',
        productId: 'p5',
        productName: 'Phone Stand',
        quantity: 2,
        price: 24.99
      }
    ],
    total: 349.97,
    status: 'paid',
    createdAt: new Date(2023, 11, 10),
    dueDate: new Date(2023, 11, 25)
  },
  {
    id: 'INV-002',
    customerName: 'Emily Johnson',
    customerEmail: 'emily.johnson@example.com',
    items: [
      {
        id: 'item3',
        productId: 'p2',
        productName: 'Smart Watch',
        quantity: 1,
        price: 199.99
      }
    ],
    total: 199.99,
    status: 'pending',
    createdAt: new Date(2023, 11, 15),
    dueDate: new Date(2023, 11, 30)
  },
  {
    id: 'INV-003',
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@example.com',
    items: [
      {
        id: 'item4',
        productId: 'p4',
        productName: 'Wireless Keyboard',
        quantity: 1,
        price: 129.99
      },
      {
        id: 'item5',
        productId: 'p6',
        productName: 'Wireless Earbuds',
        quantity: 1,
        price: 149.99
      },
      {
        id: 'item6',
        productId: 'p7',
        productName: 'Desk Lamp',
        quantity: 1,
        price: 49.99
      }
    ],
    total: 329.97,
    status: 'overdue',
    createdAt: new Date(2023, 10, 28),
    dueDate: new Date(2023, 11, 12)
  },
  {
    id: 'INV-004',
    customerName: 'Sophia Martinez',
    customerEmail: 'sophia.martinez@example.com',
    items: [
      {
        id: 'item7',
        productId: 'p3',
        productName: 'Laptop Backpack',
        quantity: 1,
        price: 79.99
      }
    ],
    total: 79.99,
    status: 'paid',
    createdAt: new Date(2023, 11, 5),
    dueDate: new Date(2023, 11, 20)
  },
  {
    id: 'INV-005',
    customerName: 'William Garcia',
    customerEmail: 'william.garcia@example.com',
    items: [
      {
        id: 'item8',
        productId: 'p8',
        productName: 'Portable SSD',
        quantity: 1,
        price: 179.99
      },
      {
        id: 'item9',
        productId: 'p1',
        productName: 'Premium Headphones',
        quantity: 1,
        price: 299.99
      }
    ],
    total: 479.98,
    status: 'pending',
    createdAt: new Date(2023, 11, 18),
    dueDate: new Date(2024, 0, 2)
  },
  {
    id: 'INV-006',
    customerName: 'Olivia Wilson',
    customerEmail: 'olivia.wilson@example.com',
    items: [
      {
        id: 'item10',
        productId: 'p2',
        productName: 'Smart Watch',
        quantity: 2,
        price: 199.99
      },
      {
        id: 'item11',
        productId: 'p5',
        productName: 'Phone Stand',
        quantity: 1,
        price: 24.99
      }
    ],
    total: 424.97,
    status: 'paid',
    createdAt: new Date(2023, 11, 7),
    dueDate: new Date(2023, 11, 22)
  },
  {
    id: 'INV-007',
    customerName: 'James Lee',
    customerEmail: 'james.lee@example.com',
    items: [
      {
        id: 'item12',
        productId: 'p6',
        productName: 'Wireless Earbuds',
        quantity: 1,
        price: 149.99
      }
    ],
    total: 149.99,
    status: 'pending',
    createdAt: new Date(2023, 11, 20),
    dueDate: new Date(2024, 0, 4)
  }
]

// Dashboard statistics
export const dashboardStats = {
  invoices: {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === 'paid').length,
    pending: invoices.filter((inv) => inv.status === 'pending').length,
    overdue: invoices.filter((inv) => inv.status === 'overdue').length
  },
  revenue: {
    total: invoices.reduce((sum, inv) => sum + inv.total, 0),
    currentMonth: invoices
      .filter((inv) => {
        const now = new Date()
        return (
          inv.createdAt.getMonth() === now.getMonth() &&
          inv.createdAt.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, inv) => sum + inv.total, 0)
  },
  popularProducts: [...products].sort((a, b) => b.sales - a.sales).slice(0, 5)
}
