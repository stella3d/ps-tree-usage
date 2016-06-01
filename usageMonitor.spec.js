var monitor = require('./usageMonitor');
var _ = require('underscore');

describe('???', () => {

  var profiler = new monitor;

  before(() => {
    profiler.stats.processes = {
      '1100':

        usage: {
          cpu: [0.5, 2.2, 0.5, 2.8, 3.2, 2.2]
        }
      },
      '1101': {
        usage: {
          cpu: [0.1, 2.2, 0.1, 2.3, 3.2, 0.5]
        }
      },
      '1102': {
        usage: {
          cpu: [0.2, 2.3, 0.6, 2.7, 2.1, 2.6]
        }
      },
    }
  });

  it('#averageTreeCPU should average + sum all CPU stats', () => {
    //_.forEach(profiler.stats.processes, console.log);
    var cpu = profiler.averageTreeCPU();
    console.log(cpu);
  });

});
