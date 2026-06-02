---
title: Engineering, UX design and the value stream
date: 2023-02-20
update: 2023-06-22
tags:
  - engineering
layout: post
description: >-
  Understanding how to make better technology, framework, and library decisions in front-end development
---

::: callout
_Update August 2023_: When archiving older articles, like [this](/writing/ux-engineering-alignment), I have decided to combine some findings from that article into this one.
:::

It has always been a pleasure for many of us to complain about frameworks, tooling fatigue, over-engineering, and whatsoever. The biggest argument is always that these choices focus on the developer and often disregard the user. While I agree with this sentiment _most of the time_, I feel we forget something when voicing it. We forget to look at why and when technology decisions are made. In addition, we do not teach about the impact of our decisions. Not only on our users but on ourselves in the long run.

## What is the value stream

One concept that is often overlooked is the _value stream_. It dictates a set of high-level actions required to deliver value to our users. It is a simple concept that provides insights into decision-making and the impact of these decisions. The high-level web value stream is shown below.

![The web development value stream](/img/value-stream.png)

1. **Concept**: the formalization of an idea or business objective combined, incl. the value we want to deliver.
2. **Design**: converting a work item into an implementable design accepted by developers.
3. **Develop**: the implementation step of the static designs into an interactive result.
4. **Test**: validation and verification through automated tests, user acceptance tests, etc.
5. **Deploy & operate**: build, deploy, and operate the system to ensure it keeps delivering value.

The value stream lives on macro- and micro-level. Entire systems or even the smallest feature or change follow the same steps to deliver value. The idea is that you _optimize_ your work for the next action or step. With users at the end. Reverse engineer this and you optimize your result for the users.

## Value is economics

I believe people make technology or framework decisions based on personal preference. We choose what we like and what makes us feel productive. What allows us to deliver features _fast_. This is a clear ‘project-like’ mindset. We optimize for the initial implementation cost. This fits projects perfectly. In all cases, we are constrained by budget and timelines.

> The value stream optimizes for value over time

But, the value stream of users optimizes for value over time. It looks beyond just the features that we deliver. It looks at the running costs, maintenance costs, availability for our users, speed, etc. These are two different equations. Both need to be balanced.

Many fix the technology decision right at the start. But the decision impacts a lot of steps down the chain. A modern JavaScript framework requires a compiler, bundler, CSS compiler, linters, postCSS, etc. We need this locally and in our build pipelines. A lot of setup and configurations, just to get a project started and deployed. While a simple HTML file is accessible straight away.

> It’s just important to realize it is really about delivery. <cite>Marty Cagan</cite>

## Designing a solution

I think it is fair to assume that as engineers we spent most of our time in delivery, while our UX colleagues are on discovery. At some point, we need to come together and align. Both need to enable the other to do a better job than they already did. Engineers can create products that enable UX designers to easily extract metrics that help them make better decisions. On the other hand, UX designers can enable engineers to create better products faster, by providing systems they can implement and use in decision making. The primary alignment happens in a _design_ step.

![The web development value stream with highlight of the design step](/img/value-stream-part-2.png)

This is also the moment where we should consider technologies. Making the decisions earlier limit your possibilities within the design step. Choosing a single-page application (SPA) right from the start impacts how you build your system design. For instance, a SPA has a heavy client-server communication load. This might not fit the requirements from the _concept_ phase, at all. It is important to postpone this decision until you know _just enough_ to make good decision decisions.

And do not start saying “but we do not always know what our users want”. Technology choices are hardly ever driven by functional requirements.[Quality attributes](https://en.wikipedia.org/wiki/List_of_system_quality_attributes), have a much bigger impact on the decisions we have to make. They are a great way to understand _value over time_. Some general rules I believe you can use to make decisions:

- _Compatibility_: frameworks evolve fast, but so does the web platform. Frameworks gave us components, but once the web gave us web-components, some frameworks failed to adopt it (looking at you [React](https://custom-elements-everywhere.com/libraries/react/results/results.html)). The web platforms is backward compatible, frameworks are not.
- _Stability_: reduce the number of dependencies in production code and (build-)tooling. Staying close to native web technologies is one way to achieve this. It is not the only way.
- _Portability_: good software design reduces the _cost of change_. Want the ability to switch between tools or even frameworks? Stay close to the web platform.
- _Performance efficiency_: focus on web performance metrics, never go for a SPA framework.

The decisions we make should not only be driven by (non-)functional requirements. Most development work that we do are limited to (business) constraints we need to work with. Budgets and timelines are of course our worst enemies. When you have a team of React developers you cannot easily introduce native web components. And let’s not forget that someone has to maintain the build infrastructure. This can be painful in a big corporation.

## How decisions impact value over time

I hear you thinking: “but modern frameworks and their ecosystems are big and stable”. They are not. When running long-term products, there is a fair chance you will hit issues you never thought of. Issues outside of your comfort zone. Things have nothing to do with building features and values for your customers. Let me outline an issue I encountered around 9 months ago.

Out of nowhere the build pipeline of a big project broke (>1.5 years). After looking at the logs I saw the SASS compiler broke. This did not make any sense. The code was not touched in weeks, and the builds were running fine in the meantime. So what was the issue? One of the peer dependencies in our build setup received a minor update. Our build is an abstraction on top of different compiler steps. The peer dependency itself was not broken with the new version, but our abstraction was. One problem though, our abstraction is an open-source maintained package.

As this issue impacts our ability to push updates to production, a solution needs to be found. But, in the build abstraction package, we use h as a slow cycle time. It could be months before a fix would be pushed. (disclaimer: now, after 9 months it is not updated properly, and is flagged as not maintained anymore). A temporary fix was found with limited impact. The permanent fix was to replace the entire abstraction, including all underlying dependencies. This required manual verification of develop, test and production builds to ensure they were still working. It took the entire team weeks to verify everything.

::: callout
Unit tests use only a part of the build setup, if at all. End-to-end tests hardly cover 100% of all functionalities. To ensure that such a crucial step as code compilation does not break anything, manual verification is your only option.
:::

## Wrapping up

Even when “choice X” is more focused on developers than users, does not mean you should never choose to use it. Technology decisions should be made on so much more. It is a numbers gain. You should choose technology, frameworks, and/or libraries based on their value of time. It is a balance between different non-functional requirements, given different constraints. In the end, a “suboptimal solution is better than no solution at all”.
