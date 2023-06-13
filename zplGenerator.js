var fs = require('fs');
var request = require('request');

let ownerZPL;
let goldZPL;
let silverZPL;

const zplString = (samples, owner) => {
    const result = samples.find(item => item.owner == owner)
    let zpl = '';
    if (result != undefined) {
        ownerZPL = result.owner;
        goldZPL = result.gold;
        silverZPL = result.silver;
        zpl = `^XA^FO10,8^GB1150,590,2^FS^FO65,52^AN,25,26^FDCapstone Presentation^FS^FO800,52^AN,25,26^FDJUN-2023^FS^FO430,100^AN,22,22^FDJose David Rodriguez^FS^FO82,182^A0,44,44^FDPlayer: ${ownerZPL}^FS^FO82,252^A0,44,46^FDOres:^FS^FO55,30^GB1050,98,2^FS^FO190,320^A0,50,40^FDGold: ${goldZPL}^FS^FO190,395^A0,50,40^FDSilver: ${silverZPL}^FS^FO100,530^A0,24,30^FDThanks!^FS^XZ`;
    } else {
        ownerZPL = 'Not Found';
        goldZPL = 'Not Found';
        silverZPL = 'Not Found';
        zpl = `^XA^FO10,8^GB1150,590,2^FS^FO65,52^AN,25,26^FDCapstone Presentation^FS^FO800,52^AN,25,26^FDJUN-2023^FS^FO430,100^AN,22,22^FDJose David Rodriguez^FS^FO82,182^A0,44,44^FDPlayer: ${ownerZPL}^FS^FO82,252^A0,44,46^FDOres:^FS^FO55,30^GB1050,98,2^FS^FO190,320^A0,50,40^FDGold: ${goldZPL}^FS^FO190,395^A0,50,40^FDSilver: ${silverZPL}^FS^FO100,530^A0,24,30^FDThanks!^FS^XZ`;
    }
    
    return zpl;
}

const zplPdfRequest = (samples, owner) => {
    const zpl = zplString(samples, owner);
    var options = {
        encoding: null,
        formData: { file: zplString(samples, owner) },
        // omit this line to get PNG images back
        //headers: { 'Accept': 'application/pdf' },
        // adjust print density (8dpmm), label width (4 inches), label height (6 inches), and label index (0) as necessary
        url: 'http://api.labelary.com/v1/printers/12dpmm/labels/4x6/0/'
    };
    
    request.post(options, function(err, resp, body) {
        if (err) {
            return console.log(err);
        }
        var filename = `${owner}.png`; // change file name for PNG images
        fs.writeFile(`./labels/`+filename, body, function(err) {
            if (err) {
                return 'Error';
            } else {
                return filename;
            }
        });
        
    });
}



module.exports = {
    zplPdfRequest
}

