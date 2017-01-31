// Sir
const id = (x) => x;
const outerPairs = (str) =>
    str.split("\n").filter(id).map(line => line[0] + line.slice(-1));

const add = (x, y) => x + y;
const sum = (arr) => arr.reduce(add, 0);
const count = (arr, eq) => sum(arr.map(e => eq === e));
const comp = (x, y) =>
    x == y ? 0 : x < y ? -1 : 1;

const orderBy = (f) => (arr) =>
    arr.sort((p, c) => comp(f(arr, c), f(arr, p)));
const orderByFreq = orderBy(count);
const uniq = (a) => [...new Set(a)];
const mostFrequent = (a) => uniq(orderByFreq(a));
const mostFreqOuter = (a) => mostFrequent(outerPairs(a));
let output = (x) =>
    document.body ?
        document.body.appendChild(document.createTextNode(x)) :
        console.log(x);
class Sir {
    constructor(str){
        this.prog = str.split("\n").length === 1
            ? str.match(/../g)
            : outerPairs(str);
        this.index = 0;
        this.stack = [];
        this.labels = new Map([]);
    }
    
    get cur(){
        return this.prog[this.index];
    }
    
    get running(){
        return this.index < this.prog.length;
    }
    
    step(){
        if(Sir.ops.has(this.cur)){
            // console.log(this.cur, this.stack);
            let f = Sir.ops.get(this.cur).bind(this);
            let arity = f.length;
            let args = [];
            while(arity --> 0)
                args.unshift(this.stack.pop() || 0);
            let res = f(...args);
            // console.log(args, res, f+[]);
            if(typeof res !== "undefined" && res !== Sir.NOTHING)
                this.stack.push(res);
            // console.log(this.cur, this.stack);
        }
        
        else if(this.cur[0] === "("){
            this.stack.push(this.cur[1].charCodeAt() - 32);
        }
        
        else if(this.cur[0] === "l"){
            this.labels.set(this.cur[1], this.index);
        }
        
        else if(this.cur[0] === "v" || (this.cur[0] === "?" && this.stack.pop())){
            this.index = this.labels.get(this.cur[1]);
            this.index--;
        }
        
        this.index++;
    }
    
    run(){
        while(this.running)
            this.step();
    }
}

Sir.NOTHING = Symbol("nothing");

Sir.ops = new Map([
    ["/r", () => 0],
    ["/!", () => 65],
    ["#!", () => 65],
    ["#r", () => 0],
    ["  ", id],
    ["//", () => 0],
    ["##", () => 0],
    [" ;", x => x + 1], // indented semicolon lines
    [" /", x => x - 1],
    [" >", x => x * x], // indented semicolon lines
    [" (", (x, y, z) => x ? y : z], // indented open paren lines
    [" )", (x, y) => x], // indented close paren lines
    [" {", x => (output(x), Sir.NOTHING)], // indented open bracket lines
    ["f{", x => String.fromCharCode(x)], // for()   { or function(){
    [" }", x => x.charCodeAt ? x.charCodeAt() : x], // indented close bracket lines
    [" ,", function(){ return this.stack.length; }], // indented comma lines
    [" ?", function(x){ return this.stack[x]; }], // indented 2nd condition of ? :
    [" :", function(x){ this.stack.push(x); return x }], // indented 3rd condition of ? :
    ["};", function(x, y){
        this.stack.push(y);
        return x;
    }],
    [");", (x, y) => x + y],
    ["];", (x, y) => x - y],
    ["],", (x, y) => x / y],
    ["d:", function(){ this.stack.reverse() }], // def(a):
    ["d)", function(){ this.stack.reverse() }], // def(a)
]);
// let s = new Sir(`(h :(=); :('); : :(#);(L(@(w($ ? :(#); :(&]; :((];(& ? ;d:l@f{ { ,?@`);
let s = new Sir(`
(Math
  .cos ? Math.cos :
(a +=
);
 a ? Math.tan :
(a + ''
) + Math.tan(a);
 a ? a++ :
 a - 1 ? PULL = () => --a :
("#
)");
(PULL
(PULL(3) ? 3 : @
(thaw
($
    ?
      $("#thaw") :
( @#
)))));
 "Hello World" ? "," :
(421.41953 &
]4[;
 "" ? a += "World" :
(-2 / (
])));
(12&
 52?
 12 : a = "," + a;
def main()
len @
function main(v){
    for(let x = 0; x < v; x++){
        x, v = v,
? x : v@
`.slice(1, -1));
// s.run();
console.log(s);
output = (x, src = outputElement) => src.appendChild(document.createTextNode(x.toString()));
submitButton.addEventListener("click", function(){
    outputElement.innerHTML = "";
    new Sir(textInput.value).run();
});