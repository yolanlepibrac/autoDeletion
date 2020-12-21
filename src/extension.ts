import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "autoDeletion" is now active!');
	// let disposable = vscode.commands.registerCommand('autoDeletion.autoDelete', () => {
	// 	vscode.window.showInformationMessage('Hello Michel Michel michel from AutoDeletion!');
	// });
	// context.subscriptions.push(disposable);


	let autoDeletion = vscode.commands.registerCommand('autoDeletion.autoDelete', () => autoDelete());
	context.subscriptions.push(autoDeletion);
}

function autoDelete() {
	vscode.window.showInformationMessage('Auto deletion');
	const editor = vscode.window.activeTextEditor;
	if(!editor){
		return; 
	}
    const doc = editor.document;
    const start = editor.selections[0].start;
	let lines:any[] = [];
	
	return editor.edit(editorBuilder => {
		let range;
		console.log(editorBuilder);

        for (let i = 0; i < lines.length; i++) {
            range = new vscode.Range(
                lines[i].startLine,
                lines[i].startCharacter,
                lines[i].endLine,
                lines[i].endCharacter
            );

            editorBuilder.delete(range);
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
