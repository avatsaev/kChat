# kawachat


## Usage

Use Node 6.x with nvm

Grunt and Bower cli's must be installed in global with npm

Gems coffee, sass, and haml must be installed with bundle

Frontend code is in **./assets/** folder

### Installing


Install frontend dependencies:
```
bower install
```

Install backend dependencies:
```
npm install
```

Compile everything:

```
grunt assets
```


Run:

```
npm start
```

Go to http://localhost:3002

### Developing

Realtime Compilation and live reload:

```
grunt watch
```
