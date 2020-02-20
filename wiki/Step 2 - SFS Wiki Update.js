// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: code; share-sheet-inputs: plain-text, file-url;
let sfs = importModule('sfs')

if (args.shortcutParameter) {
  const params = sfs.getParameters(new String(args.shortcutParameter))
  
  let token = params["Token"]
  let title = params["ArticleTitle"]
  let message = params["EditMessage"]
  let text = params["ArticleText"]
  console.log("Title: " + title + "\nMessage: " + message)
    
  let json = await sfs.editRequest(token, title, text, message)
  let output = params + "\n\n" + json
  QuickLook.present(output)
  
} else {
  let alert = new Alert()
  alert.title = "Final Details"
  alert.message = "Fill in some things to make this happen"
  alert.addTextField("Article Title")
  alert.addTextField("Commit Message")
  alert.addAction("Submit")
  alert.addDestructiveAction("Cancel")
  
  let output = await alert.presentAlert()
  if (output == 0) {
    let title = alert.textFieldValue(0)
    let message = alert.textFieldValue(1)
    console.log("Title: " + title + "\nMessage: " + message)
    
    const text = params["ArticleText"]
    let json = await sfs.editRequest(token, title, text, message)
    
    QuickLook.present(json)
  }
}
Script.complete()