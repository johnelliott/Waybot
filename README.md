# [Waybot 📈](https://waybot.primitivemachine.com)

A web app to monitor sensor data form [Waybot traffic counter](https://github.com/johnelliott/wb-counter). See it live [here](https://waybot.primitivemachine.com).

### About
This app tries to load fast by using small assets, compression and some initial markup and CSS before the react app starts. A service worker caches assets on supported clients.

### System Diagram
![diagram of waybot system](https://github.com/johnelliott/wb-web/blob/master/2016-system.jpeg "Waybot system 2016")

### Origins
This app started as a way to experiment with node, websockets and chart libraries running  and ran locally with the counter connecting directly to the server process. Later I re-did most of the code to use PouchDB, redux and react on the client and deployed it to a cloud server. This required a serial-http bridge—[wb-upload](https://github.com/johnelliott/wb-upload)—to bring the data to the server.

## Development
- CouchDB is required for local development.
- I used Let's Encrypt for TLS certificates. For local development on mac, add the certificates to the mac keychain app to satisfy the browser security settings—the green lock in the URL bar.

Check out [faker.sh](https://github.com/johnelliott/wb-web/blob/master/faker.sh) to see what the app might see from a traffic counter. This shows the data the app processes.

## Deployment
Deploy to a snowflake server with [Waybot deploy](https://github.com/johnelliott/wb-deploy).

imagemagick/graphicsmagick for creating assets -> [image-resizer.sh](https://github.com/johnelliott/wb-web/blob/master/image-resizer.sh)
gzip for the compression npm scripts

# Waybot config with Ansible

## Use
Use with ansible 2.0+

No inventory or configuration file is committed. 
Hosts in the example are configured with SSH.

## Examples
Example ansible inventory file `inventory`:
```
[edges]
raspberry-pi

[cloud]
wb-cloud-server
```

Example ansible configuration file `ansible.cfg`:
```
[defaults]
hostfile = inventory
```

Example playbook run for `edges` raspberry pi uploaders:
```bash
ansible-playbook edges.yml --extra-vars='{"api_host":"http://apihost.cool:1337/api","serial_port":"/dev/ttyACM1"}'
```
can also use extra-vars.json file with `--extra-vars=@extra-vars.json` on the command line
