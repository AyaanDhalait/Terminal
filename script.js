const buffer=document.getElementById("buffer")
const input=document.getElementById("input")
const themeBtn=document.getElementById("themeBtn")
const clearBtn=document.getElementById("clearBtn")

const GITHUB_USERNAME="AyaanDhalait"

const banner=`
 █████╗ ██╗   ██╗ █████╗  █████╗ ███╗   ██╗
██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗████╗  ██║
███████║ ╚████╔╝ ███████║███████║██╔██╗ ██║
██╔══██║  ╚██╔╝  ██╔══██║██╔══██║██║╚██╗██║
██║  ██║   ██║   ██║  ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`

const intro=`
AyaanOS Web Terminal v2.0
Portfolio Mode Active
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

const commands={
help:()=>`
about       who I am
projects    list my GitHub projects
contact     how to reach me
socials     links
theme       toggle theme
clear       clear screen
`,

about:()=>`
Hi, I'm Ayaan 👋
Indie Game Developer & Full-Stack Developer

I build games, tools, and interactive apps using Python, Pygame, and web tech.
`,

contact:()=>`
Email: mr.dhalait@gmail.com
LinkedIn: https://linkedin.com/in/ayaan-dhalait
GitHub: https://github.com/AyaanDhalait
`,

socials:()=>`
GitHub: https://github.com/AyaanDhalait
LinkedIn: https://linkedin.com/in/ayaan-dhalait
`,

projects:async ()=>{
addLine("Fetching projects from GitHub...","muted")
try{
const res=await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`)
const data=await res.json()
if(!data.length)return"No projects found."
let output=""
data.slice(0,6).forEach(repo=>{
output+=`\n📦 ${repo.name}\n`
output+=`   ${repo.description||"No description"}\n`
output+=`   ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}\n`
output+=`   ${repo.html_url}\n`
})
return output
}catch{
return"Failed to fetch projects."
}
},

theme:()=>{
document.body.classList.toggle("light")
return"Theme switched."
},

clear:()=>{
buffer.innerHTML=""
boot()
return""
}
}

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
if(result instanceof Promise){
result.then(res=>{if(res)printBlock(res)})
}else{
if(result)printBlock(result)
}
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

themeBtn.onclick=()=>commands.theme()
clearBtn.onclick=()=>commands.clear()
