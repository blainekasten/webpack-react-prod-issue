This shows a strange bug with webpack not handling the DefinePlugin correctly.

Ultimately it comes down to importing some corejs modules that somehow convince it not work.
@see [here](/src/index2.js)
