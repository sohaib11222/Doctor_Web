# Verification Script for React Project Setup
# Run this to verify everything is set up correctly

Write-Host "`n🔍 Verifying React Project Setup...`n" -ForegroundColor Cyan

$allGood = $true

# Check Assets
Write-Host "Checking Assets..." -ForegroundColor Yellow
if (Test-Path "public\assets") {
    Write-Host "  ✅ Assets directory exists" -ForegroundColor Green
    
    if (Test-Path "public\assets\css\custom.css") {
        Write-Host "  ✅ CSS files found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ CSS files missing" -ForegroundColor Red
        $allGood = $false
    }
    
    if (Test-Path "public\assets\js\jquery-3.7.1.min.js") {
        Write-Host "  ✅ JavaScript files found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ JavaScript files missing" -ForegroundColor Red
        $allGood = $false
    }
    
    if (Test-Path "public\assets\img") {
        Write-Host "  ✅ Images directory found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Images directory missing" -ForegroundColor Red
        $allGood = $false
    }
    
    if (Test-Path "public\assets\plugins") {
        Write-Host "  ✅ Plugins directory found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Plugins directory missing" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  ❌ Assets directory missing!" -ForegroundColor Red
    Write-Host "     Run: Copy-Item -Path `"..\public\assets`" -Destination `"public\assets`" -Recurse -Force" -ForegroundColor Yellow
    $allGood = $false
}

# Check Dependencies
Write-Host "`nChecking Dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✅ node_modules exists" -ForegroundColor Green
    
    if (Test-Path "node_modules\react") {
        Write-Host "  ✅ React installed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ React not found" -ForegroundColor Red
        $allGood = $false
    }
    
    if (Test-Path "node_modules\react-router-dom") {
        Write-Host "  ✅ React Router installed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ React Router not found" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  ❌ node_modules missing!" -ForegroundColor Red
    Write-Host "     Run: npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check Source Files
Write-Host "`nChecking Source Files..." -ForegroundColor Yellow
if (Test-Path "src\App.jsx") {
    Write-Host "  ✅ App.jsx exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ App.jsx missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "src\main.jsx") {
    Write-Host "  ✅ main.jsx exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ main.jsx missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "index.html") {
    Write-Host "  ✅ index.html exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ index.html missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "vite.config.js") {
    Write-Host "  ✅ vite.config.js exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ vite.config.js missing" -ForegroundColor Red
    $allGood = $false
}

# Check Package.json
Write-Host "`nChecking Configuration..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "  ✅ package.json exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ package.json missing" -ForegroundColor Red
    $allGood = $false
}

# Final Result
Write-Host "`n" + "="*50 -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ All checks passed! Project is ready to run." -ForegroundColor Green
    Write-Host "`n🚀 Start the server with: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Some checks failed. Please fix the issues above." -ForegroundColor Red
    Write-Host "`nTip: Run the setup script: .\setup.ps1" -ForegroundColor Yellow
}
Write-Host "="*50 + "`n" -ForegroundColor Cyan

