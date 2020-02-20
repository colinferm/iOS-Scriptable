// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
const APIUrl = "https://siteurl/api.php"
const APIEnv = "dev"
const APIKey = "wiki_" + APIEnv + "_token"

module.exports.APIUrl = APIUrl
module.exports.APIKey = APIKey

module.exports.getParameters = function (qs) {
  if (qs.indexOf('&') != -1) {
    const params = qs.split('&')
    return makeParameterPairs(params)
  } else {
    const params = [qs]
    return makeParameterPairs(params)
  }
}

let makeParameterPairs = function(params) {
  var finalp = {}
  for (var i = 0; i < params.length; i++) {
    let p = params[i]
    console.log("Have param set: " + p)
    let kv = p.split('=') 
    let k = kv[0]
    let v = kv[1]
    console.log("Found Key: " + k + " Value: " + v) 
    //QuickLook.present("Key: " + k + " Value: " + v)
    finalp[k] = v
  }
  return finalp
}

module.exports.makeParameterPairs = makeParameterPairs

module.exports.getLoginToken = async function() {
    let req = new Request(APIUrl)
    req.method = "POST"
    req.addParameterToMultipart("action", "query")
    req.addParameterToMultipart("meta", "tokens")
    req.addParameterToMultipart("type", "login")
    req.addParameterToMultipart("format", "json")
    
    let resp = await req.loadString()
    let json = JSON.parse(resp)
    
    let token = json["query"]["tokens"]["logintoken"]
    console.log("Token: " + token)
    return token
}

module.exports.loginRequest = async function(token) {    
    let req = new Request(APIUrl)
    req.method = "POST"
    req.addParameterToMultipart("action", "login")
    req.addParameterToMultipart("lgname", "USERNAME")
    req.addParameterToMultipart("lgpassword", "PASSWORD")
    req.addParameterToMultipart("lgtoken", token)
    req.addParameterToMultipart("format", "json")
    
    let resp = await req.loadString()
    let json = JSON.parse(resp)
    
    return json
}

module.exports.getCsrfToken = async function() {
    let req = new Request(APIUrl)
    req.method = "POST"
    req.addParameterToMultipart("action", "query")
    req.addParameterToMultipart("meta", "tokens")
    req.addParameterToMultipart("format", "json")
    
    let resp = await req.loadString()
    let json = JSON.parse(resp)
    
    let token = json["query"]["tokens"]["csrftoken"]
    console.log("CSRF Token: " + token)
    return token
}

module.exports.editRequest = async function(editToken, articleTitle, articleText, editMessage) {
    let token = decodeURI(editToken)
    let text = decodeURI(articleText).replace(/%3D/g, "=").replace(/%26/g, "&")
    let message = decodeURI(editMessage)
    let title = decodeURI(articleTitle)
    console.log("Passing text: " + text)
  
    let req = new Request(APIUrl)
    req.method = "POST"
    req.addParameterToMultipart("action", "edit")
    req.addParameterToMultipart("title", title)
    req.addParameterToMultipart("text", text)
    req.addParameterToMultipart("summary", message)
    req.addParameterToMultipart("token", token)
    req.addParameterToMultipart("format", "json")
    
    let resp = await req.loadString()
    let json = JSON.parse(resp)
    console.log(json)
    
    return resp
}

module.exports.prettyPrint = function(json) {
  let str = JSON.stringify(json, null, 2)
  QuickLook.present(str)
}