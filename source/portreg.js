const fs = require('fs')
const detectPort = require('detect-port')

var dataDirPath = __dirname + '/../data'
var registryJsonPath = dataDirPath + '/registry.json'

if (!fs.existsSync(dataDirPath)){
    fs.mkdirSync(dataDirPath);
}

function getRegistryJson() {
	return new Promise((resolve, reject)=>{
		function onNoFile() {
			resolve({
				configuration:{
					min:9000,
					max:19000
				},
				registry:{}
				})
		}
		fs.readFile(registryJsonPath, 'utf-8', (err, content)=>{
			if(err) {
				onNoFile()
				return
			}
			try{
				const json = JSON.parse(content)
				resolve(json)
			}catch(e){
				onNoFile()
			}
		})
	})
}

function getNextPort(registryJson) {
	let port = Number(registryJson.configuration.min)
	let usedPorts = Object.values(registryJson.registry).map(value=>{return Number(value)})
	let maxPort = registryJson.maxPort
	function attempt(port) {
		while(usedPorts.includes(port)){
			port++
		}
		return new Promise((resolve, reject)=>{
			detectPort(port).then(resolve).catch((err)=>{
				if(port === maxPort){
					reject(new Error("port limit reached"))
					return
				}
				return attempt(port+1)
			})
		})
	}
	return attempt(port)
}

function writeRegistryJson(registryJson) {
	return new Promise((resolve, reject)=>{
		const jsonString = JSON.stringify(registryJson)
		fs.writeFile(registryJsonPath, jsonString, 'utf-8', err=>{
			if(err) {
				reject(err)
				return
			}
			resolve()
		})
	})
}

function register(name, port) {
	let registryJson = {}
	let registeredPort = port
	return getRegistryJson().then(json=>{
		registryJson = json
		if(registeredPort){
			return registeredPort
		} else {
			const existingPort = registryJson.registry[name]
			if(existingPort){
				return existingPort
			}
		}
		return getNextPort(json)
	}).then(port=>{
		registeredPort = port
		registryJson.registry[name] = port
		return writeRegistryJson(registryJson)
	}).then(()=>{
		return registeredPort
	})
}

function unregister(name) {
	let registryJson = {}
	return getRegistryJson().then(json=>{
		registryJson = json
		if(registryJson.registry[name]){
			delete registryJson.registry[name]
		}
		return writeRegistryJson(registryJson)
	})
}

function list() {
	let registryJson = {}
	return getRegistryJson().then(json=>{
		registryJson = json
		return registryJson.registry
	})
}

function configure(options) {
	let registryJson = {}
	return getRegistryJson().then(json=>{
		registryJson = json
		if(options){
			const keys = Object.keys(options)
			for(let key of keys) {
				registryJson.configuration[key] = options[key]
			}
		}
		return writeRegistryJson(registryJson)
	}).then(()=>{
		return registryJson.configuration
	})
}

exports.register = register
exports.unregister = unregister
exports.list = list
exports.configure = configure
