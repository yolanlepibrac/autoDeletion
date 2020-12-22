import * as vscode from 'vscode';
import { DeletionItem } from './deletionItem';

let currentSuggestion = undefined;

export class DeletionProvider implements vscode.CompletionItemProvider {
   
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):vscode.CompletionItem[] | vscode.CompletionList {
        const line = document.lineAt(position.line);
        const cursorLine = position.line;
        const cursorChar = position.character;
        const sentence  = line.text;
        const propositions  = new Array(6).fill(undefined).map((_undefined, index) => {
            return sentence.substring(0, sentence.length - index);
        }).reverse();
        const deletionItems = propositions.map((text, index) => {
            const item  =  new vscode.CompletionItem(text, vscode.CompletionItemKind.Snippet);
            item.insertText = text;
            item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(cursorLine,0,cursorLine,cursorChar))];
            return item;
        });
        return deletionItems;
    }

    resolveCompletionItem(item: vscode.CompletionItem, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        vscode.window.showInformationMessage("zeubi");
        currentSuggestion = item.label;
        return item;
      }
}