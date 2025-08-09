# Simplified test script with proper error handling
$baseUrl = "https://booking-6.onrender.com"
$adminEmail = "admin@example.com"
$adminPassword = "Passw0rd!"

# Step 1: Register a patient (doesn't require admin key)
Write-Host "Registering test patient..." -ForegroundColor Cyan
try {
    $patientData = @{
        name = "Test Patient"
        email = "patient@example.com"
        password = "Passw0rd!"
        role = "PATIENT"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$baseUrl/api/register" -Method Post -ContentType "application/json" -Body $patientData
    Write-Host "Patient registered successfully" -ForegroundColor Green
} catch {
    Write-Host "Patient registration failed or already exists" -ForegroundColor Yellow
}

# Step 2: Login as patient
Write-Host "Logging in as patient..." -ForegroundColor Cyan
try {
    $loginData = @{
        email = "patient@example.com"
        password = "Passw0rd!"
    } | ConvertTo-Json

    $loginResult = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -ContentType "application/json" -Body $loginData
    $token = $loginResult.token
    Write-Host "Patient login successful, token: $($token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "Patient login failed" -ForegroundColor Red
    exit
}

# Step 3: Check for slots
Write-Host "Checking for slots..." -ForegroundColor Cyan
try {
    $slots = Invoke-RestMethod -Uri "$baseUrl/api/slots" -Method Get -Headers @{Authorization = "Bearer $token"}
    $slotCount = if ($slots -is [array]) { $slots.Length } else { 1 }
    Write-Host "Found $slotCount slots" -ForegroundColor Green
    
    if ($slotCount -gt 0) {
        Write-Host "First slot: $($slots[0].id), $($slots[0].startAt)" -ForegroundColor Cyan
    } else {
        Write-Host "No slots found - need to seed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error checking slots" -ForegroundColor Red
}

# Frontend setup info
Write-Host "`nFrontend Configuration:" -ForegroundColor Green
Write-Host "VITE_API_URL=$baseUrl/api" -ForegroundColor Yellow
