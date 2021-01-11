// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: stroopwafel;
//https://www.onthesnow.com/ajax/my/nearby_resorts?lat=53.55073&lon=9.99302&n=10
//https://www.onthesnow.com/ajax/get_simple_resort?id=2977

const symbols = new Array('⛷','🏂','🎿','🥶','❄️','☃️','🍻','🚠','🏔','🗻','💯')
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let params = args.widgetParameter
var lat = 0, lng = 0;
//params = '43.1134,-72.9081' // Straton
//params = '42.2029,-74.2246' // Hunter
//params = '40.5888,-111.6380' // Alta
if (params) {  
  let latLng = params.split(",")
  lat = latLng[0]
  lng = latLng[1]
} else {
  let loc = await Location.current()
  lat = Number.parseFloat(loc.latitude).toPrecision(5)
  lng = Number.parseFloat(loc.longitude).toPrecision(5)
}
if (lat == 0 || lng == 0) return
//console.log("Latitude: " + lat + ", Longitude: " + lng)

let req = new Request('https://www.onthesnow.com/ajax/my/nearby_resorts?lat='+lat+'&lon='+lng+'&n=1')
let json = await req.loadJSON()
//console.log(json)

if (json && json.length > 0) {
 var area = json[0]
 let areaReq = new Request('https://www.onthesnow.com/ajax/get_simple_resort?id='+area.id)  
 let areaData = await areaReq.loadJSON()
 //console.log(areaData)  

// if (config.runsInWidget) {
 if (true) {
  const size = config.widgetFamily;
  let widget = await createWidget(size, areaData.data[0])
  Script.setWidget(widget)
 }
}
Script.complete()

async function createWidget(size, data) {
  //console.log(data)
  let resort = data.snowcone
  let resortImage = await loadImage(data.resortPhoto.mid)
  let openingDate = new Date(data.pastSnow.starting_reported_date_epoch * 1000)
  let today = new Date()
  
  const bgColor = new Color("#000", 0.4)
  const normFont = Font.regularSystemFont(10)
  const largeFont = Font.boldRoundedSystemFont(22)
  
  let widget = new ListWidget()
  widget.setPadding(5, 5, 5, 5)
  widget.backgroundImage = resortImage
  let horzStack = widget.addStack()
  horzStack.topAlignContent()
  horzStack.layoutVertically()
  
  var name = data.resort_name
  if (today.getHours() >= 16) {
   name += " " + symbols[6]  
  }
  
  let resortName = horzStack.addText(name)
  resortName.textColor = Color.white()
  resortName.shadowColor = Color.black()
  resortName.shadowOffset = new Point(5, 5)
  resortName.shadowRadius = 20
  resortName.font = Font.boldRoundedSystemFont(20)
  resortName.centerAlignText()
  
  if (openingDate.getTime() >= today.getTime()) {
   let openDateStack = horzStack.addStack()
   openDateStack.layoutHorizontally()
   openDateStack.backgroundColor = bgColor
  
   let snowman = openDateStack.addText(symbols[2])
   snowman.font = largeFont
  
   let openDateText = openDateStack.addText("Opening: " + openingDate.toLocaleDateString(undefined, dateOptions))
   openDateText.textColor = Color.white()
   openDateText.font = normFont
  }

  let trailsOpenStack = horzStack.addStack()
  trailsOpenStack.layoutHorizontally()
  trailsOpenStack.backgroundColor = bgColor
  
  let liftsIcon = trailsOpenStack.addText(symbols[0])
  liftsIcon.font = largeFont
  
  let openLiftsStack = trailsOpenStack.addStack()
  openLiftsStack.layoutVertically()
  openLiftsStack.setPadding(7, 0, 0, 0)
  
  let openLiftsText = openLiftsStack.addText((new Number(resort.lifts_open)).toString())
  openLiftsText.textColor = Color.white()
  openLiftsText.font = largeFont
  
  let iconSpacer = trailsOpenStack.addSpacer(null)
  
  let skiIcon = trailsOpenStack.addText(symbols[7])
  skiIcon.font = largeFont
  
  let openTrailsStack = trailsOpenStack.addStack()
  openTrailsStack.layoutVertically()
  openTrailsStack.setPadding(7, 0, 0, 0)
  
  let openTrailsText = openTrailsStack.addText((new Number(resort.num_trails_slopes_open)).toString())
  openTrailsText.textColor = Color.white()
  openTrailsText.font = largeFont
  
  let snowfallStack = horzStack.addStack()
  snowfallStack.layoutHorizontally()
  snowfallStack.backgroundColor = bgColor
  
  let mountainIcon = snowfallStack.addText(symbols[8])
  mountainIcon.font = largeFont
  
  let baseDepthStack = snowfallStack.addStack()
  baseDepthStack.layoutVertically()
  baseDepthStack.setPadding(7, 0, 0, 0)
  
  let baseDepthText = baseDepthStack.addText((new Number(resort.base_depth_cm)).toString() + "cm")
  baseDepthText.textColor = Color.white()
  baseDepthText.font = normFont
  
  snowfallStack.addSpacer(null)
  
  let flakeIcon = snowfallStack.addText(symbols[4])
  flakeIcon.font = largeFont
  
  let totalSnowfallStack = snowfallStack.addStack()
  totalSnowfallStack.layoutVertically()
  totalSnowfallStack.setPadding(7, 0, 0, 0)
  
  let totalSnowfallText = totalSnowfallStack.addText((new Number(resort.reported_snow_fall_cm)).toString() + "cm")
  totalSnowfallText.textColor = Color.white()
  totalSnowfallText.font = normFont
  
  widget.presentSmall()
  
  return widget
}

async function loadImage(url) {
  let req = new Request(url)
  return req.loadImage()
}