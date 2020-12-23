import * as vscode from 'vscode';
import { DeletionItem } from './deletionItem';

const AUTOCOMPLETION_ITEMS_LENGTH = 6;
let currentSuggestion = undefined;

const executeDeleteWordLeft = (sentence : string) => {
    const inverseSentence = [...sentence].reverse();
    const firstSpace = inverseSentence.indexOf(" ");
    const truncatedSentence = sentence.substring(0, sentence.length-firstSpace-1);
   return truncatedSentence;
};

const createAutocompletionList = (sentence:string) : string[] => {
    return new Array(6).fill(undefined).reduce((prev, _current) => {
        const prevSentence = prev[prev.length-1];
        const newSentence = executeDeleteWordLeft(prevSentence);
        if(newSentence !== prevSentence){
            return [...prev, newSentence];
        }
        return prev;
    },  [executeDeleteWordLeft(sentence)]);
};

interface NSpaceFinder {
    count : number;
    position: number
}

const getPositionOfNSpace = (sentence : string) => {
    const inverseSentence = [...sentence].reverse();
    const nSpaceFinder = inverseSentence.reduce((prev, char, index) => {
        if(char === " " && prev.count < AUTOCOMPLETION_ITEMS_LENGTH){
            return {position : index, count : prev.count + 1};
        }
        return prev;
    }, {count : 0, position : sentence.length} as NSpaceFinder);

    return sentence.length - nSpaceFinder.position;
};

export class DeletionProvider implements vscode.CompletionItemProvider {
   
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):vscode.CompletionItem[] | vscode.CompletionList {
        const line = document.lineAt(position.line);
        const cursorLine = position.line;
        const cursorChar = position.character;
        const sentence  = line.text;
        const nSpacePosition =  getPositionOfNSpace(sentence);
        const endOfSentence = sentence.substring(nSpacePosition, sentence.length);
        const propositions  = createAutocompletionList(endOfSentence);
        const deletionItems = propositions.map((text, index) => {
            const item  =  new vscode.CompletionItem(text, vscode.CompletionItemKind.Snippet);
            item.insertText = text;
            item.sortText = endOfSentence + index;
            item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(cursorLine,nSpacePosition,cursorLine,cursorChar))];
            return item;
        });
        return deletionItems;
    }

    resolveCompletionItem(item: vscode.CompletionItem, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        vscode.window.showInformationMessage("");
        currentSuggestion = item.label;
        return item;
      }
}
