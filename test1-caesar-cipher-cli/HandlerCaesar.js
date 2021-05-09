import fs from "fs";
import { Transform } from 'stream';

export default class HandlerCaesar{
  constructor(args){
  this.args = args;
  }


  encodeDecodeHandler( l,  shift,  haystack){
     return l.toUpperCase();
  }


  transformLetter(l , args ){
  
//data 
const haystackLowCase = 'abcdefghijklmnopqrstuvwxyz';
const haystackUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


// check low -upper and other symbol
let isLowCase = false;
let isUpperCase = false;
if(haystackLowCase.split('').includes(l)){
  isLowCase = true;
}else if(haystackUpperCase.split('').includes(l)){
isUpperCase = true;
}else return l;

    const shift = args.find(a=>{
      return  Object.keys(a)[0] === "shift"; 
    }).shift;

    // Start .    this is func for decode and encode letter  - 
 const encodeDecode = (l , shift , haystack)=>{
  // let shift = shift;
  const currentIndex = haystack.indexOf(l);


  if(Math.abs(shift)%26 === 0){
    return l;
  } else if(shift > 26){
    const count = Math.floor(shift / 26);
   shift = shift - (count * 26);
   
  }else if(shift < -26){
    const count = Math.floor(shift/ 26) +1 ;
   shift = shift - (count * 26);
  
  }


  // if  more 0
  if(shift > 0){
   const restToEnd = currentIndex + shift ;
   if(restToEnd < 26) {
     return haystack[restToEnd];
   }else{
     const fromStart = (currentIndex + shift)  - 26;
     return haystack[fromStart];
   }
   // if less 0
  } else{
    const restToStart = currentIndex + shift;
      if(restToStart >= 0){
        return haystack[restToStart];
      }else{
        const fromEnd = (currentIndex + shift)  + 26;
        return haystack[fromEnd];
      }
  }
};
// end 


    if(shift !== 0){
      return isLowCase ? encodeDecode(l , shift , haystackLowCase) :  encodeDecode(l , shift , haystackUpperCase) ;
    }else{
      console.error("Error - Change value of shift. Shift should not be 0");
      return false;
    }
  }
   

  // read file for transform
    readFile =()=>{
      const item = this.args.find(i=>{
        return i['input'] ;
      })
    const file = `${item.input}`;
     fs.access( file,fs.constants.F_OK | fs.constants.W_OK,  (e) => {
      ///console.log(e ? 'it exists' : 'no passwd!');
      if(e){
          return false;

      }
    });
      const rStream = fs.createReadStream(file , {highWaterMark: 10 });
      rStream.on('data' , chunk=>{
       
      })

      rStream.on('close' , ()=>{
        
      })

      rStream.on('error' , error=>{
        console.log(error.message);
      })
      return rStream;
    }


    // transform file -- for caesar 
    transformFile(){
    //  const transformChunck = this._transformChunk;
    const args = this.args;
    const transformLetter   = this.transformLetter;
    
      return new Transform({
        transform(chunk, encoding, callback) {
        // console.log(args)
          const chunkString = chunk.toString();
          let chunkArr =[];
          for(let i =0; i < chunkString.length; i++){
            // transform each letter is here
            chunkArr.push(transformLetter(chunkString[i] , args))
          }
          const data = chunkArr.join('');
          this.push(data );
          callback();
        }
      });
    }



    // write file after transform
    writeFile =()=>{
      const item = this.args.find(i=>{
        return i['output'] ;
      })
   
      const file = `${item.output}`;
    
      fs.access( file,fs.constants.F_OK | fs.constants.W_OK,  (e) => {
       if(e){
         return false;
       } 
    });
     return   fs.createWriteStream(file, {flags: 'a' , encoding: 'utf-8'}  );
    }


    
}
