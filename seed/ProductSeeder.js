
var dbconfig=require('../dbconfig/db-connect');
dbconfig.connect(function (error) {
    if(error)
    {
        console.log("db unable to connect");
        process.exit(1);

    }
    else{
        console.log("connect Successfully....");
        dbconfig.get().collection('product').insertMany([
    {
    imagePath:"https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title:"gothic",
        description:"the best game ever",
        price:10
    }
    ,
        {
            imagePath:"https://upload.wikimedia.org/wikipedia/commons/8/85/Ludo-1.jpg",
            title:"ludo",
            description:"the best simulation game ever",
            price:9
        }
   ,
        {
            imagePath:"https://upload.wikimedia.org/wikipedia/en/3/3d/PlayerUnknown%27s_Battlegrounds_Steam_Logo.jpg",
            title:"pubg",
            description:"the best shooting game ever",
            price:16
        },
        {
            imagePath:"https://upload.wikimedia.org/wikipedia/en/2/21/FIFA_20_Standard_Edition_Cover.jpg",
            title:"fifa 20",
            description:"the best football game ever",
            price:11
        },


])
    }

});