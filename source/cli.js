#! /usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))

const portreg = require('./portreg')

const command = argv._[0]

if(command === "register") {

	const serviceName = argv._[1]
	const port = argv.p

	if(!serviceName) {
		console.log('Usage:')
		console.log('\tportreg register <service> [-p <port>]')
		console.log('\t\t<service>: the name of the service to register (must be unique within portreg)')
		console.log('\t\t<port> (optional): a port number to assign to this service in the registry')
		process.exit(1)
	}

	portreg.register(serviceName, port).then(port=>{
		console.log(port)
		process.exit(0)
	}).catch(e=>{
		console.log(e)
		process.exit(1)
	})


}else if(command === "unregister") {

	const serviceName = argv._[1]

	if(!serviceName) {
		console.log('Usage:')
		console.log('\tportreg unregister <service>')
		console.log('\t\t<service>: the name of the service to register (must be unique within portreg)')
		console.log('\t\t<port> (optional): a port number to assign to this service in the registry')
		process.exit(1)
	}

	portreg.unregister(serviceName).then(port=>{
		console.log(`${serviceName} unregistered successfully`)
		process.exit(0)
	}).catch(e=>{
		console.log(e)
		process.exit(1)
	})

}else if(command === "list" || command === "ls") {

	portreg.list().then(result=>{
		const keys = Object.keys(result)
		for(let key of keys) {
			console.log(`${key}: ${result[key]}`)
		}
		process.exit(0)
	}).catch(e=>{
		console.log(e)
		process.exit(1)
	})

}else if(command === "config") {

	let options = {}
	const min = argv.min
	const max = argv.max
	if(min){
		options.min = min
	}
	if(max){
		options.max = max
	}

	portreg.configure(options).then(result=>{
		const keys = Object.keys(result)
		for(let key of keys) {
			console.log(`${key}: ${result[key]}`)
		}
		process.exit(0)
	}).catch(e=>{
		console.log(e)
		process.exit(1)
	})

}else{
	console.log('Usage:')
	console.log('\tportreg register <service> [-p <port>]')
	console.log('\tportreg unregister <service>')
	console.log('\tportreg list')
	console.log('\tportreg config [--min <port>] [--max <port>]')
	process.exit(1)
}