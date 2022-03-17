'Имя: Lab2.vbs
'Язык: VBScript
'Описание: вторая лабораторная работа

'Объявляем переменные
Dim FSO,F,TextStream, s, Disc, Drives, ScriptPlace, oFSO, oTStream
'Объявляем константу System-это атрибут для проверки является ли файл системным
Const System = 4
do
'Выводим строки
WScript.StdOut.WriteLine "MENU:"
WScript.StdOut.WriteLine "1.Information about creator"
WScript.StdOut.WriteLine "2.Creating file with list of system files in chosen place"
WScript.StdOut.WriteLine "3.Saving in the notepad a list of disks with their size"
WScript.StdOut.WriteLine "4.Exit"
WScript.StdOut.Write "Choose a menu punct:"
'Считываем строку
s = WScript.StdIn.ReadLine
if (s="1") Then
WScript.StdOut.WriteLine "Murashko Maksim Dmitrievich,group ITP-11"

elseif (s="2") Then
'воод пути для создания файла при помощи inputbox
SavingPlace = inputbox("Choose a place where file should be created:")
'Создаём объект FileSystemObject
set oFSO = CreateObject("Scripting.FileSystemObject")
'GetParentFolderName-определяет родительский каталог объекта FileSystemObject и возвращает полный путь к скрипту
ScriptPlace = oFSO.GetParentFolderName(WScript.ScriptFullName)
set oTStream = oFSO.CreateTextFile(ScriptPlace & "\files.txt", true)
' Создаём список файлов в выбранном месте
for each oFile in oFSO.GetFolder(SavingPlace).Files
'Проверка является ли файл системным с помощью метода .Attributes
if (oFile.Attributes and (System)) then oTStream.WriteLine oFile.Name
next

elseif (s="3") Then
set FSO = WScript.CreateObject("Scripting.FileSystemObject")
set Drives = FSO.Drives
set oFSO = CreateObject("Scripting.FileSystemObject")
ScriptPlace = oFSO.GetParentFolderName(WScript.ScriptFullName)
set oTStream = oFSO.CreateTextFile(ScriptPlace & "\DiscsSize.txt", true)
for each Disc in Drives
'Выводим объём дисков в килобайтах
oTStream.WriteLine Disc & Disc.TotalSize/1024 & "Kb"
next
oTStream.Close
End if
'Цикл повторяется,пока не выберем пункт Exit
loop until (s="4")

