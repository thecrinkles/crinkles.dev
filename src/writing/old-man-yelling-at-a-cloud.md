---
title: Old man yelling at a cloud
date: 2023-06-28
tags:
  - engineering
layout: post
description: >-
  Front-end development really became a pop culture around big company frameworks. It has become an investor-focused industry.
---

More often I feel like an ‘old man yelling at a cloud’ when it comes to front-end development. When I look at my peers (back-end developers) I sometimes envy them with the stability of their craft. More and more I see [Baldur Bjarnason](https://toot.cafe/@baldur) is right: [programming is a pop culture](https://www.baldurbjarnason.com/2022/programming-is-a-pop-culture/). Especially front-end development.

## What happened?

Yesterday it was brought to [my attention](https://fediverse.zachleat.com/@zachleat/110616530236633373) that NextJS is using a ‘canary’ version of React in their latest ‘stable’ version. I once adored this framework and Vercel, but this feels really odd to me. When this gets flagged, fans of React and NextJS get hostile. React is communicating that the ‘canary’ release is safe for frameworks to adopt. That is the main argument of NextJS and its fans. But there is more than enough conflicting messaging around it that is disregarded:

- React also states that expect most users not wanting to use the ‘canary’ version, yet the biggest framework is using it with their help.
- They state breaking changes can happen, but they will communicate it.
- In the new canary process they promise proper documentation. But the current canary version predates this process, so the documentation is non-existing. But NextJS still uses it.
- [React states](https://react.dev/blog/2023/05/03/react-canaries) they often do minor feature releases, but sometimes this is not possible. New features are interconnected with other new features. That is why they offer them via canary releases.

This all feels really conflicting. New features that are interconnected with ‘not-yet-finished’ features are the reason for canary releases. But if NextJS depends on one of these features, it means it depends on ‘not-yet-finished’ features. Otherwise, the feature NextJS is using is not interconnected, and just could be released to the stable version of React. This is just a dangerous move when you don’t have documentation, and you know most users don’t want this.

::: callout
The last stable release of React, version 18.2, was released in June 2022. A year ago since this article. In the meantime, NextJS 13 and recently 13.4 have been released.
:::

## Unfair competition?

I cannot help but feel two main things about this situation. This feels like unfair competition for React framework builders. NextJS can use undocumented canary features. Without close collaboration, others are not able to use these as long as the documentation is not updated. It does not help that NextJS is one of the few frameworks officially [pushed](https://react.dev/learn/start-a-new-react-project) by React itself.

## We are moving too fast

More importantly, I feel we are moving too fast. In our push for more new and shiny features, the frameworks we use are taking dangerous steps. 1-2 times a year a big breaking release is happening. New features are happening more often. Everybody wants to use the new shiny thing. But in this push framework creators are pushing unfinished features as the default. They let big names in the community support them. But none of them are taking the blame when things break.

Most software is created with the idea to last and evolve. Building software on top of volatile frameworks and libraries should not be recommended. React [used to be a good UI library](https://marmelab.com/blog/2023/06/05/react-angularjs-moment.html), but now it pushes new mental models every few years. From class components to hooks. From hooks to server components (that cannot work with hooks anymore?!). These frameworks do not change to keep developers happy in the long term. Their rate of change is focused on keeping investors happy.
