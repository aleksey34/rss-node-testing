import {Command} from "commander";
import Pipeline from "pipeline";

import fs from 'fs';

// import minimist  from 'minimist'
// const ar = minimist(process.argv.slice(2));
// console.log(ar);


import HandlerCaesar from "./HandlerCaesar.js";

const program = new Command();

program
.version('0.0.1')
.description("Program - Caesar CLI")
.usage('[options] <file>')
.name("caesar-cli")
   
program
  .option('-a, --action', 'encode or decode')
  .option('-s, --shift', 'offset encode-decode' )
  .option('-i, --input', 'input text')
  .option('-o, --output', 'output text')
  .action((file, options) => {
  let args = [];
    Object.keys(file).forEach((key , index)=>{
      if(file[key]){
        if(key === "shift"){
          const num = Number(program.args[index]) ;
          if(num === NaN){
            console.error("Error - Shift should be integer, try again");
            return;
          }
          args.push({shift:num });
        }else{
           args.push({[key]:program.args[index]});
        }
       
      }   
    })
    const {action} = args.find( it=>{
      return Object.keys(it)[0] === "action";
    })
    
    if(action !== "encode" && action !== "decode"){
      console.log("Error - Action should be encode or decode"); return;
    }
    if(action === "decode"){
      args = args.map( item=>{
        if(Object.keys(item)[0] === "shift"){
          return {shift: -1 * item['shift']};
        }else{
          return item;
        }
      })
    }

const handler = new HandlerCaesar(args);


    const item = args.find(i=>{
      return i['output'] ;
    })
     const fileWr = `${item.output}`;

    //  fs.existsSync(fileWr , e=>{
    //    if(e){
    //       fs.unlink(fileWr);
    //    }
    //  })
      
     
// try {
//   if (fs.existsSync({path:fileWr , fill: false})) {
//     //file exists
//   }
// } catch(err) {
//   handler.readFile().pipe( handler.transformFile()).pipe(process.stdout);

// }

// Getting information for a file
// fs.stat( fileWr, { bigint: true }, (error, stats) => {
  // if (error) {
  //   console.log(error);
  // }
  // else {
  //   console.log("Stats object for: example_file.txt");
  //   console.log(stats);
  
    // Using methods of the Stats object
 //   console.log("Path is file:", stats.isFile());
  //  console.log("Path is directory:", stats.isDirectory());
//   }
// });

// console.log(fs.stat(fileWr))
//     fs.access( fileWr,fs.constants.F_OK,  (e) => {
     
//       if(e){
//         handler.readFile().pipe( handler.transformFile()).pipe(process.stdout);
//       } 
//     });
//    process.stdin.pipe(upperCaseTr).pipe(process.stdout);

  

  const pipeline = Pipeline(
      handler.readFile() ,
      handler.transformFile() ,
      handler.writeFile()
);
 
pipeline.pipe();


   
  })
  .parse(process.argv);