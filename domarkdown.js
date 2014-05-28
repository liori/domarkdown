require('coffee-script/register');
var LineReaderSync = require('line-reader-sync');
var wsd = require('websequencediagrams');
var fs = require('fs');
var sync = require('sync');

var filenames = process.argv.slice(2);
var image_number = 0;
filenames.forEach(function (filename) {
	handle = new LineReaderSync(filename);
	while(true) {
		var line = handle.readline();
		if (line===null) {
			break;
		} else if (/^```seqdiag/.test(line)) {
			var diagram = '';
			while(true) {
				var line = handle.readline();
				if (line===null) {
					break;
				} else if (/^```/.test(line)) {
					break;
				} else {
					diagram = diagram + line + '\n';
				}
			}
			var working = true;
			wsd.diagram(diagram, 'modern-blue', 'png', function(er, buf, typ) {
				if (er) {
					console.error(er);
				} else {
					fs.writeFile("diagram" + image_number + ".png", buf);
					console.log('![](diagram' + image_number + '.png)');
					image_number++;
				}
				working = false;
			});
			while(working) {require('deasync').sleep(100);}
		} else {
			console.log(line);
		}
	}
});
