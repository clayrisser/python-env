@echo off

REM If PowerShell 2 is not installed, this script will automatically download and install it.
REM Only works on XP SP3 with .NET 3.5. Only for dev boxes, not designed for servers.
REM Based on http://blog.codeassassin.com/2009/12/10/no-web-browser-need-powershell

"%SystemRoot%\system32\WindowsPowerShell\v1.0\powershell.exe" -command "exit $PSVersionTable.PSVersion.Major"
set PSVer=%errorlevel%
if %PSVer% geq 2 goto already_installed

ver | find "XP" > nul
if %ERRORLEVEL% neq 0 goto not_xp

ver | find "5.1.2600" > nul
if %ERRORLEVEL% neq 0 goto not_xp_sp3

if not exist "%systemroot%\microsoft.net\framework\v3.5\csc.exe" goto not_netfx_35

if not exist "%SystemRoot%\system32\WindowsPowerShell\v1.0\powershell.exe" goto install

echo PowerShell %PSVer% is currently installed (but will be upgraded)

:install
echo PowerShell 2 is required for this script but is not installed on your machine.
echo It will now be installed automatically.
pause
echo Downloading PowerShell 2
echo class Program { public static void Main() { >"%~dpn0.cs"
echo using (var wc = new System.Net.WebClient()) { >>"%~dpn0.cs"
echo wc.UseDefaultCredentials = true; >>"%~dpn0.cs"
echo wc.Proxy.Credentials = System.Net.CredentialCache.DefaultCredentials; >>"%~dpn0.cs"
echo wc.DownloadFile(@"http://download.microsoft.com/download/E/C/E/ECE99583-2003-455D-B681-68DB610B44A4/WindowsXP-KB968930-x86-ENG.exe", @"%~dpn0.installer.exe");}}} >>"%~dpn0.cs"
"%systemroot%\microsoft.net\framework\v3.5\csc.exe" /nologo /out:"%~dpn0.exe" "%~dpn0.cs"
"%~dpn0.exe"
if %errorlevel% neq 0 goto :EOF
echo Installing PowerShell 2
"%~dpn0.installer.exe"
set InstallResult=%errorlevel%
if %InstallResult% neq 0 goto install_failed
del "%~dpn0.cs"
del "%~dpn0.exe"
del "%~dpn0.installer.exe"
goto :EOF

:install_failed
echo PowerShell 2 installation failed.
goto :EOF

:not_xp
echo This script only expects to work on XP, which is not your OS.
echo Install PowerShell manually from http://microsoft.com/powershell
goto :EOF

:not_xp_sp3
echo This script requires XP SP3. Install now from:
echo http://www.microsoft.com/downloads/details.aspx?familyid=2FCDE6CE-B5FB-4488-8C50-FE22559D164E
goto :EOF

:not_netfx_35
echo This script requires .NET Framework 3.5. Install now from:
echo http://www.microsoft.com/downloads/details.aspx?FamilyId=333325FD-AE52-4E35-B531-508D977D32A6
goto :EOF

:already_installed
goto :EOF
