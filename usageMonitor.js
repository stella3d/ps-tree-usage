// a simple external process tree profiler designed to run behind UI-level tests
// not a "real", detailed profiler: just get CPU & memory usage stats on an interval
// originally made for use with an Electron app.
const _ = require('underscore');
const pidUsage = require('pidusage');
const psTree   = require('ps-tree');

module.exports = function monitor() {
  var intervals = {};
  this.pollingInterval = 200;
  this.stats = { processes: {} };

  // produce timestamped series of data on CPU & mem
  this.pollProcess = function (pid) {
    pidUsage.stat(parseInt(pid), (error, result) => {
      this.stats.processes[pid].push({
        time: Date.now(),
        usage: result
      });
    })
  };

  this.monitorProcess = function (pid) {
    this.stats.processes[pid] = [];
    this.pollProcess(pid);
    intervals[pid] = setInterval(() => {
      this.pollProcess(pid);
    }, this.pollingInterval);
  };

  this.monitorProcessTree = function(parentPID, watch) {
    var processes = [parentPID];
    psTree(parentPID, (error, children) => {
      children.forEach((child) => processes.push(child.PID));
      processes.forEach(this.monitorProcess.bind(this));
    });

    if (watch) {
      intervals['newProcessWatch'] = setInterval(() => {
        psTree(parentPID, (error, children) => {
          _.difference(children.map((c) => c.PID), processes)
          .forEach((newChild) => {
            processes.push(newChild);
            this.monitorProcess(newChild);
          });
        })
      }, 1000);
    }
  };

  // judging by watching the activity monitor, on osx these stats are reported
  // as the percentage of a single CPU, depsite taking place across multiple
  function averageCPU(stats){
    console.log(stats);
    return stats.map((pid) => pid.usage.cpu)
                .reduce((p, c) => p + c) / stats.length;
  }

  // These stats match the "Real Memory Size" in activity monitor on osx
  function averageMEM(stats){
    return stats.map((pid) => pid.usage.memory)
                .reduce((p, c) => p + c) / stats.length;
  }

  this.averageTreeCPU = function() {
    return _.map(this.stats.processes, averageCPU).reduce((p, c) => p + c);
  };

  this.averageTreeMemory = function() {
    return _.map(this.stats.processes, averageMEM).reduce((p, c) => p + c);
  };

  this.reset = function() {
    _.forEach(intervals, clearInterval);
    this.stats.processes = {};
  }

};
