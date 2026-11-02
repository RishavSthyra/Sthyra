$env:Path = 'C:\Program Files\nodejs;' + $env:Path
Set-Location 'C:\Users\COMP\Downloads\Sthyra\Sthyra'
& npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
