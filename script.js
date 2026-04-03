const buffer=document.getElementById("buffer")
const input=document.getElementById("input")
const themeBtn=document.getElementById("themeBtn")
const clearBtn=document.getElementById("clearBtn")

const banner=`
 █████╗ ██╗   ██╗ █████╗  █████╗ ███╗   ██╗
██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗████╗  ██║
███████║ ╚████╔╝ ███████║███████║██╔██╗ ██║
██╔══██║  ╚██╔╝  ██╔══██║██╔══██║██║╚██╗██║
██║  ██║   ██║   ██║  ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`

const intro=`
AyaanOS Web Terminal v1.0
Simulation Layer Active
Type 'help' to view commands.
`

function addLine(text,cls="response"){
const div=document.createElement("div")
div.className="line "+cls
div.textContent=text
buffer.appendChild(div)
buffer.scrollTop=buffer.scrollHeight
}

function printBlock(text,cls="response"){
text.split("\n").forEach(l=>addLine(l,cls))
}

function boot(){
printBlock(banner,"banner")
addLine("")
printBlock(intro,"muted")
addLine("")
}

boot()

const fileSystem={
"/": ["core","apps","logs"],
"/core": ["kernel.sys","memory.cfg"],
"/apps": ["clock.app","matrix.app","calc.app"],
"/logs": ["system.log"]
}

const commands={
help:()=>`
help        list commands
ls          list directory
cd [dir]    change directory
run [app]   launch app
echo [msg]  print message
theme       toggle theme
clear       clear screen
`,
ls:()=>fileSystem[currentDir]?.join("  ") || "Directory empty.",
cd:(arg)=>{
if(!arg)return "Specify directory."
let path=arg.startsWith("/")?arg:currentDir+"/"+arg
if(fileSystem[path]){
currentDir=path
return "Entered "+path
}
return "Directory not found."
},
run:(arg)=>{
if(arg==="clock.app"){
return "Time: "+new Date().toLocaleTimeString()
}
if(arg==="matrix.app"){
startMatrix()
return ""
}
if(arg==="calc.app"){
return "Calculator ready. Use: calc 5+5"
}
return "App not found."
},
echo:(arg)=>arg||"",
calc:(arg)=>{
try{return eval(arg).toString()}
catch{return "Invalid expression."}
},
theme:()=>{
document.body.classList.toggle("light")
return "Theme switched."
},
clear:()=>{
buffer.innerHTML=""
boot()
return ""
}
}

let currentDir="/"
let history=[]
let index=0

input.addEventListener("keydown",e=>{
if(e.key==="Enter"){
const raw=input.value.trim()
if(!raw)return
addLine("> "+raw,"command")
history.push(raw)
index=history.length
const parts=raw.split(" ")
const cmd=parts[0]
const arg=parts.slice(1).join(" ")
if(commands[cmd]){
const result=commands[cmd](arg)
if(result)printBlock(result)
}else{
addLine("Unknown command.","muted")
}
input.value=""
}
if(e.key==="ArrowUp"){
if(index>0){index--;input.value=history[index]}
}
if(e.key==="ArrowDown"){
if(index<history.length-1){index++;input.value=history[index]}
else{index=history.length;input.value=""}
}
})

function startMatrix(){
let i=0
const interval=setInterval(()=>{
addLine(Math.random().toString(36).substring(2,15),"muted")
i++
if(i>20)clearInterval(interval)
},50)
}

themeBtn.onclick=()=>commands.theme()
clearBtn.onclick=()=>commands.clear()
