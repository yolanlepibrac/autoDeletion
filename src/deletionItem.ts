import * as vscode from "vscode";

export class DeletionItem extends vscode.CompletionItem {
    super(keyword :string, type : vscode.CompletionItemKind){}
}