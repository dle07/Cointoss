import LRU from 'lru-cache'
let instance;

const options = {  // Paramater Configuration for LRUCache
    maxSize: 30,
    ttl: (1000 * 60) *60 * 1,  // time to live in miliseconds
    //  60 Seconds     (minutes) ( hours)
};
let cache = new LRU(options);

class Cache{
    constructor(){
        if(instance){
            throw new Error("You can only create one instance!");
        }
        instance = this
    }
    getInstance(){
        return this
    }
    get = (ticker) => {
        return cache.get(ticker)
    }
    set = (ticker, pred) => {
        cache.set(ticker,pred)
    }
    has = (ticker) =>{
        return cache.has(ticker)
    }
    print = () =>{
        
        console.log(cache)
    }
}



const SingletonCache = Object.freeze(new Cache());
export default SingletonCache;
