import * as vscode from 'vscode';

const AUTOCOMPLETION_ITEMS_LENGTH = 6;

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

const getFinalWord = (sentence:string):string => {
    const splitSentence  = sentence.split(" ");
    return splitSentence[splitSentence.length-1];
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
        const lastWordWrite = getFinalWord(sentence);
        const deletionItems = propositions.map((text, index) => {
            const item  =  new vscode.CompletionItem(text, vscode.CompletionItemKind.Snippet);
            item.filterText = lastWordWrite;
            item.sortText = lastWordWrite + index;
            item.insertText = text;
            item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(cursorLine,nSpacePosition + lastWordWrite.length,cursorLine,cursorChar))];
            return item;
        });
        return deletionItems;
    }
}
