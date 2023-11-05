const mongoClient=require('mongodb').MongoClient;
const state={
    db:null
};

module.exports.connect=function(done){
    // const url="mongodb://localhost:27017";
    const url='mongodb+srv://athul:asbupsilonno1@cluster0.223ob.mongodb.net';

    const dbname='expensetracker';
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err);
        state.db=data.db(dbname);
        done();
    })
}

module.exports.get=function(){
    return state.db ;
}