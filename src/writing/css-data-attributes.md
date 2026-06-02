---
title: Binding CSS and JavaScript with HTML data-attributes
date: 2021-04-22
tags:
  - css
  - architecture
layout: post
description: >-
  HTML data-attributes allow you to bind CSS and JavaScript more closely to each other. By utilizing this type of attribute, you can reduce the amount of JavaScript required for styling, and move this responsibility back to CSS.
---

My [CSS architecture](/writing/my-css-architecture) is based on [CUBE CSS](https://cube.fyi). One of the layers of CUBE CSS describes _exceptions_. Although I see exceptions as an integral part of the _block_ layer, they are important nonetheless. Exceptions are often captured by targeting semantic HTML attributes or `data-*` attributes in your CSS selectors. But what do these attributes enable you to do in CSS?

## Introducing HTML `data-*` attributes

HTML 5 was designed with extensibility in mind. On the data level, this is achieved with `data-*` attributes. They allow you to define your attributes on HTML elements. By using the `data-` prefix you cannot define non-existing attributes, or override attributes with non-valid values. If you did, you would invalidate your HTML. But with the `data-*` attributes you are free to add whatever your heart desires. Let's take a closer look at how this looks in HTML.

```html
<button data-type="primary">Click me!</button>
```

In this example, we added the `data-type` attribute to a button, with the value `primary`. All UIs have multiple types of buttons. Most CSS implementations choose to create a base `.btn` class. On top of this class, we define the [modifier from the BEM notation](http://getbem.com/naming/). In this case, `.btn--primary`. Should be enough, right?

Now assume the case where you use an existing UI library for your buttons. Most of these come with a predefined set of button types. But now you want to create another type? Though luck. The library does not allow for defining button types and their styles yourself. You are not able to extend the stylesheet with a style definition for your `newtype` button, extending the `.ui-btn` class of the library.

```css
.ui-btn[data-type="newtype"] {
  background-color: red;
}
```

::: callout
This definition has a higher specificity compared to the `.ui-btn`. It will override any styles defined in the default `.ui-btn` class.
:::

## Linking JavaScript and CSS

Although defined in HTML, `data-*` attributes play a very important part in linking JavaScript with CSS. Many front-end developers tend to use JavaScript to define what CSS classes should be applied to an element. Modern JavaScript frameworks like React make this very easy. Although nothing is wrong with this approach, your code can become unmaintainable quickly. You often go to string manipulations to determine the modifier class it needs to apply.

```jsx
function MyComponent({ type = "primary" }) {
  const classes = `ui-btn ui-btn--${type}`;

  return <button className={classes}>Click Me!</button>;
}
```

If you forget to define the default value of a property, you apply `ui-btn ui-btn--undefined` to your element. What happens when there is more than one type of modifier that can be applied to your element? Your code became a lot less maintainable. By utilizing `data-*` attributes you can avoid this. It allows you to minimize the amount of JavaScript required to determine which styles need to be applied.

On the other hand, it powers up your CSS. The `data-*` attributes allow you the apply pattern matching as well. 'Contains' (`*=`), 'starts with' (`^=`), or 'part of list' (`~=`) are just some pattern matching examples. You can even apply matching using a case insensitive query using `[data-type='primary' i]` in your CSS. But when would you match patterns? Is this not a too complex feature for CSS?

## Using `data-*` for real-life scenarios

Let's take a look at an example to show why it can be of value. Everybody _loves_ creating tables in Excel. You add some bold font to the header cells, as they indicate what information is present in the columns. And the same goes for the first column, as those cells indicate what is in the rows. Maybe you go exotic and apply even more styling next to some bold fonts. Something similar can be created using `data-*`. Look at the partial code-snippet below.

```html
<div class="data-grid">
  <div class="cell" data-type="first-row first-column" />
  <div class="cell" data-type="first-column" />
</div>
```

In the code below, we can target both cells with the displayed CSS selector. As both cells have a different `data-type` we cannot apply one-on-one pattern matching. But with the `~=` operator, we can search if the value is present in a 'space separated list'. So with the CSS selector below, we can target both cells with one definition.

```css
// targets all cells in the first column
.cell[data-type~="first-column"] {
  background-color: red;
}
```

## State machines

But one of the biggest advantages of `data-*` has not yet been discussed: state machines! State machines are upcoming in front-end development but are an old concept. As outlined in [this](https://www.smashingmagazine.com/2018/01/rise-state-machines/) article on CSS-tricks, state machines allow you to simplify your code by mitigating side-effects (e.g. in fetch requests). It is a powerful method to define complex logic. If an element requires different styling based on the state, `data-*` are here to help you out! It is as simple as the snippet below.

```css
.my-element[data-state="init"] {
  background-color: red;
}
```

::: callout
A state machine is a machine that can be in one state at any given time. The machine can change from one state to another, based on transitions. A statechart allows for nesting, delays, automatic transitions, and parallel regions in state machines.
:::

State machines have a lot of value in complex state management. In those cases, styling is often not impacted. Parts of the DOM tree are disregarded based on the current state. Although this could also be achieved with CSS (`display: none`), it is not the main strength of combining CSS and state machines. I have listed more practical use cases below.

- Disabling interactive elements (e.g. buttons) based on the loading state of fetch requests, and provide visual guidance.
- Different visualization of checkboxes (checked, unchecked, semi-checked).
- Different combinations of (un-)selected, hovering, and active.
- CSS animations based on statecharts with timers (e.g. fly-out animation).

By combining semantic HTML, HTML-attributes and `data-*` attributes, styling based on states can be made possible. It allows you to reduce the amount of JavaScript and use CSS what it is intended for in the first place: layout and styling.

## Sending data from JavaScript to CSS with the `attr()` function

Another common example for usage of `data-*` attributes, are tooltips. Using these attributes is by far the easiest way to implement tooltips in complex applications. Just take a look at the small example below. We simply add a `data-tooltip` attribute with the text we want to appear in the tooltip.

```html
<a href="#" data-tooltip="my tooltip text" />
```

For the tooltip to work, we need at least the CSS selectors shown below. More styles are required to make them look nice, but this is a the minimum.

```css
[data-tooltip] {
  position: relative;
}

// :focus is added for a11y reasons
[data-tooltip]:hover::before,
[data-tooltip]:focus::before {
  position: absolute;
  content: attr(data-tooltip);
}
```

The magic that makes this happen is in the `attr()` CSS-function. This function allows you to use any value provided via HTML attributes in your CSS. As most HTML is generated by JavaScript these days, it is just another layer to bind JavaScript to CSS.

## Wrapping up

Good use of semantic HTML attributes make it possible to link CSS to JavaScript. As we have seen, the `data-*` attributes allow the creation of generic UI components that are styling less. Instead of imposing an opinionated style, they allow developers to override every aspect. When combined with semantic HTML-attributes, styling for state machines can be implemented, as in line with [CUBE CSS](https://cube.fyi).
