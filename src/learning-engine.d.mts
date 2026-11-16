export type WordProgress={status:'learning'|'known';streak:number;due:number};
export type LearningProgress={version:number;words:Record<string,WordProgress>;grammar:string[]};
export const LEARNING_KEY:string;
export function emptyLearning():LearningProgress;
export function parseLearning(raw:string,wordIds:Set<string>,lessonIds:Set<string>):LearningProgress;
export function rateWord(previous:WordProgress|undefined,rating:'again'|'good'|'easy',now?:number):WordProgress;
export function matchesWord(word:{nl:string;meanings:string[];examples:string[]},query:string):boolean;
