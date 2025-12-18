# 🚀 How to Run the React Project

## Step-by-Step Instructions

### **Step 1: Install Dependencies**

First, navigate to the react-conversion directory and install all required packages:

```bash
cd react-conversion
npm install
```

This will install all dependencies listed in `package.json` including React, React Router, Axios, Bootstrap, etc.

**Expected time:** 2-5 minutes depending on your internet speed.

---

### **Step 2: Copy Assets from Laravel**

**IMPORTANT:** You need to copy all assets from the Laravel project to the React project for the design to work correctly.

#### Option A: Manual Copy (Windows)
```powershell
# From the template root directory
xcopy /E /I /Y public\assets react-conversion\public\assets
```

#### Option B: Manual Copy (PowerShell)
```powershell
# From the template root directory
Copy-Item -Path "public\assets" -Destination "react-conversion\public\assets" -Recurse -Force
```

#### Option C: Create Symbolic Link (Recommended for Development)
```powershell
# From react-conversion directory
New-Item -ItemType SymbolicLink -Path "public\assets" -Target "..\public\assets"
```

**What gets copied:**
- `/public/assets/css/` - All CSS files
- `/public/assets/js/` - All JavaScript files
- `/public/assets/img/` - All images
- `/public/assets/fonts/` - All fonts
- `/public/assets/plugins/` - All plugin files

---

### **Step 3: Create Environment File (Optional)**

Create a `.env` file in the `react-conversion` directory if you want to configure the API URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Note:** This is optional. The app will work without it, but API calls won't work until you set up the Laravel backend.

---

### **Step 4: Start the Development Server**

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

The app will automatically open in your browser at `http://localhost:3000`

---

### **Step 5: Test the Conversion**

#### ✅ **What to Check:**

1. **Homepage** (`http://localhost:3000/`)
   - Should show the exact same design as Laravel
   - All images should load
   - Navigation should work
   - All sections should be visible

2. **Navigation**
   - Click on header links
   - Check footer links
   - Test mobile menu (if applicable)

3. **Routes**
   - Try accessing different routes:
     - `/about-us`
     - `/contact-us`
     - `/login`
     - `/register`
     - `/doctor/dashboard` (will redirect to login if not authenticated)

4. **Doctor Pages** (if logged in as doctor)
   - `/doctor/dashboard`
   - `/appointments`
   - `/doctor-appointments-grid`
   - `/doctor-upcoming-appointment`
   - `/available-timings`

5. **Design Consistency**
   - Compare with original Laravel template
   - Check responsive design (resize browser)
   - Verify all CSS classes are applied correctly

---

### **Common Issues & Solutions**

#### ❌ **Issue 1: Assets Not Loading (404 errors)**

**Problem:** Images, CSS, or JS files not found

**Solution:**
```powershell
# Make sure assets are copied
cd react-conversion
if (!(Test-Path public\assets)) {
    Copy-Item -Path "..\public\assets" -Destination "public\assets" -Recurse -Force
}
```

#### ❌ **Issue 2: Module Not Found Errors**

**Problem:** Missing dependencies

**Solution:**
```bash
cd react-conversion
npm install
```

#### ❌ **Issue 3: Port 3000 Already in Use**

**Problem:** Another app is using port 3000

**Solution:**
- Change port in `vite.config.js`:
  ```js
  server: {
    port: 3001, // Change to any available port
  }
  ```
- Or kill the process using port 3000

#### ❌ **Issue 4: Blank Page / White Screen**

**Possible causes:**
1. **Check browser console** (F12) for errors
2. **Verify assets are copied** - Check Network tab for 404s
3. **Check React DevTools** - Install React DevTools browser extension
4. **Verify routes** - Make sure routes are properly defined in `App.jsx`

#### ❌ **Issue 5: jQuery/Plugin Errors**

**Problem:** Some plugins require jQuery

**Solution:** jQuery is already included in `index.html`. If you see errors, check:
- jQuery is loaded before plugins
- Plugin scripts are in correct order
- Check browser console for specific errors

---

### **Quick Test Checklist**

- [ ] Dependencies installed (`npm install` completed)
- [ ] Assets copied to `react-conversion/public/assets/`
- [ ] Development server running (`npm run dev`)
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Images display properly
- [ ] CSS styles applied
- [ ] No console errors (check F12)
- [ ] Routes navigate correctly
- [ ] Responsive design works

---

### **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

### **Testing Specific Pages**

#### **Public Pages:**
- Homepage: `http://localhost:3000/`
- About Us: `http://localhost:3000/about-us`
- Contact: `http://localhost:3000/contact-us`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`

#### **Doctor Pages** (Requires authentication):
- Dashboard: `http://localhost:3000/doctor/dashboard`
- Appointments: `http://localhost:3000/appointments`
- Profile: `http://localhost:3000/doctor-profile`
- Available Timings: `http://localhost:3000/available-timings`

#### **Patient Pages** (Requires authentication):
- Dashboard: `http://localhost:3000/patient/dashboard`

---

### **Browser Console Commands**

Open browser console (F12) and check:

```javascript
// Check if React is loaded
console.log(React.version)

// Check current route
console.log(window.location.pathname)

// Check if assets are loading
// Go to Network tab and filter by "assets"
```

---

### **Next Steps After Running**

1. **Test all converted pages** - Navigate through all doctor/patient pages
2. **Check responsive design** - Test on different screen sizes
3. **Verify functionality** - Test forms, buttons, modals
4. **Compare with Laravel** - Side-by-side comparison
5. **Report issues** - Note any design differences or errors

---

### **Need Help?**

If you encounter issues:
1. Check browser console (F12) for errors
2. Check terminal for build errors
3. Verify all assets are copied
4. Ensure dependencies are installed
5. Check that routes are properly defined in `App.jsx`

---

## 🎯 **Quick Start (TL;DR)**

```bash
# 1. Install dependencies
cd react-conversion
npm install

# 2. Copy assets (from template root)
Copy-Item -Path "public\assets" -Destination "react-conversion\public\assets" -Recurse -Force

# 3. Run the project
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

That's it! The app should now be running. 🚀

