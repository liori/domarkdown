require('coffee-script/register');
var LineReaderSync = require('line-reader-sync');
var wsd = require('websequencediagrams');
var fs = require('fs');
var sync = require('sync');
var crypto = require('crypto');

var filenames = process.argv.slice(2);
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
			var hash = crypto.createHash('md5').update(diagram).digest('hex');
			var filename = 'diagram-' + hash + '.png';
			if (!fs.existsSync(filename)) {
				var working = true;
				wsd.diagram(diagram, 'modern-blue', 'png', function(er, buf, typ) {
					if (er) {
						console.error(er);
					} else {
						fs.writeFile(filename, buf);
					}
					working = false;
				});
				while(working) {require('deasync').sleep(100);}
			}
			console.log('![](' + filename + ')');
		} else {
			console.log(line);
		}
	}
});
