"use strict";

//Priority Queue

class PriorityQueue 
{
  constructor() 
  {
    this.collection = [];
  }

	enqueue(element){
    if (this.isEmpty()){ 
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.collection.length; i++){
        if (element[1] < this.collection[i-1][1]){ 
          this.collection.splice(i-1, 0, element);
          added = true;
          break;
        }
      }
      if (!added){
          this.collection.push(element);
      }
    }
  };
  
  dequeue() {
    let value = this.collection.shift();
    return value;
  };
  isEmpty() {
    return (this.collection.length === 0) 
  };
}



//Grid Construction

let Generator = document.querySelectorAll('#Grid-generator>div>input');
let GBtn = Generator[2];

GBtn.addEventListener('click',generateGrid);

let gridBack = document.querySelector('#Mid');
gridBack.style.display="none";

let grid = document.querySelector('#Grid-main>table>tbody');

let gridGraph = [];

let r ;
let c ;
let gridVisual;

function generateGrid(e)
{
	r = Generator[0].value;
	c = Generator[1].value;
	//console.log(r,c);
	if(grid.innerHTML!="")
		grid.innerHTML="";
	if( gridGraph!= [])	
		gridGraph=[];
	startNode=-1;
	endNode=-1;
	for(let i=0;i<r;i++)
	{
		let s='';
		let row =[];
		for(let j=0;j<c;j++)
		{
			s+=`<td width=100vw height=100vh class="${i*c+j}"></td>`;
			row.push('0');
		}
		grid.innerHTML+='<tr>'+s+'</tr>';
		gridGraph.push(row);
	}
	//console.log(gridGraph);
	gridBack.style.display="grid";
	gridVisual = document.querySelectorAll('td');
	//console.log(gridVisual);
	initializeObstacle();
	initializeStartNode();
	initializeEndNode();
}

/*let grid = document.querySelector('#Grid-main>table>tbody');

let gridGraph = [];
for(let i=0;i<10;i++)
{
	let s='';
	let row =[];
	for(let j=0;j<10;j++)
	{
		s+=`<td width=100vw height=40vh class="${i*10+j}"></td>`;
		row.push('0');
	}
	grid.innerHTML+='<tr>'+s+'</tr>';
	gridGraph.push(row);
}
*/




//Algorithm Selection

let algoBtn = document.querySelectorAll('.dropDiv>.MenuLabel');

let dropDown = document.querySelectorAll('.dropDiv>.drop-content');
let radioHolder = document.querySelectorAll('.dropDiv>.drop-content>.radioHolder');
let submitBtn = document.querySelector('.SubmitDiv>input');
let clearBtn = document.querySelector('.ClearDiv>input');

submitBtn.addEventListener('click',startAlgo);

for(let i=0;i<algoBtn.length;i++)
{
	algoBtn[i].addEventListener('click',chooseAlgo);
}

function chooseAlgo(e)
{
	for(let i=0;i<dropDown.length;i++)
	{
		if(dropDown[i].style.display=='grid')
		{
			dropDown[i].style.display='none';
		}
	}
	if(e.target.innerText=="BFS")
	{
		if(dropDown[0].style.display=='none')
		{
			dropDown[0].style.display='grid';
			dropDown[0].style.background='rgba(200,100,100,0.5)';
			dropDown[0].style.gridTemplateRows='repeat(3,1fr)';
			dropDown[0].style.transition='all 4s ease-in-out';
		}
		else
		{
			dropDown[0].style.display='none';
		}
	}	
	else if(e.target.innerText=="Dijkstra")
	{
		if(dropDown[1].style.display=='none')
		{
			dropDown[1].style.display='grid';
			dropDown[1].style.background='rgba(200,100,100,0.5)';
			dropDown[1].style.gridTemplateRows='repeat(3,1fr)';
			dropDown[1].style.transition='all 4s ease-in-out';
		}
		else
		{
			dropDown[1].style.display='none';
		}
	}
}

function startAlgo(e)
{
	
	if(radioHolder[0].children[0].children[0].checked)
	{
		BFS();
		//console.log("Hello");
	}
	else if(radioHolder[0].children[1].children[0].checked)
	{
		BFS(0);
	}
	else if(radioHolder[1].children[0].children[0].checked)
	{
		Dijkstra();
	}
	else if(radioHolder[1].children[1].children[0].checked)
	{
		Dijkstra(0);
	}
}





// Obstacle Selction

function initializeObstacle()
{
	for(let i=0;i<gridVisual.length;i++)
	{
		gridVisual[i].addEventListener("mousemove",clickBox);
	}
}

function clickBox(e)
{
	//console.log('Hello');
	if(e.target.style.background!="red" && e.altKey && e.target.style.background!="blue")
	{
		e.target.style.background="rgba(30,30,30,0.6)";
		let num = parseInt(e.target.className);
		//console.log(num);
		let x = Math.floor(num/c);
		let y = num%c;
		gridGraph[x][y]='1';
	}
}




//Starting Node Selection
let startNode=-1;

function initializeStartNode()
{
	for(let i=0;i<gridVisual.length;i++)
	{	
		gridVisual[i].addEventListener('click',selectStart);
	}
}

function selectStart(e)
{
	if(e.target.style.background!="blue" && e.shiftKey)
	{
		let num = parseInt(e.target.className);
		let x = Math.floor(num/c);
		let y = num%c;
		if(gridGraph[x][y]!='1')
		{
			if(startNode!=-1)
			{
				let Prev = document.querySelector(`[class="${startNode}"]`);
				Prev.style.background="white";
			}
			e.target.style.background='red';
			gridGraph[x][y]='0';
			startNode=e.target.className;
			//console.log(startNode);
		}
	}
		
}





//End Node Selection
let endNode=-1;

function initializeEndNode()
{
	for(let i=0;i<gridVisual.length;i++)
	{
		gridVisual[i].addEventListener('click',selectEnd);
	}
}
function selectEnd(e)
{
	if(e.target.style.background!="red" && e.ctrlKey )
	{
		let num = parseInt(e.target.className);
		let x = Math.floor(num/c);
		let y = num%c;
		if(gridGraph[x][y]!='1')
		{
			if(endNode!=-1)
			{
				let Prev = document.querySelector(`[class="${endNode}"]`);
				Prev.style.background="white";
			}
			e.target.style.background = 'blue';
			gridGraph[x][y]='0';
			endNode = e.target.className;	
			//console.log(endNode);
		}
	}
	
}




//Grid to Graph Conversion

function GridToGraph(Grid,diagonal=true,weighted=false)
{
	let adj = {};
	let n = Grid.length;
	let m = Grid[0].length;
	for(let i=0;i<(m*n);i++)
	{
		adj[i]=[];
	}
	for(let i=0;i<n;i++)
	{
		for(let j=0;j<m;j++)
		{
			if(Grid[i][j]!='1')
			{
				if(!weighted)
				{
					if(j>0 && Grid[i][j-1]!='1')
						adj[i*m+j].push(i*m+j-1);
					if(j<m-1 && Grid[i][j+1]!='1')
						adj[i*m+j].push(i*m+j+1);
					if(i>0 && Grid[i-1][j]!='1')
						adj[i*m+j].push((i-1)*m+j);
					if(i<n-1 && Grid[i+1][j]!='1')
						adj[i*m+j].push((i+1)*m+j);	
					if(i>0 && j>0 && Grid[i-1][j-1]!='1' && diagonal)
						adj[i*m+j].push((i-1)*m+j-1);
					if(i>0 && j<m-1 && Grid[i-1][j+1]!='1'&& diagonal)
						adj[i*m+j].push((i-1)*m+j+1);
					if(i<n-1 && j>0 && Grid[i+1][j-1]!='1' && diagonal)
						adj[i*m+j].push((i+1)*m+j-1);
					if(i<n-1 && j<m-1 && Grid[i+1][j+1]!='1' && diagonal)
						adj[i*m+j].push((i+1)*m+j+1);
				}
				else
				{
					if(j>0 && Grid[i][j-1]!='1')
						adj[i*m+j].push([i*m+j-1,convert(0)]);
					if(j<m-1 && Grid[i][j+1]!='1')
						adj[i*m+j].push([i*m+j+1,convert(0)]);
					if(i>0 && Grid[i-1][j]!='1')
						adj[i*m+j].push([(i-1)*m+j,convert(0)]);
					if(i<n-1 && Grid[i+1][j]!='1')
						adj[i*m+j].push([(i+1)*m+j,convert(0)]);	
					if(i>0 && j>0 && Grid[i-1][j-1]!='1' && diagonal)
						adj[i*m+j].push([(i-1)*m+j-1,convert(0)]);
					if(i>0 && j<m-1 && Grid[i-1][j+1]!='1'&& diagonal)
						adj[i*m+j].push([(i-1)*m+j+1,convert(0)]);
					if(i<n-1 && j>0 && Grid[i+1][j-1]!='1' && diagonal)
						adj[i*m+j].push([(i+1)*m+j-1,convert(0)]);
					if(i<n-1 && j<m-1 && Grid[i+1][j+1]!='1' && diagonal)
						adj[i*m+j].push([(i+1)*m+j+1,convert(0)]);
				}
			}
		}
	}
	return adj;
}


//The Algorithm



function BFS(diagonal=true)
{
	let adj = GridToGraph(gridGraph,diagonal);
	let visited={};
	let prev={};
	for(let i=0;i<r*c;i++)
	{
		visited[i]=false;
	}
	let q =[];
	
	visited[startNode]=true;
	prev[startNode]=-1;
	q.push(startNode);
	while(q.length>0 && !visited[endNode])
	{
		let v = q[0];
		q.shift();
		
		for(let i=0;i<adj[v].length ;i++)
		{
			if(!visited[adj[v][i]])
			{
				visited[adj[v][i]]=true;
				q.push(adj[v][i]);
				prev[adj[v][i]]=v;
				
				let Node = document.querySelector(`[class="${adj[v][i]}"]`);
				Node.style.transition = "background 2s ease-in-out";
				if(!visited[endNode])
					Node.style.background = "yellow";
				else
					break;
			}
		}
	}
	let curNode=endNode;
	while(prev[curNode]!=startNode)
	{
		curNode=prev[curNode];
		let Node = document.querySelector(`[class="${curNode}"]`);
		Node.style.backgroundColor="brown";
	}
}


function Dijkstra(diagonal=true)
{
	let adj = GridToGraph(gridGraph,diagonal,true);
	let times = {};
	let backtrace = {};
	let pq = new PriorityQueue();
	
  
	for(let i=0;i<r*c;i++)
	{
		times[i] = Infinity;
	}
	times[startNode] = 0;
	
	pq.enqueue([startNode, 0]);
	
	while (!pq.isEmpty()) 
	{
		let shortestStep = pq.dequeue();
		let currentNode = shortestStep[0];
		//console.log(shortestStep);
		if(currentNode!=startNode && currentNode!=endNode)
		{
			let Node = document.querySelector(`[class="${currentNode}"]`);
			Node.style.background='yellow';
		}
		
		for(let i=0;i<adj[currentNode].length;i++)
		{
			let v = adj[currentNode][i][0];
			let w = adj[currentNode][i][1];
			
			let time = times[currentNode] + w;
		
			if (time < times[v]) 
			{
				times[v] = time;
				backtrace[v] = currentNode;
				pq.enqueue([v, time]);
				//console.log(v,time);
			}
		}
	}
	let path = [endNode];
	let lastStep = endNode;
	while(lastStep !== startNode) 
	{
		path.unshift(backtrace[lastStep]);
		lastStep = backtrace[lastStep];
	}
	for(let i=1;i<path.length-1;i++)
	{
		let Node = document.querySelector(`[class="${path[i]}"]`);
		Node.style.background='brown';
	}
	
}


//Clear Inputs

clearBtn.addEventListener('click',clearStuff);

function clearStuff(e)
{
	startNode=-1;
	endNode=-1;
	for(let i=0;i<r;i++)
	{
		for(let j=0;j<c;j++)
		{
			gridGraph[i][j]='0';
			gridVisual[c*i+j].style.background="white";
		}
	}
	let NodeList = document.querySelectorAll('td');
	for(let i=0;i<NodeList.length;i++)
	{
		NodeList[i].style.transition="initial";
	}
}

// Color to Weight Converter
function convert(alpha)
{
	if(alpha==1)
		return Infinity;
	let min=1;
	let max=1000; 
	return min+(max-min)*alpha;
}


