const mysql=require("mysql");

const conexion=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"myApp",
    multipleStatements: true,
});

conexion.connect((err)=>{
    if(err){
        console.error(err);
        return;
    }else{
        console.log("se ha conectado!!!");
    }
})

module.exports=conexion;