class Users{
    constructor(){
        this.users_list=[];
    }
    addUser(id,name,room){
        var user={id,name,room};
        this.users_list.push(user)
        return user;
    }
    removeUser(id){
        this.users_list=this.users_list.filter((u)=>{
            return u.id!==id;
        });
    }
    getUser(id){
        this.users_list=this.users_list.filter((u)=>{
            return u.id===id;
        })[0];//取得第一個
    }
    getUserList(room){
        var users_list=this.users_list.filter((u)=>{
            return u.room===room;
        });
        var nameArray=users_list.map((u)=>{
            return u.name;
        });
        return nameArray;
    }
}

module.exports={Users}