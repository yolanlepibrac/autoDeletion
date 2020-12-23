import * as vscode from 'vscode';
import { DeletionProvider } from './deletionProvider';

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

	const cursorLine = editor.selection.active.line;
	const cursorPos = editor.selection.active.character;
	editor.edit(editBuilder => {
		editBuilder.replace(new vscode.Range(cursorLine,cursorPos,cursorLine,cursorPos), ".");
	});
	vscode.commands.executeCommand('editor.action.triggerSuggest');
	
	
}

export function deactivate() {}
