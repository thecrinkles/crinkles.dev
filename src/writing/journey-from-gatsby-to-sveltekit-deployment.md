---
title: Deploying my newly created SvelteKit website
date: 2021-04-07
archived: true
tags:
  - svelte
layout: post
description: >-
  After the local transition of Gatsby to SvelteKit was finished, it was time to get the website live! But did I manage to get it there?
---

After tackling the [development](/writing/journey-from-gatsby-to-sveltekit-development) of a SvelteKit version of my website, it is time to get it running in production! Or in this case, hosted on [Netlify](https://www.netlify.com). It was in this part I found out the _hard_ way that SvelteKit is in beta and not production-ready. Let me take you on my journey to get the website deployed on Netlify, and see if I was successful (spoiler: you are reading this on the SvelteKit version).

## Hosting on Netlify

Now that I had my website locally working, I had to get it deployed on [Netlify](https://www.netlify.com). SvelteKit has an `adapter-netlify` package. This package creates a Netlify function that acts as the 'server' for the SSR website. So I swapped the default `adapter-node` to the Netlify version and let GitHub and Netlify do the magic. And... errors.

This is the moment I found out why SvelteKit is still in beta. In general, all the packages are `devDependencies`. But, the Netlify Functions could not find the packages needed. So I moved the packages from `devDependencies` into `dependencies` and hit deploy again. Progress! The Netlify function can now find the package. Some issues remained, but progress nonetheless. Back to the local version to fix them.

![A lot of question marks](/img/questions.png)

But wait a minute? The local version is not working anymore? Apparently, [Vite](https://vitejs.dev), the local build tool, did not like it when I moved the packages. After trying several things, I gave up. As SvelteKit is still in beta, community resources are scarce. I did found a few [Sapper](https://sapper.svelte.dev) examples, the predecessor of SvelteKit, using the `adapter-static`. Success! Well... kind of.

I found that a few of my markdown files got transformed into pages correctly, but not all. After searching and debugging, I found the issue. The `adapter-static` traverses all links starting from the index route and generates pages for all the linked pages it can find. If a markdown file is not present as a link on a page (yet), it does not get generated.

::: callout
The `adapter-static` changes the solution from SSR to SSG: the pre-rendered HTML is generated on build time instead of runtime.
:::

## Optimizing the website for SEO

In general SSR and SSG are SEO-friendly ways to create modern websites. Both Gatsby and Svelte(Kit) should enable me to create an SEO-friendly website. I used the [web.dev measure](https://web.dev/measure/) tool to determine my website score. The homepage of the Gatsby version scored a 100 on all categories. But so does the SvelteKit version.

![Example of web.dev score card](/img/webdev-score.png "Example of web.dev score card")

But the scores are not the only metrics found in this tool. Most metrics were the same for both versions of the website, except _time to interactivity_. For the Gatsby version, this was around 2.4 seconds, while the SvelteKit version has a time of around 1.0 seconds. Both good scores, but SvelteKit is superior.

::: callout
**Time to interactivity**: the actual time it takes to load everything allowing the user to interact with the page
:::

This is driven by the files transferred on loading the page. The Gatsby version had to download around 950 kB across 24 files. The SvelteKit version only needs around 280 kB over 14 files. A big win for SvelteKit!

But we can test more than the homepage. Other pages did not score that well for SvelteKit. One of the bigger issues found by web.dev is redirects. At the moment of building the website, SvelteKit has _no_ trailing slashes in URLs [by design](https://github.com/sveltejs/kit/issues/192). But, Netlify [normalizes](https://docs.netlify.com/routing/redirects/redirect-options/#trailing-slash) all URLs to a version with trailing slashes. It adds the below redirect headers to each page.

```bash
/post-title /post-title/ 301!
```

By playing around with the 'Asset optimization' settings on Netlify, I was able to turn off this normalization. After redeploying and re-evaluating, the web.dev scores increased significantly. Now individual post pages score much better compared to their Gatsby counterpart. Especially on the 'time to interactivity' metric.

::: callout
Turning off all asset optimizations on Netlify increased performance on my website. But, it can have unwanted side-effect due to the lack of URL normalization. Use with caution.
:::

## Conclusion

When moving from the stable Gatsby to the unstable SvelteKit public beta, I took a risk. Not only did I have to learn a new framework, I had to build logic to replace community plugins. I was at risk of encountering bugs that few encountered before me. With the knowledge that I could not rely on Google or Stack Overflow, I jumped into the deep. But in the end, it all paid off. I build a new website that is not only faster but more enjoyable for me to work on. The experience that Svelte and SvelteKit bring is promising, and now I cannot shut up about it.

::: callout
If you are curious about the result, check the code on the open [GitHub repository](https://github.com/thecrinkles/crinkles.dev).
:::
