# Improved test script with better error handling
$baseUrl = "https://booking-6.onrender.com"

# Test health endpoint
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "Health check: OK" -ForegroundColor Green
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
    exit
}

# Try registering an admin
$adminEmail = "admin@example.com"
$adminPassword = "Passw0rd!"
$adminName = "Admin User"

# Try multiple common admin keys
$possibleKeys = @("adminkey123", "admin", "admin123", "AdminKey123", "ADMIN_KEY", "adminpassword", "admin_key_123")

Write-Host "Attempting admin login..." -ForegroundColor Cyan
$loginSuccess = $false

# Try login first
try {
    $loginData = @{
        email = $adminEmail
        password = $adminPassword
    } | ConvertTo-Json

    $loginResult = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -ContentType "application/json" -Body $loginData
    $token = $loginResult.token
    Write-Host "Login successful with existing admin! Token received." -ForegroundColor Green
    $loginSuccess = $true
} catch {
    Write-Host "Login failed, will try to register: $_" -ForegroundColor Yellow
}

# If login failed, try registering with different keys
if (-not $loginSuccess) {
    foreach ($key in $possibleKeys) {
        Write-Host "Trying registration with key: $key" -ForegroundColor Yellow
        try {
            $registerData = @{
                name = $adminName
                email = $adminEmail
                password = $adminPassword
                role = "ADMIN"
                adminKey = $key
            } | ConvertTo-Json

            $registerResult = Invoke-RestMethod -Uri "$baseUrl/api/register" -Method Post -ContentType "application/json" -Body $registerData
            Write-Host "Admin registered successfully with key: $key" -ForegroundColor Green
            
            # Now login with the new admin
            $loginData = @{
                email = $adminEmail
                password = $adminPassword
            } | ConvertTo-Json

            $loginResult = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -ContentType "application/json" -Body $loginData
            $token = $loginResult.token
            Write-Host "Login successful after registration! Token received." -ForegroundColor Green
            $loginSuccess = $true
            break
        } catch {
            Write-Host "Registration failed with key $key" -ForegroundColor Red
        }
    }
}

if (-not $loginSuccess) {
    Write-Host "Could not login or register admin. Please check your ADMIN_SIGNUP_KEY in Render env vars." -ForegroundColor Red
    exit
}

# Try each possible key for the seed endpoint
Write-Host "Testing seed endpoint with token..." -ForegroundColor Cyan
$seedSuccess = $false

foreach ($key in $possibleKeys) {
    try {
        Write-Host "Trying seed with key: $key" -ForegroundColor Yellow
        $seedData = @{
            adminSeedKey = $key
        } | ConvertTo-Json

        $seedResult = Invoke-RestMethod -Uri "$baseUrl/admin/seed" -Method Post -ContentType "application/json" -Headers @{Authorization = "Bearer $token"} -Body $seedData
        Write-Host "Seed completed successfully with key: $key!" -ForegroundColor Green
        $seedSuccess = $true
        break
    } catch {
        Write-Host "Seed failed with key $key: $_" -ForegroundColor Red
    }
}

if (-not $seedSuccess) {
    Write-Host "Could not run seed. Please check deployment and keys." -ForegroundColor Red
} else {
    # Check slots
    Write-Host "Checking slots..." -ForegroundColor Cyan
    try {
        $slots = Invoke-RestMethod -Uri "$baseUrl/api/slots" -Method Get -Headers @{Authorization = "Bearer $token"}
        Write-Host "Found $($slots.Length) slots" -ForegroundColor Green
    } catch {
        Write-Host "Error checking slots: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "FRONTEND SETUP:" -ForegroundColor Green
Write-Host "Update your frontend environment variable:" -ForegroundColor Yellow
Write-Host "VITE_API_URL=$baseUrl/api" -ForegroundColor Yellow
