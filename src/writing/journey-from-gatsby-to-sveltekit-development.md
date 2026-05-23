---
title: Journey from Gatsby to SvelteKit
date: 2021-04-07
archived: true
tags:
  - svelte
layout: post
description: >-
  Recently I rebuild my website in SvelteKit, coming from Gatsby. Not only did I had to learn a new framework/format, I also jumped the gun and moved from a stable environment to a public beta!
---

For the last few weeks or months, I was getting restless about everything: my work, my website, the environment, the World. I had to find something to change my focus to, restore my energy. Around a week or two ago, I found the news of [SvelteKit going into public beta](https://svelte.dev/blog/sveltekit-beta). This sparked excitement in myself I had not felt in a long time. So during Easter weekend, while in a Corona lockdown, I started with a new journey. An exciting journey. I was going to learn a new framework and rebuild this website! Or at least, try.

## Introducing Svelte and SvelteKit

[React](https://reactjs.org) is a JavaScript library that makes it easy to write UIs. As it is a library, your code plus the library is shipped to the browser and executed there. Also, you have to write your HTML (or JSX) inside the `return` of a function, while other lifecycle information is also encapsulated inside that function. [Gatsby](https://www.gatsbyjs.com/) is a _static site generation (SSG)_ solution build on top of React, and was used in the previous version of this website. An easy next step would be migrating to [Next.js](https://nextjs.org/), a _static-site rendering (SSR)_ solution build on React. But then I came across the news of the SvelteKit public beta.

::: info
**SSG vs. SSR**: in both cases the server is responsible to pre-render the requested HTML page (in contrast to client-side rendering (CSR)). With SSG this happens at _build_ time: all possible pages get pre-rendered. With SSR this happens at _runtime_: upon a page visit, the HTML gets pre-rendered using a template.
:::

[Svelte](https://svelte.dev/) is not a library or a framework, it is a compiler. This means that your code is not shipped in combination with packages to a browser, but it gets compiled to something else. This something is shipped to the browser. Because all code gets compiled, the total size decreases, but the performance increases. Besides, it allows you to break away from writing everything inside a JavaScript function, and have its optimized format.

[SvelteKit](https://kit.svelte.dev/) is for Svelte, what Gatsby and NextJS are for React. It is an opinionated framework build on top of Svelte that allows you to create SSR (and SSG) websites and applications. At its core, it uses a flexible filesystem-based routing in the `/routes` directory. Not only do the templates for the pages in this directory, but the code that runs on the server is co-located here as well. It is the next iteration of the Sapper framework. So a great choice for a blog-driven website.

## Working with (S)CSS in SvelteKit

I am a big fan of CSS and have a strong [opinion](https://feo.crinkles.dev) on how it should be applied to websites/projects. My setup allows me to extract general layout patterns and combine them with general utility-first CSS. When I read about the 'scoped' styles of Svelte I got a bit anxious. Would my way of working deviate too much from Svelte(Kit)?

But quickly it hit me. The combination could work perfectly. It could allow me to create global `layout` and `utility` CSS, and use the 'scoped' CSS of Svelte to add styles specific to components or pages. The styles defined in the Svelte component could replace the entire `block` directory of my framework. This means that components would look something like shown below. On the `div` instead of the `header` tag, you see various utility classes applied, but also the defined `.inner` class.

```html
<header>
  <div class="inner | flex --row mb-0">
    <Logo />
  </div>
</header>

<style lang="scss">
  header {
  	... .inner {
  		...;
  	}
  }
</style>
```

This worked beautifully, for the most part. The compiler of Svelte is smart enough to identify unused local styles, and not bundle them. However, in SvelteKit you can render an HTML string using the `@html` flag. The compiler cannot link the two and will flag local styles as unused. This results in styles not being applied, but also not bundled. You cannot find the styles with the browser Inspection Tool, they do not exist. To solve this issue, the `:global()` helper has to be used. But except for that, even my opinionated way of working just works.

```html
<style>
  :global(.post h2) {
    ...;
  }
</style>
```

I think I am good at CSS, but bad at animations. I know my way around CSS transitions, but that is as far as I go. Luckily Svelte got a lot of sweet stuff built in. The `svelte/transition`, `svelte/animate`, `svelte/easing` (and potentially more) packages really make your life easier. They enabled me to implement page transitions (with the code below), or logo hover animation with ease. These little touches credit the name of my website, Crinkle.

```html
<script>
  import { fly } from 'svelte/transition';
	const settings = { y: 50, duration: 250 };
<script>

<main in:fly={settings} />
```

## Setting up the markdown file handling

But I do not write my articles in HTML, Svelte, or React, I write them in markdown. With Gatsby several steps had to be taken to make it all work:

1. The markdown files inside the `/pages` directory needed to have a template name indicated as an attribute in the front-matter section.
2. In the `gatsby-node.js` file you put the code on how the actual files should be handled. With a GraphQL query, all pages can be retrieved and you can transform the data into the format you require in your template file (e.g. in my case I had to extract the _next_ and _previous_ articles).
3. The template file, located in a `/templates` directory allows query (again through GraphQL) an object defined (in my case an article and the adjacent articles) in the previous step can be obtained and transformed into an HTML page through React components.
4. Configure a shit tone of plugins to handle images, code highlighting, relocation of files, etc. in the `gatsby-config.js` file.

I don't know about you, but I found it not developer-friendly. Things are scattered everywhere, it is unclear why you have to use GraphQL everywhere, and the plugins obfuscate the actual logic. SvelteKit is much more intuitive. The `/routes` directory holds the code for rendering the pages, not the markdown files. It combines the `/templates` and parts of the `gatsby-node.js` corresponding to a page in one place. This co-location makes much more sense.

The `[slug].json.js` file contains the logic of transforming a markdown file in a JSON structure that can be sent to a browser. `slug` corresponds to the filename without the extension. Instead of installing several plugins, I only had to install three npm packages, nothing more, nothing less.

- `front-matter`: to read additional attributes at the top of the markdown file.
- `markedjs`: parse markdown into HTML.
- `prismjs`: add code highlighting.

The resulting JSON string is returned at the end of the function. On the `[slug].svelte` side, we need to fetch the generated JSON and return it in the `props`. We can then expose the property as shown below. This allows us to use the `article` object in the rendering code of this svelte plugin.

```html
<script context="module">
  export async function load({ page, fetch }) {
    const article = await fetch(`/writing/&{page.params.slug}.json`);
    const props = { article };
    if (res.ok) return { props };
  }
</script>

<script>
  export let article;
</script>
```

All the above was sufficient to have my Gatsby website transformed into a SvelteKit website, almost. There were small issues left. For instance, images on the articles were wrapped in a `<p></p>` tag, which made a [styling element](/writing/css-layout-patterns#dynamic-centered-layout) I used impossible (until the [`:has()`](https://drafts.csswg.org/selectors-4/#relational) gets released). But luckily you can alter how `markedjs` works.

```js
import marked from "markedjs";

marked.Renderer.prototype.paragraph = function (text) {
  if (text.startsWith("<img")) return text;
  return "<p>" + text + "</p>";
};
```

With a few more of these alterations (lazy loading of images and anchor tags on headings), I was able to create the same website in SvelteKit. Or even a better website, with [less code](https://drafts.csswg.org/selectors-4/#relational).

## Conclusion

Up until this moment, the development experience (DX) of Svelte and SvelteKit has been tremendous. Don't get me wrong, I loved Gatsby the first time I used it. But after working with Svelte(Kit) I found its DX inferior to SvelteKit. For UI components that do not require (a lot of) state management, Svelte is also superior to React. But when moving to SvelteKit, you loose the community and plugins of Gatsby. This makes Gatsby superior for less tech-savvy people, or when you want to move quicker and do not want to control each detail. In my [next post](/writing/journey-from-gatsby-to-sveltekit-deployment) I will tell you all about getting the new website live!

::: info
If you are curious about the result, check the code on the open [GitHub repository](https://github.com/thecrinkles/crinkles.dev).
:::
