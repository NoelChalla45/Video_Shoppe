#!/usr/bin/env pwsh
# Video Shoppe - Verification Script
# Tests that all components are working correctly

Write-Host "`n🧪 Video Shoppe System Check" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$allPassed = $true

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓ $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allPassed = $false
}

# Check Frontend dependencies
Write-Host "Checking Frontend dependencies..." -NoNewline
if (Test-Path "Frontend\React\node_modules") {
    Write-Host " ✓ Installed" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing" -ForegroundColor Red
    $allPassed = $false
}

# Check Backend dependencies
Write-Host "Checking Backend dependencies..." -NoNewline
if (Test-Path "Backend\node_modules") {
    Write-Host " ✓ Installed" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing" -ForegroundColor Red
    $allPassed = $false
}

# Check Prisma Client
Write-Host "Checking Prisma Client..." -NoNewline
if (Test-Path "Backend\node_modules\.prisma\client") {
    Write-Host " ✓ Generated" -ForegroundColor Green
} else {
    Write-Host " ✗ Not generated" -ForegroundColor Red
    $allPassed = $false
}

# Check Frontend .env
Write-Host "Checking Frontend config..." -NoNewline
if (Test-Path "Frontend\React\.env") {
    Write-Host " ✓ Configured" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing .env" -ForegroundColor Red
    $allPassed = $false
}

# Check Backend .env
Write-Host "Checking Backend config..." -NoNewline
if (Test-Path "Backend\.env") {
    Write-Host " ✓ Configured" -ForegroundColor Green
} else {
    Write-Host " ✗ Missing .env" -ForegroundColor Red
    $allPassed = $false
}

# Test Backend API health
Write-Host "Testing Backend API..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running on port 5000" -ForegroundColor Green
    }
} catch {
    Write-Host " ⚠ Not running (use 'npm run backend')" -ForegroundColor Yellow
}

# Test Frontend dev server
Write-Host "Testing Frontend server..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓ Running on port 5173" -ForegroundColor Green
    }
} catch {
    Write-Host " ⚠ Not running (use 'npm run frontend')" -ForegroundColor Yellow
}

Write-Host "`n================================" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "✨ All checks passed!" -ForegroundColor Green
    Write-Host "`nReady to use:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
    Write-Host "`nRun 'npm start' to launch both servers" -ForegroundColor Cyan
} else {
    Write-Host "⚠ Some checks failed. Run 'npm run setup' to fix." -ForegroundColor Yellow
}

Write-Host ""
