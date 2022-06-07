let memory =
{
total: 32,
maxBlockSize: 4,
processes: [],
waitings: [],
queries: 0,
getAmountOfFreeMemory() {
let freeMemory = 0;

this.processes.forEach(process => freeMemory += process.size);

return this.total - freeMemory;
}
}

//Описание переменной и функции для вывода задания по нажатию на кнопку "TASK"
let show_task=document.getElementById("task");
show_task.addEventListener("click", (e) => {
alert("Задание для варианта №20:\nСвопинг. Выгружается процесс, с наименьшим приоритетом.");
});

//Описание основных переменных
let add_process=document.getElementById("add_process");
let del_process=document.getElementById("del_process");
let clean_memory=document.getElementById("clean_memory");
let processesTable=document.getElementById("table_processes");
let memoryInfo=document.getElementById("memory_info");
let write=document.getElementById("write");
let read=document.getElementById("read");

//Описание функций для кнопок
add_process.addEventListener("click", (e) =>
{
	addProcess();
});

del_process.addEventListener("click", (e) =>
{
	deleteProcess();
});

clean_memory.addEventListener("click", (e) =>
{
	doSwopping();
});

write.addEventListener("click", (e) =>
{
	writeToProcess();
});

read.addEventListener("click", (e) =>
{
	readFromProcess();
});

//функция удаления процесса
function deleteProcess() {
	let name = prompt("Название процесса:");

	if (!memory.processes.some(process => process.name == name)) {
	alert("Такого процесса нет!");
	return;
}

memory.processes = memory.processes.filter(process => process.name != name);

updateInfo();
}

//Функция записи в процесс
function writeToProcess() {
	let name = prompt("Название процесса:");

	if (!memory.processes.some(process => process.name == name)) {
		alert("Такого процесса нет!");
		return;
	}

	let max = 0;
	let ind = 0;

	memory.processes.forEach((process, i) =>{
		if (process.name == name) {
		max = process.size;
		ind = i;
		}
	})

	let val = prompt("Введите какие-нибудь символы(максимум "+max+"): ");

	if (val.length > max) {
		alert("Кол-во символов больше максимального!");
		return;
	}

	memory.processes[ind].value = val;
}

//Функция чтения
function readFromProcess() {
	let name = prompt("Название процесса:");

	if (!memory.processes.some(process => process.name == name)) {
	alert("Такого процесса нет!");
	return;
	}

	let ind = 0;

	memory.processes.forEach((process, i) =>{
	if (process.name == name) {
	ind = i;
	}
	})

	alert(`Процессе с названием ${name} содержит следующую запись: ${memory.processes[ind].value}`);
}

//Функция выводящая сведения о процессах
function updateInfo() {
	showProcessesTable();
	showMemoryInfo();
}

//Функция добавления процесса
function addProcess(n, s, p) {
	let name = n || prompt("Название: ");
	let size = s || +prompt("Размер: ");
	let priority = p || +prompt("Приоритет: ");

	if (memory.getAmountOfFreeMemory() < size) {
	alert("Память заполнена!");

	memory.waitings.push({name, size, priority});
	memory.queries++;

	updateInfo();

	return;
	}

	if (memory.processes.some(process => process.name == name)) {
	alert("Процесс с таким названием уже есть!");

	return;
	}

	let process = {name, size, priority, blocks: [], value: ""};

	if (size > memory.maxBlockSize) {
	let wholeIterations = Math.floor(size / memory.maxBlockSize);
	let remains = size % memory.maxBlockSize;

	for (let i = 0; i < wholeIterations; i++)
	process.blocks.push(memory.maxBlockSize);

	if (remains)
	process.blocks.push(remains);
	} else
	process.blocks.push(size);

	memory.processes.push(process);
	memory.queries++;

	updateInfo();
}

//Функция выводящая таблицу процессов
function showProcessesTable() {
	let str = "<table border='1'><thead><tr><td>№</td><td>Название</td><td>Приоритет</td><td>Размер блока</td><td>Номер блока</td></tr></thead><tbody>";

	memory.processes.forEach((process, ind) => {
	process.blocks.forEach((block, blockInd) => {
	str += `<tr><td>${ind + 1}</td><td>${process.name}</td>
	<td>${process.priority}</td><td>${block}</td><td>${blockInd + 1}</td></tr>`;
	});
	});

	str += "</tbody></table>";

	processesTable.innerHTML = str;
}

//Функция для выода информации о состоянии памяти
function showMemoryInfo() {
	let maxFreeSize = -1;
	let amountOfFulfilled = (100 * memory.waitings.length) / (memory.waitings.length + memory.processes.length);

	console.log(amountOfFulfilled);

	memory.processes.forEach(process => {
	process.blocks.forEach(block => {
	if (maxFreeSize != -1 && memory.maxBlockSize - block > maxFreeSize)
	maxFreeSize = memory.maxBlockSize - block;
	else
	maxFreeSize = block;
	})
	})
	let str = `<p>Объём свободной памяти: ${memory.getAmountOfFreeMemory()}`;

	str += `<br>Общий объём памяти: ${memory.total}<br>`;
	str += `Размер наибольшего свободного блока: ${maxFreeSize}`;
	str += `<br>Кол-во удовлетворённых запросов в процентах: ${memory.waitings.length != 0 ? amountOfFulfilled.toFixed(2) : 100}%`;
	str += `<br>Кол-во запросов на выделение памяти: ${memory.queries}</p>`;

	memoryInfo.innerHTML = str;
}

//Функция удаляющая процесс с наименьшим приоритетом
function doSwopping() {
	if (!memory.waitings.length) {
	alert("Нет ожидающих процессов!");
	return;
	}

	let addedProcess = memory.waitings.pop();

	let sortProcesses = memory.processes.sort((pr1, pr2) => pr2.priority - pr1.priority);
	let del = "";

	while (addedProcess.size > memory.getAmountOfFreeMemory()) {
	del += sortProcesses.pop().name + ";";
	}

	memory.processes = sortProcesses;

	alert("Были удалены следующие процессы: "+del);
	console.log(sortProcesses);

	addProcess(addedProcess.name, addedProcess.size, addedProcess.priority);

	updateInfo();
}