const ml = require('ml-regression');
const csv = require('csvtojson');
const SLR = ml.SLR;
const readline = require('readline'); // For user prompt to allow predictions

const csvFilePath = 'advertising.csv'

let csvData = []; // parsed data
let X = []; // input
let y = []; // outputs

let regressionModel

csv().fromFile(csvFilePath)
.on('json', jsonObj => {
  csvData.push(jsonObj)
})
.on('done', () => {
  dressData(); // get data points from JSON objects
  performRegression();
});

const dressData = () => {
  csvData.forEach(row => {
    X.push(parseFloat(row.newspaper));
    y.push(parseFloat(row.sales));
  });
};

const performRegression = () => {
  regressionModel = new SLR(X, y);  // Train model
  console.log(regressionModel.toString(3));
  predictOutput();
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function predictOutput() {
  rl.question('Enter input X for prediction (Press CTRL+C to exit) : ', (answer) => {
      console.log(`At X = ${answer}, y =  ${regressionModel.predict(parseFloat(answer)).toFixed(2)}`);
      predictOutput();
  });
}