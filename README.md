# v-ripple-directive

Vue directive for ripple effect.

<p align="center">
<img src="https://media.giphy.com/media/MfW6n0zLw2k7K/giphy.gif"/>
</p>

This directive can be used in any element in which you like to achieve such
ripple effect.

<a href="https://pygmyslowloris.github.io/vue-ripple-directive/">Live Demo</a>

##  Installation

```
npm install vue-ripple-directive --save
```

## Important Notice

The directive will work better if the element where you attach it is **relative
positioned**.

Although the directive will try to set `position: relative` if the element does
not have this property.

This is because since v2.0.* the ripple directive changed its positioning
method to avoid trailing issues when elements in the UI move, causing the
ripple to stay in previous position and not in the one that element moved to.

##  Options

Optional parameter to pass to the directive.

| Parameter      | Type      | Values     |
| :--------------- | :-------  | :--------- |
|  `color-value`      | String    |  <b>Default: 'rgba(0, 0, 0, 0.35)'</b>. <br> Accepts either HEX, RGB & RGBA values. For optimal look use RGBA with low opacity. |

##  Modifiers

By default, this directive attaches a click handler to the element as well as
the transition is set for 600ms.

To modify, pass modifiers to the directive:

```
v-ripple.mouseover.500
```

Or modify only one:

```
v-ripple.mouseover
```

##  Usage

Import the directive and add it to Vue.

```
import Ripple from 'vue-ripple-directive'

Vue.directive('ripple', Ripple);
```

Then use on any element you want to achieve the effect.

```
<div v-ripple class="button is-primary">This is a button</div>
```

If you want a custom color just pass a color parameter as `string`. It's best
if you use RGBA colors to achieve a greater effect.

```
<div v-ripple="'rgba(255, 255, 255, 0.35)'"  class="button">I have different color</div>
```

## Global Settings

You can set the default color and z-index for all your ripples:

```
import Ripple from 'vue-ripple-directive'

Ripple.color = 'rgba(255, 255, 255, 0.35)';
Ripple.zIndex = 55;
Vue.directive('ripple', Ripple);
```
