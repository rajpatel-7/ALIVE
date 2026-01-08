# PowerShell Script to Prepare Clean Deployment Folders
# This solves the "300MB Upload Error" by physically isolating source code.

$Root = "d:\MLDL\ALIVE"
$BackendSource = "$Root\BackEnd"
$FrontendSource = "$Root\FrontEnd\cardio-ai-frontend"

$BackendDest = "$Root\clean_deploy_backend"
$FrontendDest = "$Root\clean_deploy_frontend"

# --- 1. PREPARE BACKEND ---
Write-Host "Preparing Clean Backend..." -ForegroundColor Cyan
if (Test-Path $BackendDest) { Remove-Item $BackendDest -Recurse -Force }
New-Item -ItemType Directory -Path $BackendDest | Out-Null

# Copy Files
Copy-Item "$BackendSource\main.py" -Destination $BackendDest
Copy-Item "$BackendSource\requirements.txt" -Destination $BackendDest
Copy-Item "$BackendSource\*.pkl" -Destination $BackendDest
Copy-Item "$BackendSource\vercel.json" -Destination $BackendDest
# Copy Procfile if exists, though main.py is enough for Vercel
if (Test-Path "$BackendSource\Procfile") { Copy-Item "$BackendSource\Procfile" -Destination $BackendDest }

# Create a fresh .gitignore/vercelignore for the clean folder
Set-Content -Path "$BackendDest\.vercelignore" -Value "*.pyc`n__pycache__`n.venv`n"

Write-Host "Backend ready at: $BackendDest" -ForegroundColor Green

# --- 2. PREPARE FRONTEND ---
Write-Host "Preparing Clean Frontend..." -ForegroundColor Cyan
if (Test-Path $FrontendDest) { Remove-Item $FrontendDest -Recurse -Force }
New-Item -ItemType Directory -Path $FrontendDest | Out-Null

# Copy Files (Exclude node_modules)
# We use robocopy for speed and exclusion capability, or standard Copy-Item with exclusion
# Copy-Item is easier for valid script logic
$Exclude = @("node_modules", ".git", ".vercel", "dist", ".env")
Get-ChildItem $FrontendSource -Exclude $Exclude | Copy-Item -Destination $FrontendDest -Recurse

Write-Host "Frontend ready at: $FrontendDest" -ForegroundColor Green
Write-Host "DONE. You can now deploy from these clean folders." -ForegroundColor Yellow
