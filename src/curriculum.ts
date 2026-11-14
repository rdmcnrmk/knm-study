import {topics} from './data';
// All numbered knowledge targets in the official July 2025 annex.
// Mapping is at knowledge-target level, not a claim of exhaustive sub-indicator coverage.
const groups:[string,string,string[]][]=[
 ['work','1.1',['Werk en voorbereiding / Work preparation','Vacatures en solliciteren / Vacancies and applications','Kansen op werk / Employment opportunities','Diplomawaardering / Credential evaluation','Bijscholing / Further training','Vaardigheden voor werk / Job skills','UWV en gemeente / UWV and municipality','Rechten en plichten bij uitkeringen / Benefit rights and duties']],
 ['work','1.2',['Contract en voorwaarden / Employment conditions','Medezeggenschap en vakbond / Worker representation','Looninhoudingen / Salary deductions']],
 ['work','1.3',['Discriminatie op het werk / Workplace discrimination']],['work','1.4',['Een bedrijf beginnen / Starting a business']],
 ['values','2.1',['Verschillende gewoonten / Different customs','Direct communiceren / Direct communication','Afspraken / Appointments','Samenlevingsvormen / Relationship arrangements','Feest- en gedenkdagen / Holidays and remembrance']],
 ['values','2.2',['Netwerken en verenigingen / Networks and clubs','Familiegebeurtenissen / Family occasions']],
 ['housing','3.1',['Eerste huisvesting en contract / Initial housing and contracts','Huurdersrechten / Tenant rights','Woning zoeken / Housing search']],
 ['housing','3.2',['Aansluitingen regelen / Arranging utilities','Verbruik en tarieven / Usage and tariffs']],['housing','3.3',['Afval scheiden / Separating waste']],
 ['health','4.1',['Huisarts en praktijkondersteuner / GP and practice support','Apotheek / Pharmacy','Tandarts / Dentist','Geboortezorg / Maternity and birth care']],
 ['health','4.2',['Verwijzing / Referral']],['health','4.3',['Huisartsenpost / Out-of-hours GP','Levensgevaar / Life-threatening emergencies']],
 ['health','4.4',['Verzekering en zorgkosten / Insurance and care costs','Declareren / Claims','Digitale zorgadministratie / Digital care administration','DigiD en ondersteuning / DigiD and support']],['health','4.5',['Welzijn en preventie / Welfare and prevention']],
 ['history','5.1',['Historisch erfgoed / Historical heritage','Recente geschiedenis / Recent history']],['history','5.2',['Plaatsen, provincies en regio / Places, provinces and region','Openbaar vervoer / Public transport']],
 ['institutions','6.1',['Digitaal overheidscontact / Digital government contact','Andere hulporganisaties / Other support organisations']],
 ['institutions','6.2',['BRP en gezinswijzigingen / BRP and household changes','Officiële documenten / Official documents','Verblijfsrecht en naturalisatie / Residence and naturalisation','Gemeentelijke taken / Municipal responsibilities']],
 ['institutions','6.3',['Loonstrook en jaaropgave / Payslip and annual statement','Belastingaangifte / Tax returns','Toeslagen en kinderbijslag / Allowances and child benefit']],
 ['institutions','6.4',['Politie en identificatie / Police and identification']],['institutions','6.5',['Klachten en ombudsman / Complaints and ombudsman','Juridische hulp / Legal assistance']],['institutions','6.6',['Verzekeringen / Insurance']],
 ['government','7.1',['Bestuur en actuele namen / Government and current officeholders','Europese Unie / European Union','Scheiding der machten / Separation of powers','Stemrecht / Voting rights']],
 ['government','7.2',['Gelijkheid vrouwen en mannen / Equality of women and men','Meningsuiting / Freedom of expression','Godsdienst / Religion','Gelijke behandeling / Equal treatment','Privacy / Privacy','Lichamelijke integriteit / Bodily integrity','Orgaandonatie / Organ donation','Zelfbeschikking van vrouwen / Women’s self-determination']],
 ['education','8.1',['Schoolstelsel en ondersteuning / School system and support','Vrijheid van onderwijs / Freedom of education','Leer- en kwalificatieplicht / Attendance and qualification duty','Voorschool en opvang / Preschool and childcare','Seksualiteit en diversiteit / Sexuality and diversity']],
 ['education','8.2',['Verantwoordelijkheid ouders / Parental responsibility','Betrokkenheid bij school / School involvement','Opvoedhulp en veiligheid / Parenting support and safety']],
 ['education','8.3',['Onderwijskosten / Education costs','Vergoedingen / Financial support','DUO / DUO']]
];
const fallback:Record<string,string[]>={
 '1.2.1':['work-2'],'1.2.3':['work-3'],'2.2.2':['values-4'],
 '4.1.3':['health-1'],'4.1.4':['education-0'],'6.6.1':['housing-detail-insurance'],
 '7.1.1':['government-2','government-3'],'7.1.3':['government-1'],
 '5.1.1':['history-0'],'5.1.2':['history-1','history-5'],'5.2.1':['history-3'],
 '6.2.4':['institutions-0'],'6.3.1':['work-3'],'8.1.1':['education-1']
};
export const curriculum=groups.flatMap(([topic,prefix,titles])=>titles.map((title,i)=>{
 const id=`${prefix}.${i+1}`;
 const matches=topics.flatMap(t=>t.lessons.filter(l=>l.targets?.includes(id)).map(l=>({topic:t.id,lessonId:l.id,title:l.title})));
 for(const base of fallback[id]||[]){const t=topics.find(t=>t.lessons.some(l=>l.id===base));const l=t?.lessons.find(l=>l.id===base);if(t&&l)matches.push({topic:t.id,lessonId:l.id,title:l.title});}
 return {id,topic,nl:title.split(' / ')[0],en:title.split(' / ')[1],lessons:matches};
}));
export const provinces=[
 {name:'Groningen',region:'Noordoost / Northeast',example:'Groningen',x:4,y:0},
 {name:'Fryslân / Friesland',region:'Noord / North',example:'Leeuwarden',x:2,y:0},
 {name:'Drenthe',region:'Noordoost / Northeast',example:'Assen',x:4,y:1},
 {name:'Noord-Holland',region:'Noordwest / Northwest',example:'Amsterdam, Haarlem',x:1,y:2},
 {name:'Flevoland',region:'Midden / Centre',example:'Almere, Lelystad',x:3,y:2},
 {name:'Overijssel',region:'Oost / East',example:'Zwolle, Enschede',x:4,y:2},
 {name:'Utrecht',region:'Midden / Centre',example:'Utrecht',x:2,y:3},
 {name:'Gelderland',region:'Oost / East',example:'Arnhem, Nijmegen',x:4,y:3},
 {name:'Zuid-Holland',region:'West / West',example:'Den Haag, Rotterdam',x:1,y:4},
 {name:'Zeeland',region:'Zuidwest / Southwest',example:'Middelburg',x:0,y:5},
 {name:'Noord-Brabant',region:'Zuid / South',example:'Eindhoven, Breda',x:3,y:5},
 {name:'Limburg',region:'Zuidoost / Southeast',example:'Maastricht, Venlo',x:4,y:6}
];
