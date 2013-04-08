function SlowReporter(runner) {
    var doneTests = [];
    var passes = 0,
        failures = 0;

    // Store in a tree
    var tree = {};
    function addToTree(test) {
        function getParentTitles(t) {
            var parentTitles = [],
                tmpParent = t;

            while (tmpParent && tmpParent.title !== '') {
                parentTitles.push(tmpParent.title);
                tmpParent = tmpParent.parent;
            }

            return parentTitles;
        }

        function addAggregateTime(titles, currentTree, test) {
            var title = titles.pop();
            // A leaf?
            if (titles.length === 0) {
                currentTree[title] = {
                    title: test.title,
                    _duration: test.duration
                };
                return;
            }
            if (!(title in currentTree)) {
                currentTree[title] = {};
            }
            addAggregateTime(titles, currentTree[title], test);
        }

        var parentTitles = getParentTitles(test);
        addAggregateTime(parentTitles, tree, test);
    }

    function getSubTreeTime(currentTree) {
        currentTree = currentTree || tree;

        if ('_duration' in currentTree) { return currentTree._duration };

        var keys = Object.keys(currentTree);

        // Figure out total time for each key
        currentTree._duration = keys.map(function (treeName) {
            return getSubTreeTime(currentTree[treeName]);
        }).reduce(function (prev, cur) { return prev + cur });
        
        return currentTree._duration;
    }

    function printTreeTimes(indent, totalTime, currentTree) {
        indent = indent || '';
        currentTree = currentTree || tree;
        totalTime = totalTime || getSubTreeTime(currentTree);

        // Leaf? Print those
        if ('title' in currentTree) {
            //console.log('%d%s%s', currentTree._duration, indent, currentTree.title);
            return;
        }

        var keys = Object.keys(currentTree);

        function prettyPrintSubtreeTime(total, part) {
            if (part === 0 || total === 0) { return '0%'; }
            return (Math.floor(total/part * 10000)/100).toString(10) + '%';
        }

        // Sort sub-trees by their aggregate times
        keys
            .filter(function (key) { return key !== '_duration'; })
            .sort(function (a, b) {
                return currentTree[b]._duration - currentTree[a]._duration;
            })
            .forEach(function (key) {
                var dur = currentTree[key]._duration;
                //if (dur === 0) { return; }
                console.log(
                    '%d\t%s\t%s%s',
                    dur,
                    prettyPrintSubtreeTime(dur, totalTime),
                    indent,
                    key
                );
                printTreeTimes(indent + '  ', totalTime, currentTree[key]);
            });
    }

    runner.on('pass', function (test) {
        //var sys = require('sys');
        //process.stdout.write('\r', doneTests.length);
        doneTests.push(test);
    });

    runner.on('fail', function(test, err){
        console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
    });

    runner.on('end', function(){
        doneTests
        //.filter(function (test) { return test.duration >= 5; })
        .sort(function (a, b) { return a.duration - b.duration; })
        .forEach(function (test) {
            addToTree(test);
            //console.log('%d: %s', test.duration, test.fullTitle());
        });
        printTreeTimes();
        process.exit(failures);
    });
}


module.exports = SlowReporter;
