"use strict";

//Описание переменной и функции для вывода задания по нажатию на кнопку "TASK"
let show_task=document.getElementById("task");
show_task.addEventListener("click", (e) => {
alert("Задание для варианта №20:\nРеализовать утилиту «Журнализация».");
});

let addFileBtn = document.getElementById("addFile");
let filesInfo = document.querySelector(".info__files");
let memoryInfo = document.querySelector(".info__memory");
let journalTable = document.querySelector(".journal__table");

let memory = {
    blocksAmount: 0,
    blocks: [],
    files: [],
    ff: 0
}
let journal = []

memory.blocksAmount = +prompt("Введите размер памяти");

for (let i = 0; i < memory.blocksAmount; i++)
    memory.blocks[i] = 0;

addFileBtn.addEventListener("click", (e) => {
    let name = prompt("Имя файла: ");
    let size = +prompt("Размер файла:");

    addFile(name, size);

    showFilesTable(memory, true);
    showMemory(memory, true);
    showJournalTable(true);
});

function getBackMemoryTo(number) {
    memory = journal[number].memory;

    showFilesTable(memory, true);
    showMemory(memory, true);
    showJournalTable(true);
}
function addFile(name, size) {
    let startPos = 0, endPos = 0, isFound = false, isEnoughMemory;

    if (memory.files.some(file => file.name == name))
    {
        alert("Файл с таким именем уже есть!");
        return;
    }
    while (!isFound) {
        for (let i = startPos; i < memory.blocks.length; i++)
            if (memory.blocks[i] == 0)
            {
                startPos = i++;
                break;
            }
   
        for (let i = startPos; i < memory.blocks.length; i++)
            if (memory.blocks[i] == 0 && endPos - startPos + 1 !== size)
                endPos = i;
            else if (memory.blocks[i] !== 0)
                break;

        if (endPos - startPos + 1 < size) {
            startPos = endPos + 1;
        } if (endPos - startPos + 1 == size) {
            isFound = true;
            isEnoughMemory = true;
        } else {
           isFound = true;
           isEnoughMemory = false;
        }
    }

    if (!isEnoughMemory) {
        alert("Не достаточно памяти!");
        return;
    }

    let file = {
        name: name,
        size: size,
        start: startPos,
        end: endPos
    };

    journal.push({
        type: "Добавление",
        file: file,
        memory: copyObj(memory)
    });

    memory.files.push(file);
    memory.ff++;

    for (let i = startPos; i <= endPos; i++)
        memory.blocks[i] = memory.ff;
}
function deleteFile(name) {
    if (!memory.files.some(file => file.name == name)) {
        alert("Такого файла нет!");
        return;
    }

    let fileI = 0;
    
    memory.files.forEach((file, ind) => file.name == name && (fileI = ind));

    journal.push({
        type: "Удаление",
        file: memory.files[fileI],
        memory: copyObj(memory)
    });

    for (let i = memory.files[fileI].start; i <= memory.files[fileI].end; i++)
        memory.blocks[i] = 0;

    memory.files = del(memory.files, fileI);

    showFilesTable(memory, true);
    showMemory(memory, true);
    showJournalTable(true);
}
function copyObj(obj) {
    let newObj = {};

    for (let prop in obj) {
        if (Array.isArray(obj[prop]))
            newObj[prop] = [...obj[prop]];
        else if (typeof obj[prop] == "object") 
            newObj[prop] = copyObj(obj[prop])
        else
            newObj[prop] = obj[prop];
    }

    return newObj;
}
function del(arr, pos) {
    if (pos + 1 == arr.length)
        return [...arr.slice(0, pos)]
    else if (pos == 0)
        return [...arr.slice(1)]
    else 
        return [...arr.slice(0, pos), ...arr.slice(pos + 1, arr.length)];
}
function showFilesTable(memory, shouldShow) {
    let str = "";

    str += `<table border='1'><thead><tr><td>Номер</td><td>Имя файла</td><td>Размер</td><td>Операция</td></tr></thead><tbody>`;

    memory.files.forEach((file, ind) => {
        str += "<tr>";
        str += `<td>${ind + 1}</td><td>${file.name}</td><td>${file.size}</td><td><input type='button' value='Удалить' onclick='deleteFile("${file.name}")'></td></tr>`;
    });

    str += "</tbody></table>";

    if (shouldShow)
        filesInfo.innerHTML = str;

    return str;
}
function showMemory(memory, shouldShow) {
    let str = "";
    let c = 0;

    memoryInfo.innerHTML = "";

    memory.blocks.forEach(block => {
        str += `<span ${block !== 0 ? "style='color:red;'" : "style='color:blue;'"}>${block}</span>`
    });

    if (shouldShow)
        memoryInfo.innerHTML += str + "<br>";
    
    return str;
}
function showJournalTable(shouldShow) {
    let str = "";

    str += `<table border='1'><thead><tr><td>Номер</td><td>Операция</td><td>Имя файла</td><td>Размер</td><td>Действие</td><td>Информация</td></tr></thead><tbody>`;

    journal.forEach((j, ind) => {
        str += "<tr>";
        str += `<td>${ind + 1}</td><td>${j.type}</td><td>${j.file.name}</td><td>${j.file.size}</td><td><input type='button' value='Откатиться' onclick='getBackMemoryTo(${ind})'</td><td><input type='button' value='Информация' onclick='showPrevMemory(${ind})'</td></tr>`;
    });

    str += "</tbody></table>";

    if (shouldShow)
        journalTable.innerHTML = str;

    return str;
}
function showPrevMemory(number) {
    let w = window.open("", "", "width=400, height=400");

    let memory = journal[number].memory

    w.document.write(showFilesTable(memory) + showMemory(memory));
}