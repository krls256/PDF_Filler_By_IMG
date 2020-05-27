const PDF = require('pdfkit');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');;
const settings = require('./settings.json')
const DOC = new PDF({margin: 0});



DOC.pipe(fs.createWriteStream(`${settings.outputDir}${settings.fileName}.pdf`));   
const filler = () => {
    const a =  fs.readdirSync('./compressed');
    a.forEach(path => {
        DOC.image(`./compressed/${path}`, {
            fit: [750, 810],
            align: 'left',
            valign: 'center'
          }).addPage();
          fs.unlinkSync(`./compressed/${path}`)
    })
    console.log('Done!')
}
 
(async () => {
    await imagemin([`${settings.inputDir}/*.jpg`], {
        destination: './compressed',
        plugins: [
            imageminMozjpeg({quality: settings.quality})
        ]
    });
    console.log('Compressed!');
    filler();
    DOC.end();
    fs.rmdirSync('./compressed/')
})();

console.log('Wait!')