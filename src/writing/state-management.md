---
title: State machines and state management
date: 2021-12-08
update: 2023-06-20
tags:
  - architecture
layout: post
description: >-
  State management is one of the most complicated, and opinionated topics in modern and JavaScript-focused front-end development. Let's make it easier.
---

::: info
**Update June 2023**: added a section outlining what my current approach is.
:::

State management is one of the most complicated, and opinionated topics in modern and JavaScript-focused front-end development. But at its core, it is not that complicated. We just make it complicated. In this article I will try to demystify state and state management for you, and challenge your mental models around them.

## What is state?

Is state some weird data storage? Is it the data from a database? No. State is nothing more than a JavaScript value that lives within in scope. It can be a boolean, a string, but is in most cases a (complex) object. But it remains a value. In most cases, it is even an object living on the same level as the `window` object. It has become a global value in the JavaScript environment, the browser window. From our code (e.g. UI components), we can use this value to determine what to show or what interactions to allow. In complex applications there are a few different types of state we can have. But remember, they are nothing more than values.

- **UI**: state that is used by a single, or a set of UI components. It is used to control what we can see, how we interact (e.g. input fields) on a detail level. UI state can exist on a global level as well (e.g. dark-mode).
- **Remote**: state from the server that is cached on the client for quick and easy access for all UI components. The remote state should not deviate from the server, except when applying [optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/).
- **URL**: information stored in the URL, like object IDs or filter information, that can be used to determine what to render, or what information to retrieve from the cache/server on (initial) rendering of the page.
- **Meta**: also known as 'state about state'. A common example is a loading state around fetch requests.

## State management

So what about state management? For many, state management feels like a black box. What is happening within Redux? Why does it feel so complicated? I look at it this way: State management is nothing more than patterns to make it "easier" for us to change state.

> State management is nothing more than patterns to make it "easier" for us to change state

In modern front-end there are several different patterns that are popular to use these days.

- **Flux**: the popular pattern behind the "Redux" package. It centralises your state and allows you to define "actions" that mutate state. The UI has the ability to dispatch these actions onto the store.
- **Proxy**: a layer that acts as an intermediate on top of your state. It allows you to predefine possible mutations and add observability to give your state an _reactive_ nature.
- **Signal**: signal is a value that changes over time and whose change events can trigger side effects. It is _reactive_ by nature.
- **State machines**: restricts the possible states something can be in, and limits the possibilities to move from one state to another (for more info [check here](https://statecharts.dev/what-is-a-state-machine.html)).

## What to use?

Different types of state require different solutions. There is no single state management solution that works best for all. The framework or library that you are using limits or helps you as well with this decision. React offers a big ecosystem and a lot of choices. Like a lot. But Svelte on the other hand has a tremendous implementation right out of the gate.

My own approach is a mixture of different patterns for different purposes. For _remote state_ I would use [service workers](/writing/i-was-wrong-about-service-workers) or create/use a library around ['state-while-revalidate'](/writing/data-fetching-swr-svelte). This s a great example where _state machines_ In the background these are powered by _state machines_ to avoid unwanted caching side-effects.

For things like application state or meta state, it highly depends on the complexity of the challenge. If it is something simple, a small _reactive_ store like a _signal_ or a flat _proxy_ suffices. However, it the challenge becomes more complex I will choice one of two routes:

1. If there are many actual 'states' I would model everything in a _reactive_ [state machine](/writing/the-case-for-state-machines).
2. If the goal is data manipulation in many ways, I would go for a _reactive_ _proxy_ that allows me to define a state API. These are functions defining how I can interact with the state (e.g. the [chifferobe](https://github.com/thecrinkles/chifferobe) package).

The common theme in my approach is reactivity. Even an "SWR-like" library is reactive. The thing is, in front-end development we always want something to _change_ when our state changes.

## Wrapping up

Now you should have a better understanding of some fundamentals of state management. Knowing the different types of state and how to manage state is the start. With proper state management, you can get a long way in complex web applications. But it is the start. There are many (more) ways to manage data that are important in client-side applications. When you master state, go dive into persistent storage or caching.
