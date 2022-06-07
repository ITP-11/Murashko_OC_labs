"use strict";

//Описание переменной и функции для вывода задания по нажатию на кнопку "TASK"
let show_task=document.getElementById("task");
show_task.addEventListener("click", (e) => {
alert("Задание для варианта №20:\nГлобальное размещение. Алгоритм замещения-NFU.\nВыгружается страница с наименьшим значением счётчика.");
});

let pagesInfo = document.getElementById("pagesInfo");
let pagesInfoTable = document.getElementById("pagesInfoTable");

let pageNameAdd = document.getElementById("pageNameAdd");
let addPageBtn = document.getElementById("addPageBtn");

let pageNameDel = document.getElementById("pageNameDel");
let deletePageBtn = document.getElementById("deletePageBtn");

let callPageBtn = document.getElementById("callPageBtn");
let freeMemoryBtn = document.getElementById("freeMemoryBtn");

let timerID = 0;

let memory = {
    total: 0,
    pagesAmount: 0,
    pageSize: 0,
    pages: [],
    totalQuieries: 0
}

let total = +prompt("Введите объем памяти: ");
let pageSize = +prompt("Введите объем страницы: ");

memory.total = total;
memory.pageSize = pageSize;
memory.pagesAmount = Math.floor(total / pageSize);

showPagesInfo(memory);
callCountPage();

freeMemoryBtn.addEventListener("click", (e) => {
   if (!memory.pages.length) {
       alert("Страниц нет!");
       return;
    } else 
        freeMemory(memory, false)
});
callPageBtn.addEventListener("click", (e) => {
   if (!memory.pages.length) {
       alert("Страниц нет!");
       return;
    } else 
        callPage(memory)
});
addPageBtn.addEventListener("click", (e) => {
    let name = pageNameAdd.value;
    
    if (!name)
    {
        alert("Вы не ввели имя страницы!");
        return;
    } else 
        addPage(memory, name)
});
deletePageBtn.addEventListener("click", (e) => {
    let name = pageNameDel.value;
    
    if (!name)
    {
        alert("Вы не ввели имя страницы!");
        return;
    } else 
        deletePage(memory, name)
});

function callCountPage() {
    timerID = setTimeout(() => {
        memory.pages.forEach(page => page.count++);
        
        showPagesTable(memory);
        showPagesInfo(memory); 
            
        callCountPage();
    }, 1000);
}
function freeMemory(memory, newPage) {
    let forDel = memory.pages.sort((p1, p2) => p2.count - p1.count)[0];
 
    for (let i = 0; i < memory.pages.length; i++)
        if (memory.pages[i].name == forDel.name && newPage)
            memory.pages[i] = newPage;  
        else if (!newPage)
        {
            memory.pages = del(memory.pages, i);
            break;
        }
 
    showPagesTable(memory);
    showPagesInfo(memory);
}
function addPage(memory, pageName) {
    if (memory.pages.some(page => page.name == pageName)) {
        alert("Страница с таким именем уже есть!")
        return;
    }
    
    if (memory.pages.length >= memory.pagesAmount) 
        freeMemory(memory, {
            name: pageName,
            queries: 0,
            count: 0
        });
    else
        memory.pages.push({
            name: pageName,
            queries: 0,
            count: 0
        });

    showPagesTable(memory);
    showPagesInfo(memory); 
}
function callPage(memory)
{
    let amountOfQueries = Math.floor(Math.random()*10 + 1);
    
    for (let i = 0; i < amountOfQueries; i++)
    {
        memory.pages[Math.floor(Math.random() * memory.pages.length)].queries++;
        memory.totalQuieries++;
    }
    
     showPagesTable(memory);
     showPagesInfo(memory); 
}
function deletePage(memory, pageName) {
    if (memory.pages.some(page => page.name == pageName)) {
       for (let i = 0; i < memory.pages.length; i++)
            if (memory.pages[i].name == pageName)
            {
                memory.pages = del(memory.pages, i);
                
                showPagesTable(memory);
                showPagesInfo(memory); 
            }
    } else {
        alert("Такой страницы нет!");
        return;
    }
}
function showPagesInfo(memory) {
    let str = `<p>Количество свободной памяти: ${memory.total - memory.pages.length * memory.pageSize}</p><p>Количество страниц: ${memory.pagesAmount}</p><p>Число свободных страниц: ${(memory.pages.length ? 100 - (100 * memory.pages.length) / memory.pagesAmount : 100).toFixed(2)}</p><p>Размер страницы: ${memory.pageSize}</p><p>Количество обращений: ${memory.totalQuieries}</p>`;
    
    pagesInfo.innerHTML = str;
}
function showPagesTable(memory) {
    let str = "<table border='1'><thead><tr><td>#</td><td>Имя</td><td>Кол-во обращений</td><td>Знач счетчика</td></tr></thead><tbody>";
    
    memory.pages.forEach((page, ind) => {
        str += `<tr>`;
        str += `<td>${ind}</td><td>${page.name}</td><td>${page.queries}</td><td>${page.count}</td`
        str += `</tr>`;
    })
    
    str += "</tbody></table>";
    
    pagesInfoTable.innerHTML = str;
}
function del(arr, pos) {
    if (pos + 1 == arr.length)
        return [...arr.slice(0, pos)]
    else if (pos == 0)
        return [...arr.slice(1)]
    else 
        return [...arr.slice(0, pos), ...arr.slice(pos + 1, arr.length)];
}