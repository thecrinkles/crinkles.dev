---
title: I cannot wait for the CSS @function
date: 2024-12-29
tags:
  - css
layout: post
description: >-
  In my quest to apply as much cool CSS tricks as possible, I encountered an issue that navigated me towards a new and exciting CSSWG draft.
---

Some of you know by now that I am a sucker for nice CSS tricks. A few weeks back I came across another [beauty](https://bsky.app/profile/devongovett.bsky.social/post/3lcedcdj4qk2y) (or [another](https://lea.verou.me/blog/2024/contrast-color/)). In short, the snippet below automatically determines if `color` needs to be black, or white, based on the background color (set with `--contrast-bg`). I liked this trick so much, that I added the _utility class_ below to [Feo.css](https://feo.crinkles.dev/utilities/contrast/).

```css
.contrast {
  background-color: var(--contrast-bg);
  color: lch(from var(--contrast-bg) calc((49.44 - l) * infinity) 0 0);
}
```

## Downside of a utility class

With this new trick in my toolkit, I started to clean up some of the CSS for this very site. There were a few small places where I wanted to use this new trick. One of them is the “info boxes” I place in articles. Like the one below.

But this block is automatically generated in my setup ([11ty](https://www.11ty.dev) and [markdown-it](https://github.com/markdown-it/markdown-it)). I cannot add a utility class, or any other CSS class really, to it. It only gets a `.info` class in the build-step. So the only solution is to apply the trick directly in this class. But let’s be honest, the snippet below is not an easy one to remember.

```css
lch(from var(--bg) calc((49.44 - l) * infinity) 0 0);
```

## CSS custom properties to the rescue, or not?

> Why not make it a global custom property?! <cite>Kevin Pennekamp (me...)</cite>

This was me trying to be clever. If I cannot apply a utility class, maybe a global custom property is a solution. CSS custom properties are extremely flexible. You can define “APIs” for your classes that you easily overwrite elsewhere. With this in mind, I created a global property.

```css
:root {
  --contrast-color: lch(
    from var(--contrast-bg) calc((49.44 - l) * infinity) 0 0
  );
}
```

I don’t think it was a bad idea. This snippet defines a custom property as a function, even when that was not how I intended it. But for obvious reasons, it just does not work. Let me break it down a bit, with a simple solution.

```css
:root {
  --derived-bg: var(--bg);
}

.block {
  --bg: blue;
  background-color: var(--derived-bg);
}
```

At first, you might think any element with the class `.block`, would have a blue background. But as I said, custom properties are not functions. For those familiar with certain JavaScript frameworks (e.g. React), CSS custom properties are not reactive and do not have a _dependency array_. This means that they do not update themselves whenever another custom property updates.

This means that `--derived-bg` is determined on the `:root` element once loaded. But as `--bg` was not set at that moment, `--derived-bg` is `<empty>`. Similarly, my custom property for `--contrast-color` only works if `--contrast-bg` is set simultaneously.

## The CSS `@function` module draft

In June 2024 a new draft was published by the CSS Working Group (CSSWG). This draft includes the `@function` and `@mixin` for CSS. Bringing it closer to its siblings like SASS and SCSS. When this draft gets implemented (in its current form) by browsers, it will allow us to write functions (duh)! It would allow us to create a `--contrast` function.

```css
@function --contrast(--bg) {
  result: lch(from var(--bg) calc((49.44 - l) * infinity) 0 0);
}
```

Mixins could be another way to achieve the same result but differently.

```css
@mixin --contrast {
  background-color: var(--contrast-bg);
  color: lch(from var(--contrast-bg) calc((49.44 - l) * infinity) 0 0);
}

.info {
  --contrast-bg: red;
  @apply --contrast;
}
```

Both would be a much more convenient implementation in a CSS framework/library than remembering the very specific snippet for contrast. Unfortunately, we will have to wait a few years before browsers will adopt this draft.

::: info
For more information about this draft, check this article from [CSS Tricks](https://css-tricks.com/css-functions-and-mixins-module-notes/).
:::

## Wrapping up

Ok sure. The first “issue” I encountered where a native `@function` or `@mixin` would be a good solution is not a big one. It is the first one in a few years as well. But still, knowing `@function` might become part of CSS in the future sparks joy in me. It’s these types of additions to my favorite language that open a lot of creativity. `:has` done this in the past few years. And I am sure `@function` and `@mixin` will do the same. If they will ever see the light of day.
