import * as vscode from 'vscode';
import { DeletionProvider } from './deletionProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	var selector : vscode.DocumentSelector = [{
        pattern: '**'
	}];
	const provider = new DeletionProvider();
	const autoCompletionProvider = vscode.languages.registerCompletionItemProvider(
		selector,
		provider,
		'.'
	);

	let autoDeletion = vscode.commands.registerCommand('autoDeletion.autoDelete', () => autoDelete());
	context.subscriptions.push(autoCompletionProvider, autoDeletion);
}

async function  autoDelete() {
	
	const editor = vscode.window.activeTextEditor;
	if(!editor){
		return; 
	}

	vscode.commands.executeCommand('editor.action.triggerSuggest');

	// return editor.insertSnippet(
	// 	new vscode.SnippetString('autoDeletion'),
	// 	new vscode.Position(0, 0)
	// );

	// const cursorLine = editor.selection.active.line;
	// const cursorPos = editor.selection.active.character;
	// editor.edit(editBuilder => {
	// 	editBuilder.replace(new vscode.Range(cursorLine,0,cursorLine,cursorPos), "hekkishbqsx");
	// });

	// const {text : baseText} = editor.document.lineAt(editor.selection.active.line);

	// await vscode.commands.executeCommand("deleteWordLeft");
	// const {text : text1} = editor.document.lineAt(editor.selection.active.line);
	// await vscode.commands.executeCommand("deleteWordLeft");
	// const {text : text2} = editor.document.lineAt(editor.selection.active.line);
	
	// vscode.window.showInformationMessage(text1);
	// vscode.window.showInformationMessage(text2);

	// return editor.edit(editBuilder => {
	// 	editBuilder.replace(new vscode.Range(cursorLine,0,cursorLine,cursorPos), baseText);
	// });
	
	
}

// this method is called when your extension is deactivated
export function deactivate() {}
