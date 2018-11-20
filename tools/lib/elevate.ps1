param(
    [string]$cmd,
    [string]$cwd = '.',
    [string]$tools,
    [switch]$elevated
)
function Sanitize {
    param([string]$str)
    $str = $str -replace '` ', ' '
    $str = $str -replace ' ', '` '
    return $str
}
$cwd = Sanitize $cwd
$tools = Sanitize $tools

function Check-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal $([Security.Principal.WindowsIdentity]::GetCurrent())
    $currentUser.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

if ((Check-Admin) -eq $false)  {
    if ($elevated) {
        "Failed to elevate script"
    } else {
        $cmd = "cmd.exe /c \`"cd $($cwd -replace '` ', ' ') && `"echo This window will automatically close when finished . . .`" && $cmd\`""
        # Start-Process powershell.exe -Verb RunAs -ArgumentList ("-NoExit -Command `"$cmd`"")
        Start-Process powershell.exe -Verb RunAs -ArgumentList ("-Command `"$cmd`"")
        "Process elevated in another shell . . ."
    }
}
