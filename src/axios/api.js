const baseUrl = "http://www.wrazd.com/wxarticle"

const Api={
    binding:baseUrl+"/users/binding",
    wxSignature:baseUrl + "/wechat/signature",
    uploadImage:baseUrl + "/article/uploadImage",
    get_domain_info:baseUrl + "/domain/getDomainInfo",
    submitArticleContent:baseUrl + "/article/submitArticle",
    getArticleList:baseUrl + "/article/getArticleList",
    sendComment:baseUrl + "/comment/sendComment",
    getComment:baseUrl + "/comment/getComment",
    sendReply:baseUrl + "/reply/sendReply"
}

export default Api