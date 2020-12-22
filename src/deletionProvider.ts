import * as vscode from 'vscode';

let currentSuggestion = undefined;

export class DeletionProvider implements vscode.CompletionItemProvider {
   
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):vscode.CompletionItem[] | vscode.CompletionList {
        const line = document.lineAt(position.line);
        return [
            new vscode.CompletionItem('ya', vscode.CompletionItemKind.Snippet),
            new vscode.CompletionItem('yo', vscode.CompletionItemKind.Snippet),
            new vscode.CompletionItem('hello', vscode.CompletionItemKind.Snippet),
        ];
    }

    resolveCompletionItem(item: vscode.CompletionItem, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        vscode.window.showInformationMessage("zeubi");
        currentSuggestion = item.label;
        return item;
      }
}