---
title: I was wrong about service workers
pinned: true
date: 2023-07-28
tags:
  - javascript
layout: post
description: >-
  I was wrong about service workers. I wrongly assumed certain use cases for them. But I was missing out on them.
---

For years I have seen services workers as this magical concept for making progressive web apps. Or, you would use them to run very heavy operations parallel. Both cases I don't need. Not in my personal life, not in my professional life. **I was wrong**.

::: callout
For those wondering, you don't use service workers for heavy operations. Web workers are for heavy background operations. My perception on service workers was wrong here as well, all along.
:::

## A leaner web

Months back I decided I want to focus on a leaner and greener web. I started on the [Lean Web Club](https://leanwebclub.com/) from [Chris Ferdinandi](https://gomakethings.com). One of the topics he briefly teaches is _service workers_. It was the topic I saved for last. For an unknown reason, I had a mental barrier in starting to look into the topic.

But once I finally started on the topic, I quickly saw why it is a powerful tool. I now actually am very excited about the topic. It got me so excited that I read [Going Offline by Jeremy Keith](https://abookapart.com/products/going-offline) in a single night. Just don't mention to anybody that I got the book for several years already...

## What changed?

Well, that is simple. In my professional life, I have worked on several big single-page applications over the last few years. There are big B2B applications with a lot of complex dynamic screens. One of the biggest pains is the sheer amount of API calls you need to do to fetch all the data for the various pages. The same data is required in a lot of different places. Sometimes this data is dynamic, but often it does not change between the pages.

But we got packages for that! I am a big fan of using packages like [SWR](https://swr.vercel.app). They solve a lot of the fetching and caching of data. Almost no additional code is required to manage it. It tries to group the same request to avoid duplication. It automatically shows the cached version while retrieving an updated version. A lot of nice magic in the background. But it is still magic. And what if there are calls you just want to execute once and never again? Well, you have to work around that.

## How to use service workers to replace this

Service workers don't just work for caching assets (e.g. JavaScript files), but also for API calls. This is exactly the moment I was convinced of this technology. If we know which API endpoints we do not need to refresh that often, we can just cache them using the service worker. Let's assume an _offline-first_ strategy as visualized below.

![Offline-first strategy](/img/sw-strategy.png)

Let's first make the base of the service worker. In the below snippet, the `event.skipWaiting()` ensures our service worker will be running the moment it is downloaded and installed. In the second event listener, we see some checks to ensure we are looking at `GET` requests targeting our API endpoint.

```js
self.addEventListener("install", function (event) {
  event.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (!request.method === "GET" || !request.url.includes("/api")) return;

  event.respondWith(offlineFirstStrategy(request));
});
```

Now let's implement a simple `offlineFirstStrategy` function, so we can make use of the cache in its simplest form. We first need to check if our request already exists in the cache. If so, we are already done. If not, we make a fetch call, put the response in the cache, and return it. Next time the call is made, the response will exist in the cache!

```js
async function offlineFirstStrategy(request) {
  let response = await caches.match(request);
  if (!response) {
    response = await fetch(request);
    const cache = await caches.open("api");
    await cache.put(request, response);
  }
  return response;
}
```

This is of course a very simple implementation. There are many things to consider while working with caching, such as the list below.

- How long will data be valid in the cache?
- Does everything need to be cached?
- Should entries be removable based on user actions?

## Wrapping up

I was wrong about service workers. They are not just for progressive web apps. They can just as easily be used for better caching of data in big single-page applications. It helps in point-specific performance optimization. This might even be a better use case for them in general. I know it is for me.
