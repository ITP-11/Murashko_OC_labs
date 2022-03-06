@ECHO OFF
CLS
ECHO File %0 copy catalog %1 in %2
IF -%1==-GOTO NoParam
IF -%2==-GOTO NoParam
XCOPY %1\ %2/S/E/T
GOTO:eof
:NoParam
ECHO Wrong parametr!
PAUSE
