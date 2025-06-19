# Green Nepal - Rotary Club of Kasthamandap Initiative

A comprehensive web platform for environmental conservation and tree planting initiatives in Nepal, powered by the Rotary Club of Kasthamandap.

## 🌱 Project Overview

Green Nepal is a digital platform that enables individuals and organizations to contribute to Nepal's reforestation efforts through secure online donations. The platform provides real-time tracking of tree planting activities, environmental impact metrics, and community engagement features.

## 🎯 Key Features

### User Features
- **Secure Registration & Authentication**: User accounts with profile management
- **eSewa Payment Integration**: Secure donations through Nepal's leading payment gateway
- **Real-time Dashboard**: Personal donation history, tree tracking, and impact metrics
- **Interactive Map**: Live tracking of planting sites with detailed information
- **Community Leaderboards**: Recognition for top contributors and organizations
- **Mobile Responsive Design**: Optimized for all devices

### Admin Features
- **Main Admin Dashboard**: Complete platform oversight and management
- **Site-specific Admin Panels**: Location-based management for planting sites
- **Real-time Notifications**: Instant updates on donations and activities
- **Comprehensive Reporting**: Detailed analytics and impact reports
- **User Management**: Role-based access control and permissions

### Technical Features
- **Real-time Data Synchronization**: Live updates across all platform components
- **Supabase Backend**: Robust database with Row Level Security (RLS)
- **TypeScript Implementation**: Type-safe development with enhanced reliability
- **Progressive Web App**: Offline capabilities and app-like experience

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **React Leaflet** for interactive maps

### Backend
- **Supabase** (PostgreSQL database)
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless operations

### Payment Integration
- **eSewa Payment Gateway** for secure transactions
- **Real-time payment verification**
- **Transaction tracking and reporting**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- eSewa merchant account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/green-nepal.git
   cd green-nepal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ESEWA_MERCHANT_CODE=your_esewa_merchant_code
   VITE_ESEWA_SUCCESS_URL=your_success_url
   VITE_ESEWA_FAILURE_URL=your_failure_url
   ```

4. **Database Setup**
   Run the migration file in your Supabase SQL editor:
   ```sql
   -- Execute the contents of supabase/migrations/create_green_nepal_schema.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables
- **profiles**: User information and Rotary membership details
- **planting_sites**: Tree planting locations with geographic data
- **donations**: Donation records with payment tracking
- **trees**: Individual tree records with growth tracking
- **impact_metrics**: Environmental impact calculations
- **site_updates**: Progress updates from planting sites

### Security Features
- Row Level Security (RLS) enabled on all tables
- Role-based access control (donor, site_admin, main_admin)
- Secure authentication with Supabase Auth

## 💳 eSewa Integration

### Payment Flow
1. User selects trees and planting site
2. Donation record created with 'pending' status
3. Redirect to eSewa payment gateway
4. Payment verification and status update
5. Tree records created upon successful payment
6. Real-time updates to site statistics

### Configuration
```javascript
const esewaConfig = {
  merchantCode: 'YOUR_MERCHANT_CODE',
  successUrl: '/payment/success',
  failureUrl: '/payment/failure',
  environment: 'production' // or 'test'
};
```

## 🗺 Interactive Map Features

- **Real-time Site Markers**: Live updates of planting locations
- **Site Information Popups**: Detailed site data and progress
- **Donor Recognition**: List of contributors per site
- **Progress Visualization**: Visual representation of planting goals
- **Mobile Optimization**: Touch-friendly map interactions

## 👥 User Roles & Permissions

### Donor (Default)
- Make donations and track personal impact
- View public leaderboards and site information
- Access personal dashboard and donation history

### Site Admin
- Manage specific planting sites
- Post updates and progress reports
- View site-specific donation data
- Upload photos and maintenance logs

### Main Admin
- Full platform access and management
- User role management and permissions
- Comprehensive reporting and analytics
- System configuration and settings

## 📈 Analytics & Reporting

### Real-time Metrics
- Total trees planted across all sites
- Active donor count and contribution amounts
- Environmental impact calculations (CO₂, water, biodiversity)
- Site-specific progress tracking

### Impact Calculations
- **CO₂ Absorption**: 22kg per tree per year
- **Oxygen Production**: 16kg per tree per year
- **Water Filtration**: 120 liters per tree per year
- **Soil Improvement**: 4 square meters per tree

## 🌍 Environmental Impact

Our platform tracks and displays real environmental benefits:
- Carbon dioxide absorption and storage
- Oxygen production for cleaner air
- Water filtration and conservation
- Soil improvement and erosion prevention
- Biodiversity support and habitat creation

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Ensure accessibility compliance
- Write comprehensive tests for new features
- Document all API changes and database modifications

## 📞 Support & Contact

### Project Leadership
- **Sanjay Dudhaniya** - Project Head & Concept Lead
- **Rishav Shah** - Technical Head

### Rotary Club of Kasthamandap
- **Email**: info@rotarykasthamandap.org
- **Phone**: +977-1-XXXXXXX
- **Address**: Kasthamandap, Kathmandu, Nepal

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Rotary Club of Kasthamandap for environmental leadership
- eSewa for secure payment processing
- Supabase for robust backend infrastructure
- All contributors and environmental advocates

---

**Green Nepal** - *Service Above Self through Environmental Stewardship*

*Making Nepal greener, one tree at a time.*