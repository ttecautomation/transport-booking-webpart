#!/bin/bash
# ====================================================================
# COMPLETE SPFx DEPLOYMENT SCRIPT FOR TRANSPORT BOOKING WEB PART
# ====================================================================

echo "🚀 Starting SPFx Transport Booking Deployment Process..."

# ====================================================================
# STEP 1: ENVIRONMENT VALIDATION
# ====================================================================

echo "📋 Step 1: Validating Environment..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
echo "Node.js version: $NODE_VERSION"

# Validate Node.js version (must be 18.x, 20.x, or 22.x)
if [[ $NODE_VERSION == 18.* ]] || [[ $NODE_VERSION == 20.* ]] || [[ $NODE_VERSION == 22.* ]]; then
    echo "✅ Node.js version is compatible with SPFx"
else
    echo "❌ Node.js version $NODE_VERSION is not supported"
    echo "Required: 18.17.1+ or 20.11.0+ or 22.14.0+"
    echo "Please install a compatible Node.js version and try again"
    exit 1
fi

# Check if SPFx tools are installed
if ! command -v yo &> /dev/null; then
    echo "❌ Yeoman not found. Installing SPFx tools..."
    npm install -g @microsoft/generator-sharepoint yo gulp-cli
else
    echo "✅ SPFx tools are installed"
fi

# ====================================================================
# STEP 2: PROJECT SETUP
# ====================================================================

echo "📁 Step 2: Setting up SPFx project structure..."

# Verify we're in the right directory
if [ ! -f "gulpfile.js" ]; then
    echo "❌ Not in SPFx project directory. Please navigate to your SPFx project folder."
    exit 1
fi

echo "✅ SPFx project directory confirmed"

# ====================================================================
# STEP 3: INSTALL DEPENDENCIES
# ====================================================================

echo "📦 Step 3: Installing dependencies..."

# Clear npm cache
npm cache clean --force

# Install SPFx dependencies
echo "Installing SPFx framework dependencies..."
npm install @microsoft/sp-core-library@1.18.2
npm install @microsoft/sp-webpart-base@1.18.2
npm install @microsoft/sp-property-pane@1.18.2

# Install Material-UI dependencies
echo "Installing Material-UI dependencies..."
npm install @mui/material@^5.14.20
npm install @mui/icons-material@^5.14.19
npm install @emotion/react@^11.11.1
npm install @emotion/styled@^11.11.0

# Install utility dependencies
echo "Installing utility dependencies..."
npm install axios@^1.6.0
npm install dayjs@^1.11.10

# Install TypeScript definitions
echo "Installing TypeScript definitions..."
npm install --save-dev @types/react@17.0.45
npm install --save-dev @types/react-dom@17.0.17

echo "✅ Dependencies installed successfully"

# ====================================================================
# STEP 4: FILE CONVERSION CHECKLIST
# ====================================================================

echo "📝 Step 4: File conversion checklist..."

# Check if required files exist
REQUIRED_FILES=(
    "src/config/environment.ts"
    "src/constants/index.ts"
    "src/themes/muiTheme.ts"
    "src/utils/spfxHelpers.ts"
    "src/utils/dateCalculation.ts"
    "src/services/api.ts"
    "src/services/transportService.ts"
    "src/hooks/useApi.ts"
    "src/components/TransportBooking/TransportBookingForm.tsx"
    "src/webparts/transportBooking/components/TransportBooking.tsx"
    "src/webparts/transportBooking/components/ITransportBookingProps.ts"
    "src/webparts/transportBooking/TransportBookingWebPart.ts"
    "src/webparts/transportBooking/TransportBookingWebPart.manifest.json"
)

echo "Checking required files..."
MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        MISSING_FILES=$((MISSING_FILES + 1))
    else
        echo "✅ Found: $file"
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo "⚠️  $MISSING_FILES files are missing. Please copy the converted files before proceeding."
    echo "Refer to the conversion artifacts provided earlier."
    echo "You can continue with testing, but some features may not work."
fi

# ====================================================================
# STEP 5: GUID GENERATION
# ====================================================================

echo "🔑 Step 5: Generating unique GUIDs..."

# Generate new GUIDs for manifest
SOLUTION_GUID=$(node -p "require('crypto').randomUUID()")
FEATURE_GUID=$(node -p "require('crypto').randomUUID()")
WEBPART_GUID=$(node -p "require('crypto').randomUUID()")

echo "Generated GUIDs:"
echo "Solution GUID: $SOLUTION_GUID"
echo "Feature GUID: $FEATURE_GUID" 
echo "Web Part GUID: $WEBPART_GUID"

echo "⚠️  IMPORTANT: Update these GUIDs in your manifest files:"
echo "1. config/package-solution.json - solution.id and features[0].id"
echo "2. src/webparts/transportBooking/TransportBookingWebPart.manifest.json - id field"

# ====================================================================
# STEP 6: BUILD AND TEST
# ====================================================================

echo "🔨 Step 6: Building and testing..."

# Clean previous builds
echo "Cleaning previous builds..."
gulp clean

# Trust development certificate
echo "Trusting development certificate..."
gulp trust-dev-cert

# Build the project
echo "Building SPFx solution..."
gulp build

# Check build status
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Check the output above for errors."
    echo "Common issues:"
    echo "- TypeScript compilation errors"
    echo "- Missing imports"
    echo "- Invalid file extensions"
    exit 1
fi

# Bundle for development
echo "Creating development bundle..."
gulp bundle

# ====================================================================
# STEP 7: LOCAL TESTING
# ====================================================================

echo "🧪 Step 7: Starting local testing environment..."

# Start development server
echo "Starting development server..."
echo "Server will be available at: https://localhost:4321"
echo "SharePoint workbench URL:"
echo "https://teletechinc.sharepoint.com/_layouts/workbench.aspx?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/build/manifests.js"
echo ""
echo "Local workbench URL:"  
echo "https://localhost:4321/temp/workbench.html"
echo ""
echo "Press Ctrl+C to stop the development server"

# This will start the server (user needs to test manually)
gulp serve --nobrowser

# ====================================================================
# STEP 8: PRODUCTION BUILD (Run after testing)
# ====================================================================

echo "🏭 Step 8: Creating production build..."

# Clean everything
gulp clean

# Build for production
echo "Building for production..."
gulp build --ship

# Bundle for production  
echo "Creating production bundle..."
gulp bundle --ship

# Create SharePoint package
echo "Creating SharePoint package..."
gulp package-solution --ship

# Check if package was created
if [ -f "sharepoint/solution/transport-booking-webpart.sppkg" ]; then
    echo "✅ SharePoint package created successfully!"
    echo "📦 Package location: sharepoint/solution/transport-booking-webpart.sppkg"
else
    echo "❌ Failed to create SharePoint package"
    exit 1
fi

echo "🎉 SPFx build process completed successfully!"

# ====================================================================
# STEP 9: DEPLOYMENT INSTRUCTIONS
# ====================================================================

cat << 'EOF'

🚀 DEPLOYMENT INSTRUCTIONS:

1. UPLOAD TO APP CATALOG:
   - Navigate to SharePoint Admin Center
   - Go to More features > Apps > App Catalog  
   - Upload: sharepoint/solution/transport-booking-webpart.sppkg
   - Check "Make this solution available to all sites"
   - Click Deploy

2. INSTALL ON SITE:
   - Go to your target SharePoint site
   - Site Contents > New > App
   - Find "Transport Booking" and click Add

3. ADD TO PAGE:
   - Edit any page on your site
   - Click + to add web part
   - Search for "Transport Booking"
   - Add to page and configure properties

4. CONFIGURE WEB PART:
   - Set API Endpoint to your Azure Web Service URL
   - Choose default site (optional)
   - Configure debug mode (off for production)
   - Save the page

5. TEST FUNCTIONALITY:
   - Verify user information loads
   - Test site selection and shift loading
   - Complete a test booking submission
   - Check email confirmations

📞 SUPPORT:
If you encounter issues:
1. Check browser console for errors (F12)
2. Verify API connectivity to your Azure Web Service  
3. Ensure CORS is configured for SharePoint domain
4. Contact IT support with specific error messages

🔧 TROUBLESHOOTING:
- Web part not visible: Check GUIDs in manifest files
- API errors: Verify Azure Web Service is running
- User context issues: Check SharePoint permissions
- Build errors: Review TypeScript compilation output

EOF

echo "📋 Deployment process documentation completed!"
echo "Your Transport Booking SPFx web part is ready for SharePoint deployment! 🎯"