//let canvas = document.getElementById("draw");


const fileInput = document.getElementById('csv');
const xSelect = document.getElementById("xSelect");
const ySelect = document.getElementById("ySelect");
let varNames = [];
let xDatas = [];
let yDatas = [];
let allLoaded = false
let count = 0
let headerRows = 1

class Columns {
    constructor(varNames) {
        this.varNames = varNames;
        this.valueSet = {};
        varNames.forEach(varName => {
            this.valueSet[varName] = [];
        });
    }
    addValues(values) {
        for (i = 0; i < this.varNames.length; i++) {
            this.valueSet[varNames[i]].push(values[i].slice(headerRows + 1).map(Number));
        }
    }
    getValueSet() {
        return this.valueSet;
    }
    getVarNames() {
        return this.varNames;
    }
}

let headerInput = document.getElementById('header');
headerInput.addEventListener('onchange', () => {headerRows = headerInput.value});

var column;
const readFile = () => {
    file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        varNames = []
        dataStr = reader.result;
        dataMatrix = str2matrix(dataStr);
        flipped = dataMatrix[0].map((_, colIndex) => dataMatrix.map(row => row[colIndex]));
        flipped.forEach(column => {
            varNames.push(column[0]);
        });
            
        column = new Columns(varNames);

        let options = column.getVarNames();

        removeOptions(xSelect)
        removeOptions(ySelect)
        
        for (i=0; i < options.length; i++) {
            let xNode = document.createElement('option');
            xNode.setAttribute('value', options[i]);
            xNode.innerHTML = options[i];

            let yNode = document.createElement('option');
            yNode.setAttribute('value', options[i]);
            yNode.innerHTML = options[i];
            xSelect.appendChild(xNode);
            ySelect.appendChild(yNode);
        }
        console.log(flipped)
        column.addValues(flipped);

        const selections = document.getElementById("selections");
        selections.style.display = "block";
    }
  reader.readAsBinaryString(file);
}
fileInput.addEventListener('change', readFile);


function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }

 
/**
 * 
 * @param {*} x not telling (i like ice cream)
 * @param {*} y idk (REEEEE)
 */
function showGraph(x,y) {
    xDatas = [];
    yDatas = [];

    xDatas = column.getValueSet()[x];
    y.forEach((yVal) => {
        yDatas.push(column.getValueSet()[yVal]);

    });
    plotData(xDatas,yDatas,y);        
}

function graphGen() {
    let allSelected = [];
    let options = ySelect.getElementsByTagName("option");
    for(i = 0; i < options.length; i++) {
        if(options[i].selected)
            allSelected.push(options[i].value)
    }
    /*options.forEach(option => {
        if (option.selected) {
            allSelected.push(option);
        }
    });*/
    showGraph(xSelect.value, allSelected);
}



function str2matrix(dataStr){
    dataArr = dataStr.split("\n");
    for (i = 0; i < dataArr.length; i++) {
        dataArr[i] = dataArr[i].split(",");
    }
    return dataArr; //[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function plotData(xData, yData, names) {
    var data = [];
    
    for (i = 0; i < yData.length; i++) {
        data.push({
            x: xData[0],
            y: yData[0][i],
            name: names[i],
            opacity: 0.5,
            mode: "markers",
            type: "scatter"
        });
    }
    Plotly.newPlot("scatter", data);
}















//function 
/*

>>>>,[>,]<[<]> 0 0 _i_nput
remove commas from input & replace with spaces : 
[
    <++++ ++++ [>-----<-] > ---- 0 0 0 _(i minus comma)_nput
    [[<+>-] ++++ ++++ [<+++++>-] < ++++ >] 0 i _0_ nput
    >
] 0 0 0 inputNoCommas 0 _0_
<<[[<]<]>> 0 0 _i_nputNoCommas
replace new lines with two spaces (erroneously only does one): 
[[
    ---- ---- -- 0 0 _(i minus new line)_nput
    [[<<+>>-] << ++++ ++++ ++ >>] 0 i _0_ nput
    >
]>] 0 inputNoCommasOrNewLines 0 0 0 _0_
*/