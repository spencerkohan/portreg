## Portreg (Port-Registry)

A tool for managing port assignments.  It offers a way of mapping port addresses to semantically relevant names.

## Installation

Portreg only really makes sense to install globally:

    npm install -g portreg

## Usage

Portreg has both a cli and node interface.  

### CLI

- `**portreg register <service name> [-p <port>]**`: adds a service to the registry and returns the assigned port.  A port can be supplied with the `-p` option, otherwise the next available port will be chosen.

- `**portreg unregister [service name]**`: removes a service from the registry if it exists.

- `**portreg ls**`: lists the currently mapped ports

- `**portreg config [--min <port>] [--max <port>]: returns or sets the min and max port portreg will attempt to assign.  If no arguments are supplied, the current limits will simply be returned.

### Node

	// import
	const portreg = require('portreg')

    // register a service
    portreg.register('my-service').then((port)=>{ ... })

    // register a service to a specific port
    const serverPort = 8888
    portreg.register('my-service', serverPort).then((port)=>{ ... })

    // list all services
    portreg.list().then((mapping)=>{ ... })
    // here mapping has the format:
    // { <serviceName> : <portNumber> ... }

    // unregister a service
    portreg.unregister('my-service').then(()=>{ ... })

    // configure
    const options = {
    	min : 1024,
    	max : 2048
    }
    portreg.configure(options).then((updatedConfiguration)=>{ ... })

## Limitations

- Currently **portreg** is *not* thread safe.  It's possible for two portreg processies to assign different services to the same port.

- **Portreg** considers an open port to be a port which: 1) is not already registered by portreg, or 2) is not in use when portreg attempts to find an unused port.  It does not know which ports are assigned to services whihc are not currently running.
