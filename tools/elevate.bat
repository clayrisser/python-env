@set CWD=%cd%
@set TOOLS=%~dp0

@call "%TOOLS%lib\validate_powershell.bat"

echo %1

powershell -executionpolicy bypass -file "%TOOLS%lib\elevate.ps1" -cmd %1 -cwd "%CWD%" -tools "%TOOLS%"
