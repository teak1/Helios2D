((window) => {
	var ThreadAgent = Helios.require("module")();
	var Thread = Helios.require("Thread");
	class _ThreadAgent {
		constructor() {
			this.threads = {};
			this.count = 0;
			this.maxThreads = 100;
			this.functions = [];
		}
		addFunctionThread(func) {
			if (this.functions.includes(func)) return;
			if (this.count >= this.maxThreads) throw new Error("threads maxed out, are you adding threads in a loop?");
			this.functions.push(func);
			var id = func.toString();
			this.threads[id] = this.threads[id] || new _TAFunc(func, this);
			var thread = new Thread(func);
			this.threads[id].register(thread);
			return this.threads[id];
		}
	}
	class _TAFunc {
		constructor(func, Agent) {
			this.Agent = Agent;
			this.return = new Function();
			this.function = func;
			this.threads = [];
			this.next = 0;
			this.localLimit = 5;
		}
		register(thread) {
			thread.on((a) => {
				// console.log(a);
				this.return(a);
			});
			if (this.Agent.count > this.Agent.maxThreads) return;
			this.threads.push(thread);
		}
		run(args) {
			for (var i = 0; i < this.threads.length; i++) {
				if (this.threads[i].avalable) {
					this.threads[i].post(args || "");
					return;
				}
			}

			if (this.Agent.count > this.Agent.maxThreads || this.threads.length < this.localLimit) {
				this.next++;
				this.next = this.next % this.threads.length;
				this.threads[this.next].post(args || "");
				return;
			}
			this.Agent.count++;
			this.threads.push(new Thread(this.function));
			this.run(args || "");
		}
		setReturn(func) {
			this.return = func;
		}
	}
	ThreadAgent.exports.ThreadAgent = _ThreadAgent;
	Helios.exports.ThreadAgent = ThreadAgent.require("ThreadAgent");
})(window)