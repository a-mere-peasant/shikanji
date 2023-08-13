const showdown = require("showdown");
const fs = require("fs");
const converter = new showdown.Converter();
const post_dir = "_posts";
const layout_dir = "_layouts";
const output_dir_name = "site";
const asset_dir = "assets";
const pages_dir = "_pages";
const header_file_path = "_layouts/header.html"
const header = get_file_content(header_file_path); 
const post_layout = get_file_content(layout_dir+"/post.html");
const externals = get_file_content(layout_dir+"/externals.html");
const footer = get_file_content(layout_dir+"/footer.html");

make_site_dir(output_dir_name);
build_site_posts();

async function build_site_posts(){
await fs.promises.mkdir(output_dir_name+"/"+post_dir);
	const post_output_dir = output_dir_name+"/"+post_dir;
fs.readdir(post_dir, function(err, files) {
	if (err) {
		console.error("Error reading the dir " + post_dir, err);
		process.exit(1);
	}
	files.forEach(function(file) {
		fs.readFile(post_dir + "/" + file, 'utf-8', function(err, content) {
			if (err) {
				console.error("Error reading the file ",post_dir+"/"+ file, err);
				process.exit(1);
			}
			let post_base = post_layout.replace("[%externals%]",externals);
			post_base = post_base.replace("[%header%]",header);
			post_base = post_base.replace("[%footer%]",footer);
			let output_html = converter.makeHtml(content);
			output_html = post_base.replace("[%content%]", output_html);
			const out_filename = file.split(".")[0] + ".html";
			fs.writeFile(post_output_dir+ "/" + out_filename, output_html, function(err) {
				if (err) {
					console.error("Error writing the file", output_dir_name+"/"+ out_filename, err);
					process.exit(1);
				}}	
			);
		});
	});
});
}


async function make_site_dir(output_dir_name){
	if(fs.existsSync(output_dir_name)){
		fs.rmSync(output_dir_name,{recursive:true});
	}
	try{
	fs.promises.mkdir(output_dir_name)
	await	copy_to_output_dir(pages_dir);
		copy_to_output_dir(asset_dir);
		add_base_content(output_dir_name+"/"+pages_dir+"/homepage.html");
	}catch(err){
		console.error("Error while making output directory",err);
	}}


async function copy_to_output_dir(dir_name){
	try{
		await fs.promises.cp(dir_name,output_dir_name+"/"+dir_name,{recursive:true});
		console.log("Copied",dir_name,"to output directory");
	}catch(err){
		console.error("Error in copying ${dir_name} to output directory",err);
		process.exit(1);
	}}

function get_file_content(filepath){
	try{
		return fs.readFileSync(filepath,"utf-8");
	}catch(err){
		console.error("Error while reading file:",filepath,err);
	}}

function add_base_content(file){
	fs.readFile(file,"utf-8",function(err,content){
		if(err){
			console.log("Error while reading file:",file,err);
			process.exit(1);
		}
		content = content.replace("[%externals%]",externals);
		content = content.replace("[%header%]",header);
		content = content.replace("[%footer%]",footer);
		fs.writeFile(file,content,function(err){
			if(err){
				console.error("Error while writing file:",file,err);
				process.exit(1);
			}});
		});
}

