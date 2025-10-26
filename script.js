const firebaseConfig = {
apiKey: "AIzaSyA5WDb8JddopDtsnVp1f-bYhOenle3BqtA",
authDomain: "directives-76970.firebaseapp.com",
databaseURL: "https://directives-76970-default-rtdb.firebaseio.com",
projectId: "directives-76970",
storageBucket: "directives-76970.firebasestorage.app",
messagingSenderId: "366173184537",
appId: "1:366173184537:web:47ad23699c2d60b2ed0088",
measurementId: "G-SNLQ048W7N"
}
firebase.initializeApp(firebaseConfig)
firebase.analytics()
function toCode(text) {
text = text.split('').map(char => char.charCodeAt(0).toString(2).replace(/ /g, '')).join('2')
while (text.includes("11")) {
text = text.replace("11", 3)
}
while (text.includes("100")) {
text = text.replace("100", 4)
}
while (text.includes("23")) {
text = text.replace("23", 5)
}
while (text.includes("15")) {
text = text.replace("15", 6)
}
while (text.includes("61")) {
text = text.replace("61", 7)
}
while (text.includes("35")) {
text = text.replace("35", 8)
}
while (text.includes("45")) {
text = text.replace("45", 9)
}
return text
}
function toNorm(text) {
while (text.includes("9")) {
text = text.replace("9", 45)
}
while (text.includes("8")) {
text = text.replace("8", 35)
}
while (text.includes("7")) {
text = text.replace("7", 61)
}
while (text.includes("6")) {
text = text.replace("6", 15)
}
while (text.includes("5")) {
text = text.replace("5", 23)
}
while (text.includes("4")) {
text = text.replace("4", 100)
}
while (text.includes("3")) {
text = text.replace("3", 11)
}
text = text.split('2').map(bin => String.fromCharCode(parseInt(bin, 2))).join('')
return text
}
let currentID = ""
let collectedPreviewID = ""
if (location.search.includes("?directive=")) {
shown("home", false)
collectedPreviewID = location.search.split("?directive=")[1]
PreviewDirective(collectedPreviewID)
}
shown("d", false)
shown("r", false)
function shown(id, tf) {
if (tf) {
document.getElementById(id).style.display = ""
} else {
document.getElementById(id).style.display = "none"
}
}
function upd() {
EditDirective()
}
function OpenDirective(dirID) {
currentID = dirID
firebase.database().ref("directives/"+dirID).once("value").then(snap => {
collectedText = snap.val().text
collectedType = snap.val().type || 0
i.innerText = dirID
t.value = collectedType
m.value = collectedText
s.innerText = `${window.location.href}?directive=${toCode(dirID)}`
shown("home", false)
shown("d", true)
})
}
function CreateDirective() {
let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
let len = 4
function generateID(l) {
let id = ""
for (let i=0;i<l;i++) id += chars.charAt(Math.floor(Math.random()*chars.length))
return id
}
function tryGenerate() {
let id = generateID(len)
firebase.database().ref(`directives/${id}`).once("value").then(snap => {
if (snap.exists()) {
if (Math.pow(chars.length,len) <= snap.numChildren()) {len++;tryGenerate()}
else tryGenerate()
} else {
firebase.database().ref(`directives/${id}`).set({text:"", type:""})
OpenDirective(id)
}
})
}
tryGenerate()
}
function EditDirective() {
firebase.database().ref(`directives/${currentID}`).update({
text: m.value,
type: t.value
})
}
let types = ["Terms & Service", "Privacy & Policy", "Treaty"]
function PreviewDirective(dirID) {
dirID = toNorm(dirID)
if (!/^[a-zA-Z0-9]+$/.test(dirID)) return
firebase.database().ref(`directives/${dirID}`).once("value").then(snap=>{
if (!snap.exists()) return
n.innerText = types[snap.val().type]
c.value = snap.val().text
if (snap.val().type !== undefined && snap.val().text !== undefined) {
shown("home", false)
shown("r", true)
}
})
}
