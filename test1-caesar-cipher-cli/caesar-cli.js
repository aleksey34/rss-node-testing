import {Command} from "commander";
import Pipeline from "pipeline";

import fs from 'fs';

import minimist  from 'minimist';

const ar = minimist(process.argv.slice(2));
if(Object.keys(ar).length !== 5) {
  console.error("The args are not enough") ;
}


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

// if read path wrong - console
const itemR = args.find(i=>{
  return i['input'] ;
})
 const fileR = `${itemR.input}`;
 fs.access(fileR, fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) {
     process.stdin.pipe(handler.transformFile()).pipe(process.stdout);
  } else {

   
    const pipeline = Pipeline(
      handler.readFile() ,
      handler.transformFile() ,
      handler.writeFile()
);
pipeline.pipe(); 

  }
});


// if write path  wrong - cosole
    const itemW = args.find(i=>{
      return i['output'] ;
    })
     const fileWr = `${itemW.output}`;
     fs.access(fileWr, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
         process.stdin.pipe(handler.transformFile()).pipe(process.stdout);
      } else {

       
        const pipeline = Pipeline(
          handler.readFile() ,
          handler.transformFile() ,
          handler.writeFile()
    );
    pipeline.pipe(); 

      }
    });


//    process.stdin.pipe(upperCaseTr).pipe(process.stdout);

 

//   const pipeline = Pipeline(
//       handler.readFile() ,
//       handler.transformFile() ,
//       handler.writeFile()
// );
 
// pipeline.pipe();


   
  })
  .parse(process.argv);