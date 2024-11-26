const fs = require('fs');
String.prototype.keyReverse = function () {
    let newString = "";
    for (let i = this.length - 1; i >= 0; i--)
        newString += this[i];
    return newString;
}

String.prototype.encrypt = function () {
    return (btoa(btoa(btoa(this.toString().keyReverse()))));
}

String.prototype.decrypt = function () {
    return (atob(atob(atob(this.toString())))).keyReverse();
}

try {
    const rawInput = fs.readFileSync("./utils/rawInput.txt", 'utf-8');
    const decryptedData = rawInput.decrypt()
    console.log("Raw input decrypted. Writing to file data.json");
    fs.writeFileSync("./utils/data.json", JSON.stringify(JSON.parse(decryptedData), null, 4), 'utf-8');
} catch (err) {
    console.error("File rawInput.txt not found!");
}
