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
