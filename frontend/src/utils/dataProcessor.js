// utils/dataProcessor.js
// same cleaning logic from assignment 2
// reusing it here to clean csv before sending to backend

export function processData(rawData) {

  var cleaned = []
  var seenNames = []

  for(var i=0; i<rawData.length; i++){
    var row = rawData[i]

    if(row == null || row == undefined) continue

    var isDuplicate = false
    for(var j=0; j<seenNames.length; j++){
      if(seenNames[j] == row.Name){
        isDuplicate = true
        break
      }
    }
    if(isDuplicate) continue
    seenNames.push(row.Name)

    var rawRating = row.Rating || row.rating || "0"
    rawRating = rawRating.toString().replace(/[^0-9.]/g, "").trim()
    var rating = parseFloat(rawRating)
    if(isNaN(rating)) rating = 0
    if(rating > 5) rating = 5
    if(rating < 0) rating = 0

    var rawPhone = (row.Phone || row.phone || "").toString().trim()
    if(rawPhone.startsWith(",")) rawPhone = rawPhone.substring(1).trim()

    var rawAddress = (row.Address || row.address || "").toString().trim()
    if(rawAddress.startsWith(",")) rawAddress = rawAddress.substring(1).trim()

    var rawWebsite = (row.Website || row.website || "").toString().trim()

    var newRow = {
      name: (row.Name || row.name || "Unknown").trim(),
      category: (row.Category || row.category || "Uncategorized").trim(),
      address: rawAddress,
      phone: rawPhone,
      website: rawWebsite,
      rating: rating,
      reviews: parseInt(row.Reviews || row.reviews || 0) || 0,
    }

    newRow.city = getCity(newRow.address)
    newRow.hasPhone = newRow.phone.length > 3
    newRow.hasWebsite = newRow.website.length > 4 && newRow.website.toLowerCase() !== "n/a"

    cleaned.push(newRow)
  }

  return cleaned
}

function getCity(address){
  if(!address) return "Unknown"
  var parts = address.split(",")
  if(parts.length >= 4) return parts[parts.length - 3].trim()
  var city = parts[parts.length - 2]
  if(city == undefined) city = parts[0]
  return city ? city.trim() : "Unknown"
}
