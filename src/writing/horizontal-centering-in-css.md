---
title: Horizontal centering in CSS
date: 2021-06-20
tags:
  - css
  - layout
layout: post
description: >-
  Horizontal centering is an ancient problem in CSS. With CSS Grid we are able enhance this layout pattern. But, this gives us other issues. Let's find a better solution.
---

In a previous [article](/writing/css-layout-patterns) I wrote about modern CSS layout solutions. As horizontal centering is a common layout pattern, the grid-based solution was a prime candidate to convert into a generic class when creating [Bace CSS](https://feo.crinkles.dev). But I encountered an issue. When combining this solution with other CSS layout patterns (e.g. the [stack](https://feo.crinkles.dev/stack) pattern) my layout would break. Both patterns are targeting the `display` property, but with different values. To allow both patterns to work together, I had to find a different solution.

> 04-2022: Based on some new insights, the proposed solution of this article has been updated.

## The center layout pattern

The _center_ layout pattern allows you to horizontally center elements on the screen. But more importantly, it allows child elements to have a different width as the parent. These can be images that span the entire width of the screen in articles, regardless of the screen size. Or when we want selected elements to break away from the paddings on the side. On small screens, we want small padding around the text, and images span the entire width.

![The wanted responsive centering effect](/img/css-center.png)

## CSS grid-based solution

This solution creates a three-column grid. The outer columns act as the padding and overflow of the layout. By giving them a minimum width via `minmax(1rem, 1fr)`, you ensure small padding exists on small screens. The center column takes the space required for the content but is capped at the maximum width. You can achieve this with `minmax(auto, 60ch)`. This gives the combined implementation as displayed below.

::: info
The used examples make use of CSS custom properties. This allows for adjustable layouts based on utility classes. Examples can be found in [Feo CSS](https://feo.crinkles.dev/center).
:::

```css
.center {
  --gap: 1rem;
  --mw: 50rem;

  display: grid;
  grid-template-columns:
    minmax(var(--gap), 1fr)
    minmax(auto, var(--mw))
    minmax(var(--gap), 1fr);
}

/* Center all children */
.center > * {
  grid-column: 2;
}
```

By overwriting the default `grid-column: 2` to `grid-column: 1 / -1`, you can achieve the effect described in the previous section. This effectively makes the element the same width as the entire grid, not only the center column.

```css
.center > .exception {
  grid-column: 1 / -1;
  width: 100%;
}
```

But this has a downside: does not allow to set a different `display` value on the parent element. This makes `.center` less useful for non-article-based elements.

## Back to the old school solution

In finding a solution for my problem, I looked at the solution that was used years before CSS grid became a thing. On Stack Overflow, you will still find enough answers pointing to this solution. Of course, I am talking about the `margin: 0 auto` solution. Let's modernize it a bit though.

```css
.center {
  --gap: 1rem;
  --mw: 50rem;

  width: 100%;
  max-width: var(--mw);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--gap);
  padding-right: var(--gap);
}
```

This is always a solid solution for horizontally centering solutions. But it has one issue though, and the reason why I did not use it in the first place. It does not easily allow child elements to 'overflow' and has an increased width. This issue can be avoided by using the method below. However, I found that this gave me issues with the responsiveness of the exception elements. So my search for a better solution continued.

```css
.exception {
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
```

## Out with the old, in with new

By slightly adjusting the old school solution with newer properties, we can create a class that allows for the same behavior as the shown grid-based solution. Instead of setting the properties on the parent, you should set the _same_ properties on the children by using the child combinator (`parent > child`). Similar to the grid-based solution, we can create a `.exception` class. When children are given this class, they are allowed to have a different width. They can flow outside of the parent's boundaries.

```css
.center > * {
  width: min(100% - 2 * var(--gap), var(--mw));
  margin-inline: auto;
}

/* full-width exception */
.center > .full-w-exc {
  --mw: 100%;
}
```

Setting the `--mw` custom property to 100% allows a child element to become full-width of the parent, while all the other elements are capped at a maximum of `50rem`. You can also set it to `60rem`. This makes the child element it is applied to just a little wider compared to others, but is centered similarly. The use of CSS custom properties even allows you to define utility classes that gave you more control over the layout.

```css
.center-g-sm > * {
  --gap: 0.5rem;
}
```

## Wrapping up

The grid-based solution works well for articles. But when converting the class to a generic layout pattern, I encountered some issues. The main issue was that the `display` property on the parent was taken. By altering the solution used many years before CSS grids became a thing, I was able to come with a new solution. This creates the same layout with the same responsiveness advantages but gives me more flexibility. I am sure I will encounter another case where my new solution just does not work well. But for now, I settled for it.
