# ⚡ Quick Run Guide

## 🚀 **Fastest Way to Run the Project**

### **1. Install Dependencies** (First time only)
```powershell
cd react-conversion
npm install
```

### **2. Copy Assets** (First time only)
```powershell
# From template root directory (F:\template\template)
Copy-Item -Path "public\assets" -Destination "react-conversion\public\assets" -Recurse -Force
```

### **3. Start the Server**
```powershell
cd react-conversion
npm run dev
```

### **4. Open Browser**
Navigate to: **http://localhost:3000**

---

## ✅ **What You Should See**

1. **Homepage loads** with the exact same design as Laravel
2. **All images display** correctly
3. **Navigation works** - click header/footer links
4. **No console errors** (press F12 to check)

---

## 🔍 **Testing Checklist**

- [ ] Homepage (`/`) - Should match Laravel design exactly
- [ ] Navigation - Header and footer links work
- [ ] Routes - Try `/about-us`, `/contact-us`, `/login`
- [ ] Doctor pages - `/doctor/dashboard` (if logged in)
- [ ] Responsive - Resize browser to test mobile view

---

## ⚠️ **If Something Doesn't Work**

1. **Check browser console** (F12) for errors
2. **Verify assets copied** - Check `react-conversion/public/assets/` exists
3. **Reinstall dependencies** - Run `npm install` again
4. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)

---

## 📝 **Quick Commands**

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

**That's it! The project should be running now.** 🎉

