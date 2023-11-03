// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mygit" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const workspaceRoot = vscode.workspace.rootPath;
	process.env.HOME = workspaceRoot;
	let init = vscode.commands.registerCommand('mygit.init', function () {
		// The code you place here will be executed every time your command is executed
		exec('cd $HOME && git init', (err, stdout, stderr) => {
			if (err) {
			  vscode.window.showInformationMessage(`Failed to initialize git repository`);
			  return; 
			}
			vscode.window.showInformationMessage(`Initialized git repository`);
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
		  });
	});
	let codeScan = vscode.commands.registerCommand('mygit.codescan', function () {
		// The code you place here will be executed every time your command is executed
		console.log(`Command preparing`);
		let cmd = `
			cd $HOME/backend

			export PROJECT_KEY=dp:backend
			export SONARQUBE_URL=http://192.168.0.194:9000
			export PAT=sqp_59722008948ebe46dc4f58544cd54f58da0ca7c1

			docker run --rm --name=sonar-scanner \
			-e SONAR_HOST_URL=$SONARQUBE_URL \
			-e SONAR_SCANNER_OPTS="-Dsonar.projectKey=$PROJECT_KEY -Dsonar.qualitygate.wait=true" \
			-e SONAR_TOKEN=$PAT \
			-v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli
		`; 
		console.log(cmd);
		vscode.window.showInformationMessage(`Scan Initializing`);
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				console.log(err);
			  	vscode.window.showInformationMessage(`Scan failed`);
			  	return; 
			}
			vscode.window.showInformationMessage(`Scan complete`);
			const pattern = /QUALITY GATE STATUS: (FAILED|PASSED)/gm
			let result =  stdout.match(pattern)
			vscode.window.showInformationMessage(`${result}`);
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			console.log(`Result: ${result}`);
		  });
	});

	context.subscriptions.push(init);
	context.subscriptions.push(codeScan);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
