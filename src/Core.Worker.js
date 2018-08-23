((window) => {
	var Workers = Helios.require("module")();
	var WorkerSupported = Worker ? true : false;
	var Threads = [];

	function makeNewWorker(func) {
		var blob = new Blob([
			"global={onmessage:function(){},postmessage:(msg)=>{postMessage(msg)}};func=" + func.toString() + ";onmessage=function(message){postMessage(func(message.data))}"
		]);

		// Obtain a blob URL reference to our worker 'file'.
		var blobURL = window.URL.createObjectURL(blob);

		var worker = new Worker(blobURL);
		worker.postMessage("ping"); // Start the worker.
		return worker
	}
	class Thread {
		constructor(func) {
			if (WorkerSupported) {
				this.worker = makeNewWorker(func);
				this.worker.onmessage = message => {
					// console.log(message);
					this.avalable = true;
					this.callback(message.data);
				}
				Threads.push(this.worker);
			} else {
				this.worker = new Function(func.toString());
			}
			this.func = func;
			this.avalable = true;
			this.callback = new Function();
		}
		post(message) {
			this.avalable = false;
			this.worker.postMessage(message);
		}
		on(func) {
			this.callback = func
		}
	}

	function dispose() {
		Threads.forEach(_ => {
			_.terminate();
		});
		Threads = [];
	}
	Workers.exports.dispose = dispose;
	Workers.exports.Thread = Thread;
	Helios.exports.Thread = Workers.require("all");
})(window)