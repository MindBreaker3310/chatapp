
var msg=(id,text)=>{
  return {from:id,
    text:text,
    createdAt: new Date().getTime()
  };
};

var locationMsg=(id,loc)=>{
  return {from:id,
    url:`https://www.google.com/maps?=${loc.lat},${loc.lon}`,
    createdAt: new Date().getTime()
  };
};

module.exports={msg,locationMsg}
