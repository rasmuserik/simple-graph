// # simple-graph
//
// ***Under development, not done yet***
// 
// `require('simple-graph')(graph, canvasElem)` renders a simple graph in the form of:
//
// ```javascript
// [{id: 'a', links: ['b', 'c']},
//  {id: 'b', links: ['d', 'c']},
//  {id: 'c', links: ['f', 'e']},
//  {id: 'd', links: ['d', 'c']},
//  ...
// }
// ```
// to a canvas element.
//
import scriptPromise from 'script-promise';


async function simpleGraph(graph, elem) {
  window.d3 || await scriptPromise('https://d3js.org/d3.v4.min.js');

  let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(300, 200));

  let nodes = [
    {id:'a', peers: ['b']},
    {id: 'b', peers: ['c', 'd']},
    {id: 'c', peers: []},
    {id: 'd', peers: ['b', 'c', 'a']}
  ];
  function links() {
    let result = [];
    for(let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];
      for(let j = 0; j < node.peers.length; ++j) {
        result.push({
          source: node.id,
          target: node.peers[j],
        });
      }
    }
    return result;
  }

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links());

  function ticked() {
  console.log('tick');
    let n = {};
    for(let i = 0; i < nodes.length; ++i) {
      n[nodes[i].id] = nodes[i];
    }
    let ctx = window.graph.getContext('2d');
    ctx.clearRect(0,0, 600, 300);
    for(let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];
      ctx.strokeStyle = '#ccc'
      ctx.beginPath();
      for(let j = 0; j < node.peers.length; ++j) {
        ctx.moveTo(node.x, node.y);
        let dst = n[node.peers[j]];
        ctx.lineTo(dst.x, dst.y);
      }
      ctx.stroke();
    }

    for(let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];
      ctx.fillText(node.id, node.x, node.y );
    }
  }

}

if(window.MAIN === 'simple-graph') {
  simpleGraph();
}
