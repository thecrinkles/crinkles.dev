---
title: Using recursive CSS to change styles based on depth
date: 2024-02-11
tags:
  - css
layout: post
description: >-
  Can CSS be used recursively to change styles based on the depth of an element in a container? Well it can, but it is a little tricky.
---

Yesterday I saw an interesting question posted on Reddit. Someone was interested to see if you can, recursively, create a bull’s eye where the colors alternate between two values. The example HTML provided with the image of a bull’s eye was something like the snippet below.

```html
<div>
  <div>
    <div>
      <div></div>
    </div>
  </div>
</div>
```

The person asking the question was looking at a solution that does not require writing CSS like:

```css
div > div > div > ... > div {
  ...;
}
```

This definitely sparked my interest. With the addition of `:has`, CSS becomes so much more powerful. And by default CSS can apply styles recursively, [in some forms](/writing/an-ode-to-the-css-owl-selector/), perfectly already. So this was a challenge I was willing to take on. And I found a solution! Well, sort of.

::: info
Before we get started, I want to make one thing clear. I really, really, have no clue what real-life use-case this trick would have. Going for a non-recursive solution feels more _maintainable_. But it is still cool nonetheless.
:::

## What do we want to achieve?

Instead of the bull's eye, let's try to make something like the visual element below. The more layers are added on the inside, the darker the background color becomes. With just minor additions, this same element can be adjusted to a bull's eye that gets darker and darker.

![Visualization of a horizontal bar, where segments get darker the more they go into the center](/img/recursive-example.png)

To see a live example, check this [codepen](https://codepen.io/thecrinkles/pen/YzgJqVE).

## The starting point in HTML

So how do you implement such a recursive solution? Let's first look at the HTML corresponding to the example shown in this article. It looks exactly like this.

```html
<div class="recursion-wrapper">
  <div class="ping">
    <div class="pong">
      <div class="ping">
        <div class="pong"></div>
      </div>
    </div>
  </div>
</div>
```

As you can see, I am using _alternating_ class names for each new level that I am adding. The reason is simple. It is a language limitation. More specifically, a limitation in CSS. You cannot have self-referencing custom properties in CSS. This would mean that something like the code below _will not work_. It will result in an empty `--depth`.

```css
div {
  --depth: calc(var(--depth) + 1);
}
```

## The CSS implementation

So unfortunately we need alternating classes or need to use something like `ul` and `li` combined to achieve a similar effect. In both cases, the idea is the same. You are going to use two different custom properties, let’s say `--x` and `--y`. In the alternating classes, you are going to set one of them, while referring to the other. Interestingly, this does not count as self-referencing, and works! Let’s look at the code because that is easier to understand.

```css
recursion-wrapper {
  --x: 0;
}

.ping {
  --y: calc(var(--x) + 1);
}

.pong {
  --x: calc(var(--y));
}
```

This is the starting point. Now, with each new level (at least when you alternate `.even` and `.odd`) the values `--x` and `--y` will increase with `1`. To make things a little bit easier, let's add the following selector, so we have one custom property representing the `--depth`. We use the `min()` function here, as we want to start counting from `0`.

```css
.ping,
.pong {
  --depth: min(var(--x), var(--y));
}
```

## Spicing things up with some styles

We now have our depth, compared to a parent, stored in a custom property. We can now do freaky things by combining this value custom property and the `calc()` function 🥳. Like, Uhm, .... Change the background color, font size, padding, etc. dynamically. I guess? Well, the example has the background color changed, so let’s go with that one.

```css
.ping,
.pong {
  background-color: hsl(40 90% calc(90% - var(--depth) * 10%));
}
```

There you have it! A background color that becomes darker the deeper you go, just like the image at the start of the article (or posted again below). If you don't believe it, just look at [this codepen](https://codepen.io/thecrinkles/pen/YzgJqVE) for the results (when you apply a little more CSS, you know height and width etc.).

![Visualization of a horizontal bar, where segments get darker the more they go into the center](/img/recursive-example.png)

## Why would you want this?

I actually don’t know. Sure you can create a bull’s eye effect with it, or have fonts decrease in size the deeper you go. But the question remains this nested HTML + tricky CSS is really worth it? Is it maintainable in the long run?

But it is still cool to explore the edges of CSS. Who knows? One small addition to the language could open up a whole new set of tricks (`:has` certainly did). Only by exploring the edges, you will find them.

::: info
If you are limited to two styles, it is possible to solve this problem with `@container style(...)`. However, this is not supported in FireFox and Safari at the moment this article is published.
:::
