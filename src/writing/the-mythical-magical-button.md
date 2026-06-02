---
title: The mythical magical button
date: 2025-06-24
tags:
  - css
layout: post
description: >-
  How to create a minimal stylesheet with modern CSS that allows you to create a whole new range of buttons with just a single custom property.
---

Ah, the button. The centerpiece of every design system. The UI component is the spark of innovation and creativity. It encompasses a wide range of styles and states, yet remains remarkably simple. Every front-end developer faces the challenge of spending too long on button code setup. And yet again, we keep exploring new ways to make it better, easier, or more magical.

Imagine. Here you are, satisfied with the setup of your button in your design system. But you read something on social media about a new UI framework. Or get into a discussion with a colleague on buttons (thanks Jeroen...). You start questioning your whole existence. Well, at least the existence of your button.

## Buttons, buttons, buttons

This is what happened to me in the past days. I got into a _heated discussion_ with a colleague about buttons (you have too many buttons Jeroen!). But the underlying question was about implementation. To be precise: how to cut the amount of CSS required but keep a dynamic button that allows for simple stacking of colors and styles. This requires us to first understand the different buttons we want to create. For this article, we limit it to color-related CSS.

- Variant of the button (e.g., primary, secondary, danger, neutral);
- Styles of the button (e.g., fill, outline, or ghost);
- States of button (`:hover`, `:focus`, `:active`, and `:disabled`);

The easiest starting point is the “states”. This is because they are static. The specs of HTML and CSS define them. Many modern implementations create a custom property for each “property + state” pair. Four custom properties for each color-related property. The amount of custom properties grows at a rapid pace this way.

```css
/* We do not want this */
button {
	--bg: ;
	--bg-hover: ;
	--bg-focus: ;
	--bg-active: ;
	...
}
```

This method grows quickly if you ask me. With 3 color-related properties, you have 12 custom properties. You need to define all 12 for every "variant + style" combination. This way, each combination stays unique. This will become a mess to maintain if you have many variants and styles.

```css
button[data-variant="primary"][data-style="fill"] {
}
button[data-variant="primary"][data-style="outline"] {
}
button[data-variant="primary"][data-style="ghost"] {
}
```

One option is to avoid defining a custom property for each state of every color-related feature. But to define only a basic custom property. It is unlikely that all properties need to be adjusted for various states. For example, a `:hover` can change the `background`, but a `:focus` changes the `border-color`.

```css
button {
  --_background: ; /* background */
  --_border: ; /* border-color */
  --_color: ; /* color */
}

[data-variant="primary"][data-style="fill"]:hover {
  --_background: var(--primary-light);
}

[data-variant="primary"][data-style="fill"]:focus {
  --_border: var(--primary-dark);
}
```

This creates a better overview of what actually is changing for each combination. A better and clearer approach. But you still need to define the various styles for each combination. So the question becomes:

Can we make a button that separates the CSS for `data-variant` and `data-style`? We want to do this without defining each combination. But keep a distinct character for each combination.

Well, the answer is yes! We can write CSS where changing _one custom property_ allows for all this.

::: callout
To be clear. We need less buttons. You should start out with “variants + states”, where the starting variants are: primary, secondary, danger, outline, and ghost. This allows us to make the last method I discussed more lean and understandable (e.g. `[data-variant=“”]:hover`). This is my preferred way.
:::

## Anatomy of a button

Let’s start with the basics. We want to add semantic value to the code. Something more recognizable than slapping CSS classes on the element. So let’s use `data-*` attributes for the variant and style of the button. CSS provides us with the different states. We can extend this concept by adding `data-size` for instance. But for this article, we focus on color-related styles.

```html
<button data-variant="primary" data-style="fill" data-size="large">
  My magical button
</button>
```

Now on to the CSS for the button. To keep it lean, I am focusing on the (custom) properties related to the scope of this post. But the codepen at the bottom of this article gives you all the styles.

We start with the introduction of the API of the class. Developers are meant to change this list of custom properties. You will see that an underscore prepends all properties. This is just a code-style thing to say that these are “internal” properties. We do not mean to change these properties, or we will change them through other CSS classes later.

```css
button {
  --variant: ;
  --_background: transparent;
  --_color: transparent;
  --_border: transparent;
  --_mix: 20%; /* color-mix variable */
  --_width: 3px; /* border-width */
}
```

## Button variants

As you can see in the previous code snippet, there is also one custom property defined, the `--variant`. The variant color is the primary color for the button style. It is the background color for a filled button, for instance.

```css
button[data-variant="primary"] {
  --variant: rebeccapurple;
}
```

And that is it. You only need to change one custom property when adding a new variant, and then everything will work. This is what I was talking about. But we have a lot more work to do to make that happen.

::: callout
Almost no color works well as a `--variant` for light and dark mode. The filled style usually works fine. But the outlined and ghost buttons cause issues in these setups. Make sure to always check your contrasts!
:::

## Button styles

The next step is configuring the different `data-style` options. This is where we set some of our internal custom properties with the `--variant`. Combine the internal custom properties with the two properties defined for our `data-variant`. Let’s start with the “outline” and “ghost” styles. As you can see below, they are pretty similar, but the ghost lacks the border.

```css
button[data-style="outline"] {
  --_border: var(--variant);
  --_color: var(--variant);
}

button[data-style="ghost"] {
  --_color: var(--variant);
}
```

The “fill” style is a bit more interesting. As you would expect, we set `--_background: var(--variant)`. We define the `--_border` for the filled style as well, as we need it later down the line.

```css
button[data-style="fill"] {
  --_background: var(--variant);
  --_border: var(--variant);
  --_color: color(
    from var(--variant) xyz round(up, min(1, max(0, 0.18 - y)))
      round(up, min(1, max(0, 0.18 - y))) round(up, min(1, max(0, 0.18 - y)))
  );
}
```

But what is that magical CSS around `--_color`? That is a snippet of CSS that mathematically determines, based on `--variant` [if white or black provides the best contrast](https://blog.damato.design/posts/css-only-contrast/). It is not 100% waterproof. But in most cases, it will work.

```css
button[data-variant="primary"] {
  --variant: rebeccapurple;
  /* --_color will be white */
}

button[data-variant="secondary"] {
  --variant: limegreen;
  /* --_color will be black */
}
```

But because it is CSS, we can overwrite it if we want.

```css
button[data-variant="neutral"] {
  --variant: #333;
  /* --_color will be white */
}

button[data-variant="neutral"][data-style="fill"] {
  --_color: red;
}
```

## Different states of the button

But everything up until now was not the issue my colleague and I were discussing. The main issue was making sure the button states are clear. We need to find a way to make this work, without the need to duplicate CSS for each “variant + style” combination.

Let’s start simple. The `:disabled` state. We can set the `opacity` to `0.5`. Because each one of the combinations of our buttons is unique, they remain unique in this state.

```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Another easy one, the `:active` state. Some designers create a visual style for this state. But I like the [squishy version of Andy Bell](https://piccalil.li/blog/how-i-build-a-button-component/). When you activate the button (e.g. click on it), it shrinks and pops back to its normal size. Given the impression that the button is pressed. We add the `:not(:disabled)` check to ensure this effect does not trigger on disabled buttons.

```css
button:not(:disabled):active {
  transform: scale(97%);
}
```

Let’s crank up the difficulty a bit and use some fancy modern CSS. To make a uniform hover state that works for all the styles, we are toying with `color-mix()`!

```css
button:not(:disabled):hover {
  background-color: color-mix(
    in oklab,
    var(--_background),
    var(--_color) var(--_mix)
  );
  border-color: color-mix(
    in oklab,
    var(--_border),
    var(--_background) var(--_mix)
  );
}
```

What this function does is mix two colors (duh). The `--_mix` used is to set how much color is mixed. Remember that we set `--_mix: 20%`? This means that we use 20% of `--_color` and 80% `--_background` when mixing for the `background-color`. For the `border-color` we mix between `--_border` and `--_background`. This will give us the following effects:

- **Fill**: the background will become a bit lighter or darker. `--_color` is set by automatically based on contrast. This gives us a darker hover for light variants and a lighter hover for dark variants. The border will remain in its colors, as `--_border` and `--_background` are the same in this style. This gives a nice slight difference between the border and background on hover.
- **Outline**: because `--_background` is transparent in this style, a nice mix with `--variant` for the background will be created. On a light/dark page, the background of the button becomes a very light/dark version of `--variant`. The border of the button will slightly lighten/darken as well.
- **Ghost**: because the border is transparent, we only create an effect on the background, which is the same as the outline style.

The last state that remains is the `:focus` state. I often see a style defined that is closely related to the `:hover` or `:active`, but with slight differences. But why make it difficult? The focus state is not a state you see often on the screen, and when it is there, it should just be recognizable. The original `:focus` sets the `outline` for a reason. So I will settle for the [version by Andy Bell (again!)](https://piccalil.li/blog/how-i-build-a-button-component/). But with minor adjustments.

```css
/* add a focus ring on the outside */
button:not(:disabled):focus {
  outline-width: var(--_width);
  outline-style: solid;
  outline-color: color-mix(in oklab, var(--variant), black var(--_mix));
  outline-offset: var(--_width);
}
```

We make sure that the `outline` is balanced nicely with the `border`. We give it the same width and ensure the space between them is also the same. For the `outline-color` we could do something similar to the hover. But to spice things up, we want to add two requirements: ensure the color is the same for all the states, and ensure contrast in light and dark mode.

```css
@media (prefers-color-scheme: dark) {
  button:not(:disabled):focus {
    outline-color: color-mix(in oklab, var(--variant), white var(--_mix));
  }
}
```

## Live demo

That is it! Don’t believe me? Check [this codepen](https://codepen.io/thecrinkles/pen/GgJwvmJ).

<p class="codepen" data-height="450" data-default-tab="result" data-slug-hash="GgJwvmJ" data-pen-title="The mythical magical button" data-user="kpnnkmp" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/thecrinkles/pen/GgJwvmJ">
  The mythical magical button</a> by Kevin Pennekamp (<a href="https://codepen.io/thecrinkles">@thecrinkles</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

## Wrapping up

We can make a simple stylesheet for buttons by mixing methods from various sources and using modern CSS. If you want to add a new variant, such as “info”, you can do so by defining one variable. Ok, two variables, as you would need to choose a different color for dark mode. And remember: CSS is awesome. Even with all this CSS magic, you can define and style those specific cases that do not fit the general implementation.
