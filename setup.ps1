# Setup Script for React Conversion Project
# Run this script from the react-conversion directory

Write-Host "🚀 Setting up React Conversion Project..." -ForegroundColor Green
Write-Host ""

# Step 1: Check if public directory exists
if (!(Test-Path "public")) {
    Write-Host "📁 Creating public directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public" -Force | Out-Null
}

# Step 2: Copy assets from Laravel
if (Test-Path "..\public\assets") {
    Write-Host "📦 Copying assets from Laravel project..." -ForegroundColor Yellow
    if (Test-Path "public\assets") {
        Write-Host "   Assets already exist. Skipping copy." -ForegroundColor Gray
    } else {
        Copy-Item -Path "..\public\assets" -Destination "public\assets" -Recurse -Force
        Write-Host "✅ Assets copied successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Warning: Laravel assets not found at ..\public\assets" -ForegroundColor Red
    Write-Host "   Please ensure you're running this from the react-conversion directory" -ForegroundColor Yellow
}

# Step 3: Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Write-Host "   This may take a few minutes..." -ForegroundColor Gray
    npm install
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""

