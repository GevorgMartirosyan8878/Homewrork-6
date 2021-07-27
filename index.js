const fs = require('fs');
const path = require('path');
const gzip = require('zlib').createGzip();

let randomNum = getRandomNum(1000000).toString(); // getting random number
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']; // array that helps us to create uniq and random name

// generating random name for uniq folder
let randomName = [...randomNum]
    .map(item => +item)
    .map(letter => alphabet[letter])
    .join('');

// creating/setting initial path
const setPath = path.normalize(`${__dirname}/target/readAndZip`);

readAndZipFiles(setPath);

// main functional
async function readAndZipFiles(dir) {
    dir = path.normalize(dir);
    const files = await readFile(dir);
    const folderName = createFolderName(dir);
    fs.mkdir(folderName, (e) => {
        if (e) console.log(e.message)
    })

    files.forEach(item => {
        const actualDir = `${dir}/${item}`;
        const input = fs.createReadStream(actualDir);
        const output = fs.createWriteStream(`./target/${path.basename(folderName)}/${item}.zip`);

        input.pipe(gzip).pipe(output);
    })

}


function createFolderName(direction) {
    return path.normalize(`${path.dirname(direction)}/${randomName}`);
}

// read file
function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) return reject(err.message);
            resolve(data)
        })
    })
}

// generated random number for creating uniq folder name
function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}