#!/usr/bin/env node

// Requires
var argv = require('yargs')
	.usage('Usage: aka <action> (<alias> <command>)')
	.command('action', 'add, remove, or list')
	.command('alias', 'name of alias (optional)')
	.command('command', 'command (optional)')
	.help('h')
	.alias('h', 'help')
	.argv;
const fs = require('fs');
var exec = require('child_process').exec;
require('shelljs/global');

// Setup
var filePath = process.env['HOME'] + '/.aka';


var action = argv._[0];

//Add
var add = function () {
	var alias = argv._[1] + "='" + argv._[2] + "'";
	fs.appendFileSync(filePath, 'alias ' + alias + '\n');
}

//Remove
var del = function () {
	var text;
	var data = fs.readFileSync(filePath, 'utf8');
	var arry = data.split('\n');
	var index = 0;
	var foundIndex;
	
	arry.forEach(function (line) {
		var parsedLine = line.split(' ')[1];
		if (parsedLine){
			var name = parsedLine.split('=')[0];
			if (name === argv._[1]) {
				foundIndex = index;
			}
		}
		index++;
	});
	arry.splice(foundIndex, 1);
	fs.writeFileSync(filePath, arry.join('\n'));
}

//List
var list = function () {
	fs.readFile(filePath,'utf8', (err, data) => {
		if (err) throw err;
		console.log(data);
	});
}
//Determine the action
switch (action) {
	case 'add':
		add()
		break;
	case 'remove':
		del();
		break;
	case 'list':
		list();
		break;
	default:
		console.log('Error: Unknown command');
		break;
}

exec('source ' + filePath);
