function Tree(title, duration) {
    this.title = title;
    this._children = {};
    this._tests = [];

    if (duration) {
        this._duration = duration;
    }
}

Tree.prototype.addTest = function (titles, test) {
    var title = titles.pop();

    // Add a leaf
    if (titles.length === 0) {
        this._children[test.title] = new Tree(test.title, test.duration);
        return;
    }

    // Add subtree if it isn't there
    if (!(title in this._children)) {
        this._children[title] = new Tree(title);
    }

    this._children[title].addTest(titles, test);
}

Tree.prototype.toString = function (indent) {
    indent = indent || '';
    console.log('%d\t%s%s', this.duration, indent, this.title)

    var children = Object.keys(this._children),
        that = this;

    children
    .map(function (childName) { return that._children[childName]; })
    .sort(function (a, b) { return b.duration - a.duration; })
    .forEach(function (child) { child.toString(indent + '  '); });
}

Tree.prototype.__defineGetter__('duration', function () {
    if ('_duration' in this) { return this._duration; }

    var that = this;

    return Object.keys(this._children)
        .map(function (childName) { return that._children[childName].duration; })
        .reduce(function (prev, cur) { return prev + cur; }, 0);
});

function SlowReporter(runner) {
    var doneTests = [];
    var passes = 0,
        failures = 0;

    function getParentTitles(t) {
        var parentTitles = [],
            tmpParent = t;

        while (tmpParent && tmpParent.title !== '') {
            parentTitles.push(tmpParent.title);
            tmpParent = tmpParent.parent;
        }

        return parentTitles;
    }

    // Store in a tree
    var T = new Tree('Whole Suite');

    runner.on('pass', function (test) {
        T.addTest(getParentTitles(test), test);
        //process.stdout.write('\rRunning: ' + T.duration + ' ms');
        //doneTests.push(test);
    });

    runner.on('fail', function(test, err){
        console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
    });

    runner.on('end', function(){
        //process.stdout.write('\r');
        T.toString();
        process.exit(failures);
    });
}


module.exports = SlowReporter;
