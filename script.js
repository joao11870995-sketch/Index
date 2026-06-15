dados.forEach(item=>{
item.atraso=item.reais-item.prazo;
item.status=item.reais>item.prazo?"Atrasada":"No Prazo";
});

const atrasadas=dados.filter(x=>x.status==="Atrasada");

document.getElementById("atrasadas").innerHTML=atrasadas.length;
document.getElementById("total").innerHTML=dados.length;

document.getElementById("taxa").innerHTML=
((atrasadas.length/dados.length)*100).toFixed(1)+"%";

let critica=
dados.sort((a,b)=>b.atraso-a.atraso)[0];

document.getElementById("critica").innerHTML=
"ID "+critica.id+" ("+critica.atraso+" dias)";

function carregarTabela(filtro="Todos"){

let tabela=document.getElementById("tabela");

tabela.innerHTML="";

dados
.filter(d=>filtro==="Todos"||d.transportadora===filtro)
.forEach(item=>{

let classe="";

if(item.atraso>=5){
classe="critico";
}
else if(item.status==="Atrasada"){
classe="atrasada";
}

tabela.innerHTML+=`
<tr class="${classe}">
<td>${item.id}</td>
<td>${item.transportadora}</td>
<td>${item.regiao}</td>
<td>${item.prazo}</td>
<td>${item.reais}</td>
<td>${item.status}</td>
</tr>
`;

});

}

carregarTabela();

document
.getElementById("filtroTransportadora")
.addEventListener("change",(e)=>{
carregarTabela(e.target.value);
});

const transportadoras=[
"RotaMax",
"ViaCargo",
"FlashLog"
];

const atrasosTransportadora=
transportadoras.map(t=>
dados.filter(x=>
x.transportadora===t &&
x.status==="Atrasada"
).length
);

new Chart(
document.getElementById("graficoTransportadora"),
{
type:"bar",
data:{
labels:transportadoras,
datasets:[{
label:"Entregas Atrasadas",
data:atrasosTransportadora
}]
},
options:{
scales:{
y:{
beginAtZero:true,
max:7,
ticks:{
stepSize:1
}
}
}
}
}
);

const regioes=[
...new Set(
dados.map(x=>x.regiao)
)
];

const atrasosRegiao=
regioes.map(r=>
dados.filter(x=>
x.regiao===r &&
x.status==="Atrasada"
).length
);

new Chart(
document.getElementById("graficoRegiao"),
{
type:"pie",
data:{
labels:regioes,
datasets:[{
label:"Atrasos",
data:atrasosRegiao
}]
},
options:{
plugins:{
title:{
display:true,
text:"Análise de Atrasos por Região"
}
}
}
}
);

let ranking=
document.getElementById("ranking");

const rankingDados=
transportadoras
.map(t=>{

let total=
dados
.filter(x=>x.transportadora===t)
.reduce((s,x)=>s+x.atraso,0);

return{
transportadora:t,
atraso:total
};

})
.sort((a,b)=>b.atraso-a.atraso);

rankingDados.forEach(item=>{

ranking.innerHTML+=`
<li>
${item.transportadora}
- ${item.atraso}
dias acumulados de atraso
</li>
`;

});