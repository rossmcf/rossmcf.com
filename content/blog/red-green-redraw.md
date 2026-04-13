+++
title= "Red, Green, Redraw"
description= "Using the TDD cycle for incremental design."
date= "2017-03-06"
highlight= "true"
+++

I've been tinkering with a coding project recently, and like any good toy project it's giving me the opportunity to play with some new stuff. Faced with a world of possibilities, and just a Saturday morning to make some progress, I've found it easy to get lost, or even anxious. Even though it's a fun project, it's going to need a bit of rigour if I'm to avoid an interminable cycle of re-writing my grand plans.

When I'm coding, I deal with this by falling back to the trusty Red, Green, Refactor cycle of [TDD][]. I've heard Kent Beck describe how this helps him overcome his own anxiety when faced with a complex problem. This weekend, I wondered if I could apply the same approach to design, so I got in front of my empty whiteboard and made a start.

I started off with a requirement:

> Thing must do X

Does my design do that? Well, it's empty, so no. Red. I then drew the dumbest possible class diagram needed to implement X. All I need is an `Xer`. That'll do. Green. Is that the best design given what I'm implementing? With just one requirement, probably. Now, what's next…

> Thing must to X, if Y

Does it do that? Nope. Red. The dumbest implementation is to have another class that does just that, an `XifYer`. Will it work? Yup. Green. Now then, that looks a bit ugly, let's parameterise my `Xer` and tidy this up.

The joy of a process like this is that whiteboard pens are cheap, and classes are far easier to draw than to code. Crucially, though, it concentrates effort on the thing at hand. Just one feature. Just one refactoring. Every now and again I might feel the need to overhaul large swathes of the diagram, but I only need to do that to accommodate the features already included, rather than consider every eventuality. From time to time, I'd get ahead of myself and think of a bunch of requirements, so I just stuck those on a backlog until I was ready.

Has it worked? I think so. In the end, I spent less time, and arrived at a better-resolved design than I'd come up with thus far. Of what I've implemented so far, the intention is clear, and I'm not constantly second-guessing my design decisions. To me, so much of the challenge of software engineering is in turning a big, many-faceted problem into busy work I can just crank through. Taking a TDD-style approach to design helped me to do that. 
