Leveraging purify-ts EitherAsync to combine the results of two asynchronous calls.

EitherAsync captures two effects in one type:
- asynchronicity
- representing a forked outcome

Why EitherAsync over Promise?
There are a lot of problems with the Promise implementation in JavaScript (and TypeScript by extension).
Aldvin Vlasblom wrote a nice summary https://avaq.medium.com/broken-promises-2ae92780f33

This repo provides some examples to supplement the purify-ts examples.
