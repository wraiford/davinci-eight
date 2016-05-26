# EIGHT

EIGHT is a WebGL library for mathematical physics using Geometric Algebra

EIGHT is designed and developed according to the following principles:

1. Designed foremost to support Mathematical Physics using Geometric Algebra.
2. Manage WebGL shader complexity rather than trying to hide it.
3. Be un-opinionated at the lowest levels.
4. Assist with management of WebGL state and invariants.
5. Assist with GLSL boilerplate.
6. Assist with long running interactions, resource sharing and context management.
7. Provide reusable geometry abstractions on top of the core for productivity.
8. Provide smart shader program builders for productivity.
9. Facilitate use for research programming, education and demonstration.
10. Explicit is better than implicit.

Used here: [__https://www.stemcstudio.com__](https://stemcstudio.com)

## Why EIGHT?

8 = 2<sup>3</sup>, which is the number of dimensions in a geometric space over a vector space of 3 dimensions.

Geometric Algebra is what you get when you define an associative multiplicative product for vectors.

More simply, geometry makes more sense when it is done using Geometric Algebra!

## API Documentation

The `Globals` or top-level components represent only a small portion of what is available in the EIGHT library.
Drilling into the top-level componets will reveal a reusable structure for implementing your own components.

The HTML documentation is best experienced with the following settings:

1. Access    - Public/Protected
2. Inherited - Unchecked
3. Externals - Unchecked normally but Checked in order to see interfaces :(
4. Only exported - Checked (In order to ignore implementation details :)

The documentation is evolving rapidly due to transitioning to a new system of TypeScript documentation generation.
In particular, you may see the word `default` frequently. This is because the EIGHT code uses default exports.
In many cases we have reluctantly replaced default exports with named exports to improve the documentation.
Just click through the `default` links to get past them.
Please bear with us! It will be worth it!

## License
Copyright (c) 2014-2016 David Holmes
Licensed under the MIT license.
