export default function(cname) {
    let cookie = getCookie(cname)
    let datas = cookie.slice(2)
    return JSON.parse(datas)
}

   const getCookie = (cname)=>{
            var name = cname + "=";
            var ca = decodeURIComponent(document.cookie).split(';');
            for(var i=0; i<ca.length; i++)
                {
                    var c = ca[i].trim();
                    if (c.indexOf(name)==0) 
                    return c.substring(name.length,c.length);
                }
            return "";
        }
