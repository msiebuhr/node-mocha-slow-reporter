function Tree(title, duration) {
    this.title = title;
    this._children = {};

    if (duration !== undefined) {
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

    console.log('%d ㎳\t%s%s', this.duration, indent, this.title)

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

Tree.prototype.__defineGetter__('length', function () {
    if ('_duration' in this) { return 1; }

    var that = this;
    return Object.keys(this._children)
        .map(function (childName) { return that._children[childName].length; })
        .reduce(function (prev, cur) { return prev + cur; }, 0);
});

function SlowReporter(runner) {
    var doneTests = [];

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

    runner.on('test end', function (test) {
        T.addTest(getParentTitles(test), test);
    });

    runner.on('hook end', function (hook) {
        T.addTest(getParentTitles(hook), hook);
    });

    runner.on('end', function(){
        //process.stdout.write('\r');
        T.toString();
        process.exit(0);
    });
}


module.exports = SlowReporter;
