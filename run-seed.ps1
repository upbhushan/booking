# Seed script to set up the booking system
# Run this from PowerShell after deploying backend

$baseUrl = "https://booking-6.onrender.com"
$adminEmail = "admin@example.com"
$adminPassword = "Passw0rd!"
$adminName = "Admin User"
$adminKey = "adminkey123" # Replace with your actual key from Render env vars

# Step 1: Register admin
Write-Host "Registering admin user..." -ForegroundColor Cyan
$registerData = @{
    name = $adminName
    email = $adminEmail
    password = $adminPassword
    role = "ADMIN"
    adminKey = $adminKey
} | ConvertTo-Json

$registerResult = Invoke-RestMethod -Uri "$baseUrl/api/register" -Method Post -ContentType "application/json" -Body $registerData -ErrorAction SilentlyContinue
if ($registerResult) {
    Write-Host "Admin registered successfully" -ForegroundColor Green
} else {
    Write-Host "Admin may already exist, continuing to login..." -ForegroundColor Yellow
}

# Step 2: Login to get token
Write-Host "Logging in..." -ForegroundColor Cyan
$loginData = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

$loginResult = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -ContentType "application/json" -Body $loginData
$token = $loginResult.token
Write-Host "Login successful, got token" -ForegroundColor Green

# Step 3: Run seed
Write-Host "Running seed..." -ForegroundColor Cyan
$seedData = @{
    adminSeedKey = $adminKey
} | ConvertTo-Json

$seedResult = Invoke-RestMethod -Uri "$baseUrl/admin/seed" -Method Post -ContentType "application/json" -Headers @{Authorization = "Bearer $token"} -Body $seedData
Write-Host "Seed completed successfully!" -ForegroundColor Green

# Step 4: Verify slots
Write-Host "Checking slots..." -ForegroundColor Cyan
$slots = Invoke-RestMethod -Uri "$baseUrl/api/slots" -Method Get -Headers @{Authorization = "Bearer $token"}
Write-Host "Found $($slots.Length) slots" -ForegroundColor Green

Write-Host ""
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "You can now update your frontend environment variable:" -ForegroundColor Yellow
Write-Host "VITE_API_URL=$baseUrl/api" -ForegroundColor Yellow
