@echo off
REM 本地开发启动脚本

echo ================================
echo 启动本地开发服务器（localhost）
echo ================================

REM 设置所有必需的环境变量
set PWD=%CD%
set SPACESHIP_AUTHOR=My Vault

REM 清理缓存（可选）
REM if exist .astro rmdir /s /q .astro

echo.
echo 环境配置:
echo - SPACESHIP_AUTHOR = %SPACESHIP_AUTHOR%
echo - PWD = %PWD%
echo - base 路径: /openeducation/ （与 GitHub Pages 一致）
echo - 访问地址: http://localhost:4321/openeducation/
echo.

REM 启动开发服务器
npm run dev

pause

