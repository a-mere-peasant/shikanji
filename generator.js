const showdown = require("showdown");
const fs = require("fs");
const converter = new showdown.Converter();
const post_dir = "_posts";
const layout_dir = "_layouts";
const output_dir_name = "site";
const asset_dir = "assets";
const pages_dir = "_pages";
let post_layout;
make_site_dir(output_dir_name);
fs.readFile(layout_dir + "/" + "post.html", "utf-8", function(err, content) {
	if (err) {
		console.error("Error reading the file " + layout_dir + "/" + "post.html", err);
		process.exit(1);
	}
	post_layout = content;
});
fs.readdir(post_dir, function(err, files) {
	if (err) {
		console.error("Error reading the dir " + post_dir, err);
		process.exit(1);
	}
	files.forEach(function(file) {
		fs.readFile(post_dir + "/" + file, 'utf-8', function(err, content) {
			if (err) {
				console.error("Error reading the file " + post_dir + file, err);
				process.exit(1);
			}
			let output_html = converter.makeHtml(content);
			output_html = post_layout.replace("[%content%]", output_html);
			const out_filename = file.split(".")[0] + ".html";
			fs.writeFile(output_dir_name+ "/" + out_filename, output_html, function(err) {
				if (err) {
					console.error("Error writing the file " + output_dir_name + out_filename, err);
					process.exit(1);
				}}	
			);
		});
	});
});

function make_site_dir(output_dir_name){
if(fs.existsSync(output_dir_name)){
	fs.rmSync(output_dir_name,{recursive:true});
}
fs.mkdir(output_dir_name,function(err){
	if(err){
		console.error("Error creating directory",output_dir_name,err);
		process.exit(1);}
	copy_assets(output_dir_name);
	copy_pages(output_dir_name);
});}

function copy_assets(output_dir_name){
	fs.cp(asset_dir,output_dir_name+"/"+asset_dir,{recursive:true},function(err){
		if(err){
			console.error("Error copying assets",err);
			process.exit(1);
		}});
}

function copy_pages(output_dir_name){
	fs.cp(pages_dir,output_dir_name+"/"+pages_dir,{recursive:true},function(err){
		if(err){
			console.error("Error copying pages",err);
			process.exit(1);
		}});
}
