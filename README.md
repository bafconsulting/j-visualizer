# JVisualizer Core

JVisualizer is a framework for simplifying data visualization in web applications by
defining structuring conventions relevant to creating views of data:

 * `Modules` are used to model data minimally
 * `ModuleViews` include instructions for building and clearing visualizations relevant to a particular Module
 * `Scenes` allow many ModuleViews to be displayed as widgets, and help with building the overall visualization efficiently
 * `World` simplifies the visualization viewport, makes sizing data and element finding available to ModuleViews
 * `Colorer` provides tools to easily provide color themes, and fetch these relevant colors
 * `Visualizer` wraps it all together, ensures the latest data's always displayed in the correct Scene

Using Ember observers, the JVisualizer responds to environmental and data changes automatically.
In complex visualizations, switching between the many views can be done in one line by changing the viewed `Scene`.

JVisualizer also provides several generic utilities often used in data modeling/visualization.

## Getting Started
### Building a Simple Visualizer App (A Guide)
Coming soon!

### Prerequisites
 * Ember-runtime (Please update spec/bower.json to specify newer versions as needed)
 * JQuery

For Testing:
 * bower (`npm install -g bower` from `spec` directory - if you don't have npm, install node)

For Building:
 * grunt and lib dependencies (run `npm install` from `root`)

Note: All prerequisites for running JVisualizer can be retrieved from the spec dependencies.

### Building JVisualizer
To build JVisualizer Core, ensure grunt and its package dependencies are available
by running `npm install` from this project's `root`.

Next we can compile the coffeescript to javascript by running
`grunt coffee`

After this we can create a minified copy by running `grunt uglify`; alternatively
chain them together, `grunt coffee uglify`, to get both builds at once.

### (Q)Unit Testing
QUnit is used for unit testing this library.
To run the unit tests, first ensure all dependencies are available by running
`bower install` in the `spec` directory, and `npm install` in the `root` directory.

Once the dependencies are in place, run `grunt coffee qunit` from the `root` directory.

### Building YUIDoc API:
Ensure grunt and its package dependencies are available (same a build instructions above.)
Once the dependencies are in place, run `grunt coffee yuidoc` from the `root` directory.

### Full Build and Test:
The full set of operations: compiling coffeescript, uglifying, running unit tests, and building documentation,
can be performed by simply running `grunt` from the root directory (requires all package and spec dependencies.)