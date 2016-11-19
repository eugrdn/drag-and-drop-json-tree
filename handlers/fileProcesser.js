var fs = require('fs');
var jsonfile = require('jsonfile');
var file = './users_data/treeJson.json';

exports.saveFile = function (req, res) {
    var transfer = req.body.json;
    var options = {
        spaces: 4
    };

    jsonfile.writeFile(file, transfer, options, function (err) {
        if (err)
            console.error(err);
    });

    return res.send({
        status: 200
    });
}

exports.readFile = function (req, res) {

    jsonfile.readFile(file, function (err, object) {

        if (err) 
            return res.status(404).send('Sorry, we cannot find that file!');

        return res.status(200).json(object);
    });
}