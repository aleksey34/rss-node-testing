import {Transform} from "stream";
export default class TransformCaesar extends Transform{

    constructor(){
        super();
    }

    _transform(chunk, enc , done){


        console.log(chunk);
        this.push(chunk)
        done()
    }


}