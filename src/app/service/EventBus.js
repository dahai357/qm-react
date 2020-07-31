var MyEvent = require('../service/emitter'); 
if (!!!window['MyEvent']) {
    window['MyEvent'] = new MyEvent();
}
module.exports = window['MyEvent']