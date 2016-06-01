# ps-tree-usage
node.js module to monitor the resource usage of a process tree

start monitoring a process tree:
```javascript
const monitor = require('ps-tree-usage');
var profiler =  new monitor;
profiler.monitorProcessTree(14200, true);

// some time later
var cpu = profiler.averageTreeCPU();
var mem = profiler.averageTreeMemory();
```
