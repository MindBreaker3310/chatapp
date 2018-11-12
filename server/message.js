
var moment = require('moment');

var msg=(id,text)=>{
  return {from:id,
    text:text,
    createdAt: moment().format('hh:mm')
  };
};

var locationMsg=(id,loc)=>{
  return {from:id,
    url:`https://www.google.com/maps?=${loc.lat},${loc.lon}`,
    createdAt: moment().format('hh:mm')
  };
};

module.exports={msg,locationMsg}
