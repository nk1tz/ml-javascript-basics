const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');

let knn;

const csvFilePath = 'irisdata.csv';

let seperationSize; // To seperate training and test data

let data = [];
let X = [];
let y = [];

let trainingSetX = [];
let trainingSetY = [];
let testSetX = [];
let testSetY = [];

csv().fromFile(csvFilePath)
.on('json', jsonObj => {
  data.push(jsonObj);
})
.on('done', error => {
  seperationSize = 0.7 * data.length;
  data = shuffleArray(data);
  dressData();
})

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

const dressData = () => {
  /**
   * There are three different types of Iris flowers
   * that this dataset classifies.
   *
   * 1. Iris Setosa (Iris-setosa)
   * 2. Iris Versicolor (Iris-versicolor)
   * 3. Iris Virginica (Iris-virginica)
   *
   * We are going to change these classes from Strings to numbers.
   * Such that, a value of type equal to
   * 0 would mean setosa,
   * 1 would mean versicolor, and
   * 3 would mean virginica
   */

   let types = new Set();
   data.forEach(row => types.add(row.type));
   const typesArray = [...types];

  data.forEach((row) => {
    let rowArray, typeNumber;

    rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);

    typeNumber = typesArray.indexOf(row.type); // Convert type(String) to type(Number)

    X.push(rowArray);
    y.push(typeNumber);
  });

  trainingSetX = X.slice(0, seperationSize);
  trainingSetY = y.slice(0, seperationSize);
  testSetX = X.slice(seperationSize);
  testSetY = y.slice(seperationSize);

  train();

}

const train = () => {
  knn = new KNN(trainingSetX, trainingSetY, {k: 7});
  test();
}

const test = () => {
  const result = knn.predict(testSetX);
  const testSetLength = testSetX.length;
  const predictionError = error(result, testSetY);
  console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
  predict();
}

const error = (predicted, expected) =>
  predicted.reduce((acc, pred, i) => pred !== expected[i] ? acc++ : acc);

function predict() {
  let temp = [];
  prompt.start();

  prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function (err, result) {
    if (!err) {
      for (var key in result) {
        temp.push(parseFloat(result[key]));
      }
      console.log(`With ${temp} -- type =  ${knn.predict(temp)}`);
    }
  });
}