Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "npmStart.bat" & Chr(34), 0
Set WshShell = Nothing