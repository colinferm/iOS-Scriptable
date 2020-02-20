// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: project-diagram;
// share-sheet-inputs: plain-text, file-url;
let sfs = importModule('sfs')

/*
if (Keychain.contains(sfs.APIKey)) {
  let token = Keychain.get(sfs.APIKey)
  let encoded = encodeURI(token)
  console.log("Saved - CSRF Token: " + token);
  //Script.setShortcutOutput(encoded)
  return encoded
  
} else {
  */
  let token = await sfs.getLoginToken()
  let login = await sfs.loginRequest(token)
  let csrfToken = await sfs.getCsrfToken()
  let encoded = encodeURI(csrfToken)
  Keychain.set(sfs.APIKey, csrfToken)
  console.log("New - CSRF Token: " + csrfToken);
  
  Script.setShortcutOutput(encoded)
  //return encoded
//}
Script.complete()