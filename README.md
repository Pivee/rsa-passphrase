# RSA Passphrase

This is a CLI tool made to generate RSA keys, and test JWT signing using those keys.

You can use `rsp` to access this using the terminal when you install this as a global package because the following config has been added to the `package.json` file.

```json
"bin": {
  "rsp": "./dist/index.js"
},
```

Then it would look something like this:

```sh
rsp generate-private --b 4096
```

Or else, you could always run `node ./dist <command>`.

You can use the following commands when using this application:

## `generate-private`

This can be used to generate a private key.

| Options            | Shorthand | Description                               |
| ------------------ | --------- | ----------------------------------------- |
| `--bitsize [size]` | `-b`      | Bit size of the key. <br> Default: `2048` |

## `generate-public`

This can be used to generate the public key from the previously generated private key.

| Options                     | Shorthand | Description                  |
| --------------------------- | --------- | ---------------------------- |
| `--passphrase [passphrase]` | `-p`      | Use a passphrase for the key |

## `create-cipher`

Use this to create a new cipher using the private key.

| Options                     | Shorthand | Description                        |
| --------------------------- | --------- | ---------------------------------- |
| `--message [message]`       | `-m`      | Message to be used in the cipher   |
| `--passphrase [passphrase]` | `-p`      | Use a passphrase during the cipher |

## `verify`

Use this to create a new cipher using the private key.

| Options                     | Shorthand | Description                              |
| --------------------------- | --------- | ---------------------------------------- |
| `--passphrase [passphrase]` | `-p`      | Use a passphrase during the verification |
