# Transport Booking WebPart

## What is this application for?

The **Transport Booking WebPart** is a comprehensive **SharePoint Framework (SPFx)** solution designed for **TTEC Holdings** to streamline employee transportation booking and management. This enterprise-grade web part provides employees with an intuitive interface to book corporate transport services across multiple TTEC office locations.

## 🚌 Application Overview

This application serves as a centralized transport booking system that enables TTEC employees to:

- **Book office transport** for daily commute (pickup and drop-off services)
- **Manage weekly and monthly** transport schedules
- **Select preferred pickup/drop stations** based on location
- **Choose shift timings** and transport preferences
- **Track booking history** and preferences
- **Receive automated confirmations** via email

## 🎯 Key Features

### 📋 **Multi-Step Booking Process**
- **Step 1**: Basic Information (Site selection, booking period)
- **Step 2**: Shift & Schedule (Work shifts, weekly offs)
- **Step 3**: Transport Preferences (Pickup only, Drop-off only, or Both)
- **Step 4**: Pickup & Drop Stations (Location selection with distance slabs)
- **Step 5**: Contact & Agreement (Contact details and policy acceptance)

### 🏢 **Multi-Location Support**
- **Ahmedabad Office** (Site ID: 11, Code: AMD)
  - Complementary hours: 9:00 PM - 6:00 AM
  - Timezone: Asia/Kolkata
- **Mohali Office** (Site ID: 14, Code: MHL)
  - Complementary hours: 7:00 PM - 7:00 AM
  - Timezone: Asia/Kolkata

### 📅 **Flexible Booking Periods**
- **Current Month**: Book transport for ongoing month (2 weekly offs required)
- **Upcoming Month**: Pre-book for next month (2 weekly offs required)
- **Current Week**: Book for current working week (up to 6 weekly offs)
- **Upcoming Week**: Book for next working week (up to 6 weekly offs)

### 🚏 **Smart Station Management**
- Distance-based station categorization (0-5km, 6-10km, 11-20km, 21-30km, 30km+)
- Real-time station availability based on selected site
- GPS coordinates for accurate location mapping

### 👤 **User Management**
- Automatic user detection via SharePoint context
- Employee information lookup (Oracle ID, email, mobile, location)
- Personalized booking history and preferences
- Role-based access control

## 🛠 Technical Architecture

### **Frontend Stack**
- **React 17.0.1** - Component-based UI framework
- **Material-UI 5.14.20** - Modern design system and components
- **TypeScript 4.7.4** - Type-safe development
- **SharePoint Framework 1.18.2** - SPFx integration

### **Backend Integration**
- **RESTful APIs** for all transport operations
- **Axios 1.6.0** - HTTP client with interceptors
- **SharePoint HTTP Client** - Native SPFx API integration
- **Real-time validation** and error handling

### **Key Services**
- **Transport Service**: Main booking operations and API calls
- **API Service**: Centralized HTTP client with SharePoint context
- **Date Calculation**: Booking period and schedule management
- **User Service**: Employee lookup and preferences

## 🚀 Getting Started

### **Prerequisites**
- Node.js >= 16.13.0 < 17.0.0
- SharePoint Online environment
- TTEC corporate network access

### **Installation**
```bash
# Install dependencies
npm install

# Build the solution
npm run build

# Serve locally (development)
npm run serve

# Clean build artifacts
npm run clean
```

### **Deployment**
```bash
# Build for production
gulp bundle --ship

# Package solution
gulp package-solution --ship

# Deploy to SharePoint App Catalog
# Upload: solution/transport-booking.sppkg
```

## 📊 Features in Detail

### **Booking Management**
- Real-time availability checking
- Conflict detection and prevention
- Automatic email notifications
- Booking history tracking
- Preference management

### **Form Validation**
- Required field validation
- Email format validation
- Phone number validation
- Date range validation
- Policy agreement verification

### **User Experience**
- **Progressive Form**: Step-by-step guided process
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme detection
- **Loading States**: Real-time feedback during operations
- **Error Handling**: User-friendly error messages
- **Debug Mode**: Developer tools for troubleshooting

### **Integration Features**
- **SharePoint Context**: Seamless integration with SP environment
- **Microsoft Teams**: Teams-aware functionality
- **Active Directory**: User authentication and authorization
- **Email Services**: Automated booking confirmations

## 🔧 Configuration

### **Web Part Properties**
- `apiEndpoint`: Backend API base URL
- `defaultSite`: Default office location
- `enableDebugMode`: Developer debugging tools
- `showUserInfo`: Display user information
- `enableNotifications`: Email notification settings
- `maxRetryAttempts`: API retry configuration
- `requestTimeout`: Request timeout settings

### **Environment Configuration**
The application automatically detects the environment and configures:
- API endpoints
- Timeout settings
- Retry mechanisms
- Logging levels
- Debug features

## 🎨 UI Components

### **Material-UI Integration**
- **Stepper**: Multi-step form navigation
- **Cards**: Information grouping
- **Autocomplete**: Station and employee selection
- **Date Pickers**: Schedule selection
- **Radio Groups**: Transport preferences
- **Checkboxes**: Weekly offs and agreements
- **Progress Indicators**: Loading states
- **Snackbars**: Success/error notifications

### **Custom Components**
- **TransportBookingForm**: Main booking interface
- **ApiDebugger**: Development debugging tools
- **UserInfoCard**: Employee information display
- **StationSelector**: Location picker with distance info
- **ScheduleCalendar**: Visual schedule management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with all options
- **Tablet**: Optimized touch interface
- **Mobile**: Streamlined mobile experience
- **Teams**: Integrated Teams app experience

## 🔐 Security Features

- **SharePoint Authentication**: Built-in security model
- **Input Validation**: XSS and injection prevention
- **CSRF Protection**: Cross-site request forgery protection
- **API Security**: Secured endpoints with authentication
- **Data Encryption**: Secure data transmission
- **Audit Trail**: Complete booking activity logging

## 🤝 Support & Maintenance

### **Developer Information**
- **Organization**: TTEC Holdings
- **Website**: https://www.ttec.com
- **Version**: 1.0.0
- **Last Updated**: September 2025

### **Getting Help**
For technical support or feature requests, please contact the TTEC IT team or refer to the SharePoint transport policy documentation.

---

*This application is part of TTEC's digital transformation initiative to improve employee experience and operational efficiency.*

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.21.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| folder name | Author details (name, company, twitter alias with link) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
