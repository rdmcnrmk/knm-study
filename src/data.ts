import book from './book.json';
import supplements from './supplements.json';
import {distractors} from './distractors';
export type Pair = {nl:string;en:string};
export type Question = Pair & {id:string;answer:Pair;page:number;topic:string;options:Pair[];correct:number;source:string;refs?:string[];explanation?:Pair;lessonId?:string};
export type Lesson = Pair & {id:string;title:string;page:number;refs?:string[];targets?:string[];checked?:string};
export const sources = [
 {title:'DUO · KNM exam format (45 minutes)',url:'https://www.inburgeren.nl/examen-doen/inhoud-kennisexamens.jsp'},
 {title:'DUO · Official practice exams',url:'https://www.inburgeren.nl/examen-doen/oefenen.jsp'},
 {title:'DUO · Exam updated, 1 July 2025',url:'https://inburgeren.nl/nieuwsberichten/artikel.jsp?cid=tcm%3A94-225285-16'},
 {title:'Rijksoverheid · July 2025 changes',url:'https://www.rijksoverheid.nl/actueel/nieuws/2025/06/30/inburgeringsexamen-vernieuwd-extra-aandacht-voor-zelfbeschikking-vrouwen-en-kennis-holocaust'},
 {title:'Official KNM attainment targets · effective July 2025',url:'https://zoek.officielebekendmakingen.nl/stcrt-2024-15802.html'}
];
const updates = {
 government:{title:'Zelfbeschikking / Self-determination',nl:'Vrouwen hebben zelfbeschikkingsrecht. Zij mogen zelf beslissen over hun leven, opleiding, werk en partner. Dwang en geweld zijn niet toegestaan. Gelijke rechten gelden voor iedereen.',en:'Women have the right to self-determination. They can make their own choices about their life, education, work and partner. Coercion and violence are prohibited. Equal rights apply to everyone.',page:0},
 history:{title:'De Holocaust / The Holocaust',nl:'De Holocaust was de systematische vervolging en moord op zes miljoen Joden door nazi-Duitsland en zijn helpers. Ook veel Nederlandse Joden werden vermoord. Antisemitisme en discriminatie zijn verboden.',en:'The Holocaust was the systematic persecution and murder of six million Jews by Nazi Germany and its collaborators. Many Dutch Jews were murdered. Antisemitism and discrimination are prohibited.',page:0}
};
export const topics = book.map(t=>({...t,lessons:[...t.lessons,...(t.id in updates?[updates[t.id as keyof typeof updates]]:[])].map((l,i):Lesson=>({...l,id:`${t.id}-${i}`})).concat(supplements.lessons.filter(l=>l.topic===t.id))}));
const extra = [
 {id:'government-update',topic:'government',nl:'Wat betekent het zelfbeschikkingsrecht van vrouwen?',en:'What does women’s right to self-determination mean?',answer:{nl:'Vrouwen bepalen zelf hun leven en keuzes.',en:'Women decide about their own lives and choices.'},page:0},
 {id:'history-update',topic:'history',nl:'Wat was de Holocaust?',en:'What was the Holocaust?',answer:{nl:'De systematische vervolging en moord op Joden door de nazi’s en hun helpers.',en:'The systematic persecution and murder of Jews by the Nazis and their collaborators.'},page:0}
];
export const questions:Question[] = [...topics.flatMap(t=>t.questions.map(q=>({...q,topic:t.id}))),...extra].map((q,i)=>{
 const wrong=distractors[q.id].map(s=>{const [nl,en]=s.split('|');return {nl,en};});
 const correct=i%3; const options=[...wrong]; options.splice(correct,0,q.answer);
 return {...q,options,correct,source:q.page?`Study book · p. ${q.page}. MCQ adaptation: generated practice.`:'July 2025 update · Rijksoverheid. Generated practice.'};
}).concat(supplements.questions.map((q,i)=>{const correct=i%3;const options=[...q.wrong];options.splice(correct,0,q.answer);return {...q,options,correct};}));
const terms:Record<string,string[][]> = {
 housing:[['woningcorporatie','housing association','Sociale huur / Social housing'],['huurcontract','rental agreement','Huur, borg en opzegtermijn / Rent, deposit and notice'],['hypotheek','mortgage','Lening voor een woning / Loan for a home'],['meterstand','meter reading','Meet energieverbruik / Measures energy use'],['GFT','organic waste','Groente, fruit en tuin / Vegetable, fruit and garden waste'],['notaris','civil-law notary','Juridische overdracht / Legal transfer']],
 work:[['vacature','job vacancy','Een beschikbare baan / An available job'],['arbeidscontract','employment contract','Werk en loon / Work and pay'],['bruto salaris','gross salary','Vóór inhoudingen / Before deductions'],['netto salaris','net salary','Wat je ontvangt / What you receive'],['bedrijfsarts','occupational physician','Gezondheid en werk / Health and work'],['cao','collective labour agreement','Collectieve arbeidsvoorwaarden / Collective employment conditions']],
 values:[['waarde','value','Een ideaal, zoals vrijheid / An ideal, such as freedom'],['norm','rule of conduct','Gedragsregel / A behavioural rule'],['vereniging','club or association','Samen een activiteit doen / Sharing an activity'],['buurthuis','community centre','Ontmoeten in de buurt / Meeting neighbours'],['gecondoleerd','my condolences','Bij een overlijden / After a death'],['Bevrijdingsdag','Liberation Day','5 mei / 5 May']],
 education:[['verloskundige','midwife','Zwangerschap en bevalling / Pregnancy and birth'],['consultatiebureau','child health clinic','Ontwikkeling van jonge kinderen / Young children’s development'],['basisschool','primary school','Primair onderwijs / Primary education'],['leerplicht','compulsory education','Verplichte schoolgang / Mandatory school attendance'],['kinderbijslag','child benefit','Uitgevoerd door SVB / Administered by SVB'],['studiefinanciering','student finance','Geregeld door DUO / Arranged through DUO']],
 health:[['huisarts','general practitioner','Eerste aanspreekpunt / First point of contact'],['verwijzing','referral','Van huisarts naar specialist / From GP to specialist'],['apotheek','pharmacy','Medicijnen / Medicines'],['zorgverzekering','health insurance','Verzekering voor zorg / Insurance for healthcare'],['eigen risico','deductible','Zelf te betalen deel / Amount paid by you'],['zorgtoeslag','healthcare allowance','Bijdrage onder voorwaarden / Support subject to conditions']],
 institutions:[['gemeente','municipality','Lokale overheid / Local government'],['BRP','Personal Records Database','Registratie van inwoners / Registration of residents'],['DigiD','digital identity','Persoonlijke online toegang / Personal online access'],['bezwaar','formal objection','Reageer binnen de termijn / Respond before the deadline'],['UWV','Employee Insurance Agency','Onder meer WW / Including unemployment benefit'],['Juridisch Loket','Legal Services Counter','Juridische informatie / Legal information']],
 government:[['Grondwet','Constitution','Grondrechten / Fundamental rights'],['parlement','parliament','Eerste en Tweede Kamer / Senate and House'],['kabinet','cabinet','Ministers en staatssecretarissen / Ministers and state secretaries'],['waterschap','water authority','Dijken en waterpeil / Dikes and water levels'],['verkiezingen','elections','Vertegenwoordigers kiezen / Choosing representatives'],['zelfbeschikking','self-determination','Zelf keuzes maken / Making your own choices']],
 history:[['Deltawerken','Delta Works','Bescherming tegen water / Flood defences'],['polder','reclaimed land','Drooggelegd gebied / Drained land'],['Randstad','Randstad','Amsterdam, Rotterdam, Den Haag, Utrecht'],['verzet','resistance','Tegen de nazi-bezetting / Against Nazi occupation'],['Holocaust','Holocaust','Vervolging en moord op Joden / Persecution and murder of Jews'],['vervoersbewijs','travel ticket','Geldig voor de reis / Valid for the journey']]
};
export const vocabulary=Object.entries(terms).flatMap(([topic,rows])=>rows.map(([nl,en,context],i)=>({id:`${topic}-v${i}`,topic,nl,en,context}))).concat(supplements.vocabulary);

export const lessonTotal=topics.reduce((n,t)=>n+t.lessons.length,0);
export const researchSources=[...new Set(supplements.lessons.flatMap(l=>l.refs))];
