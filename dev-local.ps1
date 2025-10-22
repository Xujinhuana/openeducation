# -*- coding: utf-8 -*-

# 切换到脚本所在目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "================================"
Write-Host "Starting local development server"
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Set environment variables
$env:PWD = Get-Location
$env:SPACESHIP_AUTHOR = "My Vault"

Write-Host "Configuration:"
Write-Host ("- SPACESHIP_AUTHOR: " + $env:SPACESHIP_AUTHOR)
Write-Host ("- PWD: " + $env:PWD)
Write-Host "- Base path: /openeducation/"
Write-Host "- Access URL: http://localhost:4321/openeducation/"
Write-Host ""

# Start dev server
npm run dev

Read-Host "Press Enter to exit"
