const fs = require('fs');
const content = fs.readFileSync('/home/lg/lab/luisguilher.me/src/reducers/FileReducer.tsx', 'utf8');
const initialContentMatch = content.match(/const initialFlatState: FileType\[\] = \[([\s\S]*?)\]/);
console.log(initialContentMatch ? 'Found initial state' : 'Not found');
